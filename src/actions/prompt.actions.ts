"use server";

import { toPromptType } from "@/lib/helpers/prompt";

// ✅ Import vocabulary JSON data
import hiragana from "../../prisma/data/json/hiragana-words.json";
import katakana from "../../prisma/data/json/katakana-words.json";
import kanji from "../../prisma/data/json/kanji-words.json";

// ✅ Merge all vocab arrays
const vocabulary = [
  ...hiragana.vocabulary,
  ...katakana.vocabulary,
  ...kanji.vocabulary,
];

// ✅ Get random prompts based on type
export async function getRandomPrompts(type: string, count = 10) {
  const normalizedType = toPromptType(type);
  const filtered = vocabulary.filter((word) => word.type === normalizedType);

  if (filtered.length === 0) return [];

  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ✅ Get a single prompt by ID
export async function getPromptById(id: string) {
  return vocabulary.find((word) => word.id === id) ?? null;
}

// ✅ Get multiple prompts by ID array
export async function getPromptsByIds(ids: string[]) {
  return vocabulary.filter((word) => ids.includes(word.id));
}
