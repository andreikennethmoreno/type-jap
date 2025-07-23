// /lib/trainers/katakana/romaji.ts

import { JapanesePrompt } from "@/interface/katakana-word.interface";

export function checkKatakanaRomaji(
  input: string,
  word: JapanesePrompt
): boolean {
  const normalize = (str: string) => str.replace(/[\s-]/g, "").toLowerCase();
  return normalize(input) === normalize(word.romaji);
}
