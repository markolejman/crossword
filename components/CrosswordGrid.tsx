"use client";

import { CrosswordGrid as CrosswordGridType } from "@/lib/types";
import { useMemo } from "react";

interface CrosswordGridProps {
  grid: CrosswordGridType | null;
  cellSize?: number;
  showPreview?: boolean;
}

export function CrosswordGrid({
  grid,
  cellSize = 40,
  showPreview = false,
}: CrosswordGridProps) {
  const svgContent = useMemo(() => {
    if (!grid) return null;

    const { cells, width, height } = grid;
    const gridWidth = width * cellSize;
    const gridHeight = height * cellSize;

    const fontSize = cellSize * 0.5;
    const numberFontSize = cellSize * 0.25;

    return (
      <svg
        width={gridWidth}
        height={gridHeight}
        viewBox={`0 0 ${gridWidth} ${gridHeight}`}
        className="border border-gray-200 bg-white"
      >
        {cells.map((row, y) =>
          row.map((cell, x) => {
            if (cell.letter === null) return null;

            const posX = x * cellSize;
            const posY = y * cellSize;

            return (
              <g key={`${x}-${y}`}>
                {/* Cell background and border */}
                <rect
                  x={posX}
                  y={posY}
                  width={cellSize}
                  height={cellSize}
                  fill="white"
                  stroke="black"
                  strokeWidth={2}
                />

                {/* Number */}
                {cell.number !== null && (
                  <text
                    x={posX + 3}
                    y={posY + 3}
                    fontSize={numberFontSize}
                    fontFamily="Arial, sans-serif"
                    dominantBaseline="hanging"
                    fill="black"
                  >
                    {cell.number}
                  </text>
                )}

                {/* Letter */}
                {!showPreview && (
                  <text
                    x={posX + cellSize / 2}
                    y={posY + cellSize / 2}
                    fontSize={fontSize}
                    fontFamily="Arial, sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="black"
                  >
                    {cell.letter}
                  </text>
                )}
              </g>
            );
          })
        )}
      </svg>
    );
  }, [grid, cellSize, showPreview]);

  if (!grid) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-gray-500">
          Lägg till frågor för att se en förhandsvisning
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
      {svgContent}
    </div>
  );
}
