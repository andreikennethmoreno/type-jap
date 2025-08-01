import { NextResponse } from "next/server";
import hiraganaChars from "@/prisma/data/json/characters/hiragana-characters.json";
import katakanaChars from "@/prisma/data/json/characters/katakana-characters.json";

const characters = [...hiraganaChars.characters, ...katakanaChars.characters];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type")?.toUpperCase();
  const count = parseInt(searchParams.get("count") || "10", 10);

  if (!type || (type !== "HIRAGANA" && type !== "KATAKANA")) {
    return NextResponse.json({ error: "Invalid or missing 'type'" }, { status: 400 });
  }

  const filtered = characters.filter((char) => char.type === type);
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  const result = shuffled.slice(0, count);

  return NextResponse.json(result);
}
