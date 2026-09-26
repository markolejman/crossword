"use client";

import { Clue } from "@/lib/types";

interface ClueListProps {
  across: Clue[];
  down: Clue[];
}

export function ClueList({ across, down }: ClueListProps) {
  if (across.length === 0 && down.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-8 mt-8">
      {/* Vågrätt */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-blush">Vågrätt</h3>
        <div className="space-y-2">
          {across.map((clue) => (
            <div key={`across-${clue.number}`} className="text-sm text-foreground">
              <span className="font-semibold">{clue.number}.</span> {clue.clue}
            </div>
          ))}
        </div>
      </div>

      {/* Lodrätt */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-blush">Lodrätt</h3>
        <div className="space-y-2">
          {down.map((clue) => (
            <div key={`down-${clue.number}`} className="text-sm text-foreground">
              <span className="font-semibold">{clue.number}.</span> {clue.clue}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
