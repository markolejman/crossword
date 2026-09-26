"use client";

import { ClueAnswer } from "@/lib/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X, Check } from "lucide-react";
import { sanitizeAnswer } from "@/lib/utils";

interface ClueInputProps {
  clue: ClueAnswer;
  onChange: (clue: ClueAnswer) => void;
  onRemove: () => void;
  isPlaced?: boolean;
}

export function ClueInput({ clue, onChange, onRemove, isPlaced = false }: ClueInputProps) {
  const handleClueChange = (value: string) => {
    onChange({ ...clue, clue: value });
  };

  const handleAnswerChange = (value: string) => {
    const sanitized = sanitizeAnswer(value);
    onChange({ ...clue, answer: sanitized });
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1 grid grid-cols-2 gap-2">
        <Input
          placeholder="Fråga"
          value={clue.clue}
          onChange={(e) => handleClueChange(e.target.value)}
        />
        <div className="relative">
          <Input
            placeholder="Svar"
            value={clue.answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="font-mono uppercase pr-10"
          />
          {isPlaced && clue.answer.length > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Check className="h-5 w-5 text-green-600" />
            </div>
          )}
        </div>
      </div>
      <Button
        variant="destructive"
        size="icon"
        onClick={onRemove}
        type="button"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
