import { CrosswordGrid, Clue, AspectRatio } from "../types";

export interface RenderOptions {
  cellSize: number;
  fontSize: number;
  numberFontSize: number;
  aspectRatio: AspectRatio;
  showLetters?: boolean; // For preview vs export
}

export function renderCrosswordSVG(
  grid: CrosswordGrid,
  options: RenderOptions
): string {
  const { cellSize, fontSize, numberFontSize, showLetters = true } = options;
  const { cells, width, height, words } = grid;

  const gridWidth = width * cellSize;
  const gridHeight = height * cellSize;

  // Build SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gridWidth}" height="${gridHeight}" viewBox="0 0 ${gridWidth} ${gridHeight}">`;
  svg += `<style>
    .cell-border { stroke: #000; stroke-width: 2; fill: #fff; }
    .cell-letter { font-family: Arial, sans-serif; font-size: ${fontSize}px; font-weight: bold; text-anchor: middle; dominant-baseline: middle; fill: #000; }
    .cell-number { font-family: Arial, sans-serif; font-size: ${numberFontSize}px; text-anchor: start; dominant-baseline: hanging; fill: #000; }
  </style>`;

  // Draw cells
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = cells[y][x];

      if (cell.letter !== null) {
        const posX = x * cellSize;
        const posY = y * cellSize;

        // Draw cell background and border
        svg += `<rect x="${posX}" y="${posY}" width="${cellSize}" height="${cellSize}" class="cell-border"/>`;

        // Draw number if present
        if (cell.number !== null) {
          svg += `<text x="${posX + 3}" y="${posY + 3}" class="cell-number">${cell.number}</text>`;
        }

        // Draw letter (only if showLetters is true)
        if (showLetters) {
          svg += `<text x="${posX + cellSize / 2}" y="${posY + cellSize / 2}" class="cell-letter">${cell.letter}</text>`;
        }
      }
    }
  }

  svg += `</svg>`;

  return svg;
}

export function getCluesFromGrid(grid: CrosswordGrid): {
  across: Clue[];
  down: Clue[];
} {
  const across: Clue[] = [];
  const down: Clue[] = [];

  for (const word of grid.words) {
    const clue: Clue = {
      number: word.number,
      clue: word.clue,
      direction: word.direction,
    };

    if (word.direction === "across") {
      across.push(clue);
    } else {
      down.push(clue);
    }
  }

  // Sort by number
  across.sort((a, b) => a.number - b.number);
  down.sort((a, b) => a.number - b.number);

  return { across, down };
}

export function renderFullCrosswordImage(
  grid: CrosswordGrid,
  options: RenderOptions
): string {
  const { cellSize, aspectRatio, showLetters = false } = options;
  const { across, down } = getCluesFromGrid(grid);

  // Calculate dimensions based on aspect ratio
  const baseWidth = aspectRatio === "4:3" ? 1200 : 900;
  const baseHeight = aspectRatio === "4:3" ? 900 : 1200;

  const padding = 40;
  const gridWidth = grid.width * cellSize;
  const gridHeight = grid.height * cellSize;

  // Calculate scale to fit grid in upper portion (60% of height)
  const maxGridWidth = baseWidth - padding * 2;
  const maxGridHeight = (baseHeight * 0.5) - padding * 2;
  const scale = Math.min(
    maxGridWidth / gridWidth,
    maxGridHeight / gridHeight,
    1
  );

  const scaledGridWidth = gridWidth * scale;
  const scaledGridHeight = gridHeight * scale;

  // Center grid horizontally
  const gridX = (baseWidth - scaledGridWidth) / 2;
  const gridY = padding;

  // Clues section starts after grid
  const cluesY = gridY + scaledGridHeight + 40;
  const cluesHeight = baseHeight - cluesY - padding;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${baseWidth}" height="${baseHeight}" viewBox="0 0 ${baseWidth} ${baseHeight}">`;
  svg += `<style>
    .cell-border { stroke: #000; stroke-width: ${2 * scale}; fill: #fff; }
    .cell-letter { font-family: Arial, sans-serif; font-size: ${options.fontSize * scale}px; font-weight: bold; text-anchor: middle; dominant-baseline: middle; fill: #000; }
    .cell-number { font-family: Arial, sans-serif; font-size: ${options.numberFontSize * scale}px; text-anchor: start; dominant-baseline: hanging; fill: #000; }
    .clue-heading { font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; fill: #000; }
    .clue-text { font-family: Arial, sans-serif; font-size: 14px; fill: #000; }
  </style>`;

  // Background
  svg += `<rect width="${baseWidth}" height="${baseHeight}" fill="#fff"/>`;

  // Draw crossword grid (scaled and centered)
  svg += `<g transform="translate(${gridX}, ${gridY}) scale(${scale})">`;

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const cell = grid.cells[y][x];

      if (cell.letter !== null) {
        const posX = x * cellSize;
        const posY = y * cellSize;

        svg += `<rect x="${posX}" y="${posY}" width="${cellSize}" height="${cellSize}" class="cell-border"/>`;

        if (cell.number !== null) {
          svg += `<text x="${posX + 3}" y="${posY + 3}" class="cell-number">${cell.number}</text>`;
        }

        if (showLetters) {
          svg += `<text x="${posX + cellSize / 2}" y="${posY + cellSize / 2}" class="cell-letter">${cell.letter}</text>`;
        }
      }
    }
  }

  svg += `</g>`;

  // Draw clues in two columns
  const columnWidth = (baseWidth - padding * 3) / 2;
  const leftColumnX = padding;
  const rightColumnX = baseWidth / 2 + padding / 2;

  // Vågrätt (Left column)
  let currentY = cluesY;
  svg += `<text x="${leftColumnX}" y="${currentY}" class="clue-heading">Vågrätt</text>`;
  currentY += 35;

  for (const clue of across) {
    const text = `${clue.number}. ${clue.clue}`;
    const lines = wrapText(text, columnWidth - 20, 14);

    for (const line of lines) {
      if (currentY + 20 > baseHeight - padding) break;
      svg += `<text x="${leftColumnX + 10}" y="${currentY}" class="clue-text">${escapeXml(line)}</text>`;
      currentY += 20;
    }
    currentY += 5;
  }

  // Lodrätt (Right column)
  currentY = cluesY;
  svg += `<text x="${rightColumnX}" y="${currentY}" class="clue-heading">Lodrätt</text>`;
  currentY += 35;

  for (const clue of down) {
    const text = `${clue.number}. ${clue.clue}`;
    const lines = wrapText(text, columnWidth - 20, 14);

    for (const line of lines) {
      if (currentY + 20 > baseHeight - padding) break;
      svg += `<text x="${rightColumnX + 10}" y="${currentY}" class="clue-text">${escapeXml(line)}</text>`;
      currentY += 20;
    }
    currentY += 5;
  }

  svg += `</svg>`;

  return svg;
}

function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  // Approximate character width (this is rough, but works for most cases)
  const charWidth = fontSize * 0.5;
  const maxCharsPerLine = Math.floor(maxWidth / charWidth);

  for (const word of words) {
    const testLine = currentLine + (currentLine ? " " : "") + word;

    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
