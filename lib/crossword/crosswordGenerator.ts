import { ClueAnswer, PlacedWord, CrosswordGrid } from "../types";
import { createEmptyGrid, placeWord, compressGrid } from "./grid";
import { findBestPlacement, expandGrid } from "./placementEngine";
import { assignNumbers } from "./numbering";

export function generateCrossword(clues: ClueAnswer[]): CrosswordGrid | null {
  if (clues.length === 0) {
    return null;
  }

  // Filter out empty answers
  const validClues = clues.filter(c => c.answer.length > 0);

  // Sort words by length (longest first)
  const sortedClues = [...validClues].sort(
    (a, b) => b.answer.length - a.answer.length
  );

  // Start with a reasonably sized grid
  const initialSize = Math.max(20, sortedClues[0].answer.length + 5);
  let grid = createEmptyGrid(initialSize, initialSize);
  const placedWords: PlacedWord[] = [];
  const unplacedClues: ClueAnswer[] = [];

  // Place first word in the center
  const firstClue = sortedClues[0];
  const startX = Math.floor((initialSize - firstClue.answer.length) / 2);
  const startY = Math.floor(initialSize / 2);

  placeWord(grid, firstClue.answer, startX, startY, "across");
  placedWords.push({
    id: firstClue.id,
    word: firstClue.answer,
    clue: firstClue.clue,
    x: startX,
    y: startY,
    direction: "across",
    number: 1, // Will be reassigned later
  });

  // Try to place remaining words
  for (let i = 1; i < sortedClues.length; i++) {
    const clue = sortedClues[i];
    const placement = findBestPlacement(grid, clue.answer, placedWords);

    if (placement) {
      placeWord(grid, clue.answer, placement.x, placement.y, placement.direction);
      placedWords.push({
        id: clue.id,
        word: clue.answer,
        clue: clue.clue,
        x: placement.x,
        y: placement.y,
        direction: placement.direction,
        number: 0, // Will be assigned later
      });
    } else {
      // Try expanding grid
      const expandedGrid = expandGrid(grid, initialSize + 10, initialSize + 10);
      const placementAfterExpand = findBestPlacement(
        expandedGrid,
        clue.answer,
        placedWords
      );

      if (placementAfterExpand) {
        grid = expandedGrid;
        placeWord(
          grid,
          clue.answer,
          placementAfterExpand.x,
          placementAfterExpand.y,
          placementAfterExpand.direction
        );
        placedWords.push({
          id: clue.id,
          word: clue.answer,
          clue: clue.clue,
          x: placementAfterExpand.x,
          y: placementAfterExpand.y,
          direction: placementAfterExpand.direction,
          number: 0,
        });
      } else {
        // Can't place this word
        unplacedClues.push(clue);
      }
    }
  }

  // Compress the grid to remove empty space
  const { grid: compressedGrid, offsetX, offsetY } = compressGrid(grid);

  // Adjust word positions after compression
  for (const word of placedWords) {
    word.x -= offsetX;
    word.y -= offsetY;
  }

  // Assign numbers
  assignNumbers(compressedGrid, placedWords);

  return {
    cells: compressedGrid,
    width: compressedGrid[0]?.length || 0,
    height: compressedGrid.length,
    words: placedWords,
  };
}

export function generateLivePreview(clues: ClueAnswer[]): CrosswordGrid | null {
  // Use the same algorithm but with a smaller initial grid for faster preview
  return generateCrossword(clues);
}
