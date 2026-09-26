import { AspectRatio, ClueAnswer, CrosswordGrid } from "@/lib/types";

export const STORAGE_KEY = "fun-with-words-session";

export interface PersistedSession {
  clues: ClueAnswer[];
  finalGrid: CrosswordGrid | null;
  aspectRatio: AspectRatio;
}

const DEFAULT_CLUE = (): ClueAnswer => ({
  id: crypto.randomUUID(),
  clue: "",
  answer: "",
});

export function createEmptySession(): PersistedSession {
  return {
    clues: [DEFAULT_CLUE()],
    finalGrid: null,
    aspectRatio: "4:3",
  };
}

function isClueAnswer(value: unknown): value is ClueAnswer {
  if (typeof value !== "object" || value === null) return false;
  const clue = value as Record<string, unknown>;
  return (
    typeof clue.id === "string" &&
    typeof clue.clue === "string" &&
    typeof clue.answer === "string"
  );
}

function isAspectRatio(value: unknown): value is AspectRatio {
  return value === "4:3" || value === "3:4";
}

function isPersistedSession(value: unknown): value is PersistedSession {
  if (typeof value !== "object" || value === null) return false;
  const session = value as Record<string, unknown>;

  if (!Array.isArray(session.clues) || !session.clues.every(isClueAnswer)) {
    return false;
  }

  if (session.clues.length === 0) return false;
  if (!isAspectRatio(session.aspectRatio)) return false;
  if (session.finalGrid !== null && typeof session.finalGrid !== "object") {
    return false;
  }

  return true;
}

export function loadSession(): PersistedSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isPersistedSession(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: PersistedSession): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Kunde inte spara session:", error);
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
