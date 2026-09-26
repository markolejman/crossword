import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeAnswer(answer: string): string {
  return answer
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-ZÅÄÖ]/g, "");
}
