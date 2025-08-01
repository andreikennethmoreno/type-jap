import { NextResponse } from "next/server";
import hiraganaChars from "@/prisma/data/json/characters/hiragana-characters.json";
import katakanaChars from "@/prisma/data/json/characters/katakana-characters.json";

const characters = [...hiraganaChars.characters, ...katakanaChars.characters];

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const char = characters.find((c) => c.id === params.id);
  return NextResponse.json(char ?? null);
}
