// /lib/trainers/katakana/romaji.ts
import { KatakanaWord } from "@/interface/katakana-word.interface";

export function checkKatakanaRomanji(input: string, word: KatakanaWord): boolean {
  return input.trim().toLowerCase() === word.Romanji.toLowerCase();
}
