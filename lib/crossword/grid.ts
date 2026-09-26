import { Cell, CrosswordGrid, PlacedWord } from "../types";

export function createEmptyGrid(width: number, height: number): Cell[][] {
  const grid: Cell[][] = [];
  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      grid[y][x] = {
        letter: null,
        number: null,
        isBlack: false,
      };
    }
  }
  return grid;
}

export function canPlaceWord(
  grid: Cell[][],
  word: string,
  x: number,
  y: number,
  direction: "across" | "down"
): boolean {
  const height = grid.length;
  const width = grid[0]?.length || 0;

  if (direction === "across") {
    // Check bounds
    if (x + word.length > width || y >= height || y < 0 || x < 0) {
      return false;
    }

    // Check if there's a letter before the word
    if (x > 0 && grid[y][x - 1].letter !== null) {
      return false;
    }

    // Check if there's a letter after the word
    if (x + word.length < width && grid[y][x + word.length].letter !== null) {
      return false;
    }

    // Check each position
    for (let i = 0; i < word.length; i++) {
      const cell = grid[y][x + i];

      // If cell has a letter, it must match
      if (cell.letter !== null && cell.letter !== word[i]) {
        return false;
      }

      // Check cells above and below (must be empty unless we're crossing)
      if (cell.letter === null) {
        if (y > 0 && grid[y - 1][x + i].letter !== null) {
          return false;
        }
        if (y < height - 1 && grid[y + 1][x + i].letter !== null) {
          return false;
        }
      }
    }
  } else {
    // direction === "down"
    // Check bounds
    if (y + word.length > height || x >= width || x < 0 || y < 0) {
      return false;
    }

    // Check if there's a letter before the word
    if (y > 0 && grid[y - 1][x].letter !== null) {
      return false;
    }

    // Check if there's a letter after the word
    if (y + word.length < height && grid[y + word.length][x].letter !== null) {
      return false;
    }

    // Check each position
    for (let i = 0; i < word.length; i++) {
      const cell = grid[y + i][x];

      // If cell has a letter, it must match
      if (cell.letter !== null && cell.letter !== word[i]) {
        return false;
      }

      // Check cells left and right (must be empty unless we're crossing)
      if (cell.letter === null) {
        if (x > 0 && grid[y + i][x - 1].letter !== null) {
          return false;
        }
        if (x < width - 1 && grid[y + i][x + 1].letter !== null) {
          return false;
        }
      }
    }
  }

  return true;
}

export function placeWord(
  grid: Cell[][],
  word: string,
  x: number,
  y: number,
  direction: "across" | "down"
): void {
  if (direction === "across") {
    for (let i = 0; i < word.length; i++) {
      grid[y][x + i].letter = word[i];
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      grid[y + i][x].letter = word[i];
    }
  }
}

export function removeWord(
  grid: Cell[][],
  word: string,
  x: number,
  y: number,
  direction: "across" | "down",
  placedWords: PlacedWord[]
): void {
  const positions: Array<{ x: number; y: number }> = [];

  if (direction === "across") {
    for (let i = 0; i < word.length; i++) {
      positions.push({ x: x + i, y });
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      positions.push({ x, y: y + i });
    }
  }

  // Only remove letters that aren't used by other words
  for (const pos of positions) {
    const isUsedByOther = placedWords.some((pw) => {
      if (direction === "across" && pw.direction === "down") {
        return pw.x === pos.x && pos.y >= pw.y && pos.y < pw.y + pw.word.length;
      }
      if (direction === "down" && pw.direction === "across") {
        return pw.y === pos.y && pos.x >= pw.x && pos.x < pw.x + pw.word.length;
      }
      return false;
    });

    if (!isUsedByOther) {
      grid[pos.y][pos.x].letter = null;
      grid[pos.y][pos.x].number = null;
    }
  }
}

export function compressGrid(grid: Cell[][]): {
  grid: Cell[][];
  offsetX: number;
  offsetY: number;
} {
  const height = grid.length;
  const width = grid[0]?.length || 0;

  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;

  // Find bounds
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x].letter !== null) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // If grid is empty
  if (maxX === -1) {
    return { grid: createEmptyGrid(1, 1), offsetX: 0, offsetY: 0 };
  }

  // Create compressed grid
  const newWidth = maxX - minX + 1;
  const newHeight = maxY - minY + 1;
  const newGrid = createEmptyGrid(newWidth, newHeight);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      newGrid[y - minY][x - minX] = { ...grid[y][x] };
    }
  }

  return { grid: newGrid, offsetX: minX, offsetY: minY };
}

export function getBounds(grid: Cell[][]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  const height = grid.length;
  const width = grid[0]?.length || 0;

  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x].letter !== null) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return { minX, maxX, minY, maxY };
}
