import { NextResponse } from "next/server";
import hiragana from "@/prisma/data/json/vocabulary/hiragana-words.json";
import katakana from "@/prisma/data/json/vocabulary/katakana-words.json";
import kanji from "@/prisma/data/json/vocabulary/kanji-words.json";

const vocabulary = [
  ...hiragana.vocabulary,
  ...katakana.vocabulary,
  ...kanji.vocabulary,
];

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const word = vocabulary.find((word) => word.id === params.id);
  return NextResponse.json(word ?? null);
}
