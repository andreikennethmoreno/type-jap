import { NextResponse } from "next/server";
import { toVocabType } from "@/lib/helpers/prompt";
import { loadJLPTLevels } from "@/actions/jlpt-config.actions";

import hiragana from "@/prisma/data/json/vocabulary/hiragana-words.json";
import katakana from "@/prisma/data/json/vocabulary/katakana-words.json";
import kanji from "@/prisma/data/json/vocabulary/kanji-words.json";

const vocabulary = [
  ...hiragana.vocabulary,
  ...katakana.vocabulary,
  ...kanji.vocabulary,
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const count = parseInt(searchParams.get("count") || "10", 10);

  if (!type) {
    return NextResponse.json({ error: "Missing type param" }, { status: 400 });
  }

  const normalizedType = toVocabType(type);
  const userLevels = await loadJLPTLevels();

  const filtered = vocabulary.filter(
    (word) =>
      word.type === normalizedType &&
      userLevels.includes(word.level?.toUpperCase?.())
  );

  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return NextResponse.json(shuffled.slice(0, count));
}
