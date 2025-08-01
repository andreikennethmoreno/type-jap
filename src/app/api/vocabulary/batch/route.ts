import { NextResponse } from "next/server";
import hiragana from "@/prisma/data/json/vocabulary/hiragana-words.json";
import katakana from "@/prisma/data/json/vocabulary/katakana-words.json";
import kanji from "@/prisma/data/json/vocabulary/kanji-words.json";

const vocabulary = [
  ...hiragana.vocabulary,
  ...katakana.vocabulary,
  ...kanji.vocabulary,
];

export async function POST(request: Request) {
  const { ids } = await request.json();

  if (!Array.isArray(ids)) {
    return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
  }

  const matches = vocabulary.filter((word) => ids.includes(word.id));
  return NextResponse.json(matches);
}
