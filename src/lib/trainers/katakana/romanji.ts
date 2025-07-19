// /lib/trainers/katakana/romaji.ts
import { KatakanaWord } from "@/interface/katakana-word.interface";

export function checkKatakanaRomanji(
  input: string,
  word: KatakanaWord
): boolean {
  const normalize = (str: string) => str.replace(/[\s-]/g, "").toLowerCase();
  return normalize(input) === normalize(word.Romanji);
}