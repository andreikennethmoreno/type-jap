// /lib/trainers/romaji.ts

import { JapanesePrompt } from "@/interface/japanese-prompt.interface";

export function checkRomaji(
  input: string,
  word: JapanesePrompt
): boolean {
  const normalize = (str: string) => str.replace(/[\s-]/g, "").toLowerCase();
  return normalize(input) === normalize(word.romaji);
}
