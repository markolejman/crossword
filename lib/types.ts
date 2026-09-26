export interface ClueAnswer {
  id: string;
  clue: string;
  answer: string;
}

export interface PlacedWord {
  id: string;
  word: string;
  clue: string;
  x: number;
  y: number;
  direction: "across" | "down";
  number: number;
}

export interface Cell {
  letter: string | null;
  number: number | null;
  isBlack: boolean;
}

export interface CrosswordGrid {
  cells: Cell[][];
  width: number;
  height: number;
  words: PlacedWord[];
}

export interface Clue {
  number: number;
  clue: string;
  direction: "across" | "down";
}

export type AspectRatio = "3:4" | "4:3";
