import { Cell, PlacedWord, ClueAnswer } from "../types";
import { canPlaceWord, placeWord, createEmptyGrid } from "./grid";

interface PlacementOption {
  x: number;
  y: number;
  direction: "across" | "down";
  score: number;
  crossings: number;
}

export function findCrossings(
  grid: Cell[][],
  word: string,
  placedWords: PlacedWord[]
): PlacementOption[] {
  const options: PlacementOption[] = [];
  const height = grid.length;
  const width = grid[0]?.length || 0;

  // Try both directions
  for (const direction of ["across", "down"] as const) {
    // For each cell in the grid
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // For each letter position in the word
        for (let letterIdx = 0; letterIdx < word.length; letterIdx++) {
          let startX = x;
          let startY = y;

          // Calculate starting position based on direction
          if (direction === "across") {
            startX = x - letterIdx;
          } else {
            startY = y - letterIdx;
          }

          // Check if placement is valid
          if (canPlaceWord(grid, word, startX, startY, direction)) {
            const crossings = countCrossings(
              grid,
              word,
              startX,
              startY,
              direction
            );

            // Only add if it creates at least one crossing (for non-first words)
            if (placedWords.length === 0 || crossings > 0) {
              const score = calculateScore(
                grid,
                word,
                startX,
                startY,
                direction,
                placedWords
              );

              options.push({
                x: startX,
                y: startY,
                direction,
                score,
                crossings,
              });
            }
          }
        }
      }
    }
  }

  return options;
}

function countCrossings(
  grid: Cell[][],
  word: string,
  x: number,
  y: number,
  direction: "across" | "down"
): number {
  let crossings = 0;

  if (direction === "across") {
    for (let i = 0; i < word.length; i++) {
      if (grid[y][x + i].letter !== null && grid[y][x + i].letter === word[i]) {
        crossings++;
      }
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      if (grid[y + i][x].letter !== null && grid[y + i][x].letter === word[i]) {
        crossings++;
      }
    }
  }

  return crossings;
}

function calculateScore(
  grid: Cell[][],
  word: string,
  x: number,
  y: number,
  direction: "across" | "down",
  placedWords: PlacedWord[]
): number {
  let score = 0;

  // Count crossings (most important)
  const crossings = countCrossings(grid, word, x, y, direction);
  score += crossings * 100;

  // Prefer central positions
  const centerX = grid[0].length / 2;
  const centerY = grid.length / 2;
  const distanceFromCenter = Math.abs(x - centerX) + Math.abs(y - centerY);
  score -= distanceFromCenter * 2;

  // Prefer positions that don't increase grid size too much
  const height = grid.length;
  const width = grid[0].length;
  const endX = direction === "across" ? x + word.length : x;
  const endY = direction === "down" ? y + word.length : y;

  if (endX > width || endY > height) {
    score -= 50;
  }

  // Prefer positions close to existing words
  if (placedWords.length > 0) {
    const minDistance = Math.min(
      ...placedWords.map((pw) => {
        const dx = Math.abs(pw.x - x);
        const dy = Math.abs(pw.y - y);
        return dx + dy;
      })
    );
    score -= minDistance * 3;
  }

  return score;
}

export function findBestPlacement(
  grid: Cell[][],
  word: string,
  placedWords: PlacedWord[]
): PlacementOption | null {
  const options = findCrossings(grid, word, placedWords);

  if (options.length === 0) {
    return null;
  }

  // Sort by score (highest first)
  options.sort((a, b) => b.score - a.score);

  return options[0];
}

/**
 * Grow the grid by adding empty cells to the right/bottom.
 * Existing cell coordinates stay valid (no re-centering), so placed word
 * positions remain correct.
 */
export function expandGrid(
  grid: Cell[][],
  targetWidth: number,
  targetHeight: number
): Cell[][] {
  const currentHeight = grid.length;
  const currentWidth = grid[0]?.length || 0;

  if (targetWidth <= currentWidth && targetHeight <= currentHeight) {
    return grid;
  }

  const newWidth = Math.max(targetWidth, currentWidth);
  const newHeight = Math.max(targetHeight, currentHeight);
  const newGrid = createEmptyGrid(newWidth, newHeight);

  for (let y = 0; y < currentHeight; y++) {
    for (let x = 0; x < currentWidth; x++) {
      newGrid[y][x] = { ...grid[y][x] };
    }
  }

  return newGrid;
}
