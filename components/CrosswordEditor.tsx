"use client";

import { ClueAnswer } from "@/lib/types";
import { ClueInput } from "./ClueInput";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface CrosswordEditorProps {
  clues: ClueAnswer[];
  onChange: (clues: ClueAnswer[]) => void;
  placedWordIds?: Set<string>;
}

export function CrosswordEditor({ clues, onChange, placedWordIds = new Set() }: CrosswordEditorProps) {
  const addClue = () => {
    const newClue: ClueAnswer = {
      id: crypto.randomUUID(),
      clue: "",
      answer: "",
    };
    onChange([...clues, newClue]);
  };

  const updateClue = (index: number, updatedClue: ClueAnswer) => {
    const newClues = [...clues];
    newClues[index] = updatedClue;
    onChange(newClues);
  };

  const removeClue = (index: number) => {
    const newClues = clues.filter((_, i) => i !== index);
    onChange(newClues);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {clues.map((clue, index) => (
          <ClueInput
            key={clue.id}
            clue={clue}
            onChange={(updated) => updateClue(index, updated)}
            onRemove={() => removeClue(index)}
            isPlaced={placedWordIds.has(clue.id)}
          />
        ))}
      </div>

      <Button
        onClick={addClue}
        variant="outline"
        className="w-full"
        type="button"
      >
        <Plus className="h-4 w-4 mr-2" />
        Lägg till fråga
      </Button>
    </div>
  );
}
