import { Cell, PlacedWord } from "../types";

export function assignNumbers(grid: Cell[][], words: PlacedWord[]): void {
  // Clear all numbers first
  for (const row of grid) {
    for (const cell of row) {
      cell.number = null;
    }
  }

  // Sort words by position (top to bottom, left to right)
  const sortedWords = [...words].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    if (a.x !== b.x) return a.x - b.x;
    // If same position, across comes before down
    if (a.direction === "across" && b.direction === "down") return -1;
    if (a.direction === "down" && b.direction === "across") return 1;
    return 0;
  });

  let currentNumber = 1;
  const numberedPositions = new Set<string>();

  for (const word of sortedWords) {
    const cell = grid[word.y]?.[word.x];
    if (!cell) continue;

    const posKey = `${word.x},${word.y}`;

    if (!numberedPositions.has(posKey)) {
      cell.number = currentNumber;
      word.number = currentNumber;
      numberedPositions.add(posKey);
      currentNumber++;
    } else if (cell.number !== null) {
      word.number = cell.number;
    }
  }
}
