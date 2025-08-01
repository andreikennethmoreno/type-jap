"use server";

import { toVocabType } from "@/lib/helpers/prompt";
import { loadJLPTLevels } from "@/actions/jlpt-config.actions";

// ✅ Import vocabulary JSON data
import hiragana from "../prisma/data/json/vocabulary/hiragana-words.json"
import katakana from "../prisma/data/json/vocabulary/katakana-words.json";
import kanji from "../prisma/data/json/vocabulary/kanji-words.json";



// ✅ Merge all vocab arrays
const vocabulary = [
  ...hiragana.vocabulary,
  ...katakana.vocabulary,
  ...kanji.vocabulary,
];

// ✅ Get random prompts based on type AND JLPT level config
export async function getRandomVocabs(type: string, count = 10) {
  const normalizedType = toVocabType(type);
  const userLevels = await loadJLPTLevels();

  const filtered = vocabulary.filter(
    (word) =>
      word.type === normalizedType &&
      userLevels.includes(word.level?.toUpperCase?.())
  );

  if (filtered.length === 0) return [];

  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ✅ Get a single prompt by ID
export async function getVocabById(id: string) {
  return vocabulary.find((word) => word.id === id) ?? null;
}

// ✅ Get multiple prompts by ID array
export async function getVocabByIds(ids: string[]) {
  return vocabulary.filter((word) => ids.includes(word.id));
}
