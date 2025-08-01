import { NextResponse } from "next/server";
import { tokenizeKana } from "@/lib/helpers/tokenize-char";
import hiraganaChars from "@/prisma/data/json/characters/hiragana-characters.json";
import katakanaChars from "@/prisma/data/json/characters/katakana-characters.json";

const characters = [...hiraganaChars.characters, ...katakanaChars.characters];

const smallKanaFallbacks: Record<string, string> = {
  "っ": "つ", "ゃ": "や", "ゅ": "ゆ", "ょ": "よ", "ゎ": "わ",
  "ッ": "ツ", "ャ": "ヤ", "ュ": "ユ", "ョ": "ヨ", "ヮ": "ワ",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kana = searchParams.get("kana");

  if (!kana) return NextResponse.json({ error: "Missing kana" }, { status: 400 });

  const token = tokenizeKana(kana)[0];
  const match = characters.find((c) => c.japanese === token);

  if (match) return NextResponse.json(match);

  if (token.endsWith("ー")) {
    const base = token.slice(0, -1);
    const baseMatch = characters.find((c) => c.japanese === base);
    if (baseMatch) {
      return NextResponse.json({
        ...baseMatch,
        id: `${baseMatch.id}-long`,
        japanese: token,
        romaji: `${baseMatch.romaji}-`,
        meaning: `${baseMatch.meaning} (long vowel)`,
        pronunciation: `${baseMatch.pronunciation} extended with ー`,
        mnemonic: `${baseMatch.mnemonic} — hold the sound!`,
        meta: "long-vowel",
      });
    }
  }

  if (token === "っ" || token === "ッ") {
    return NextResponse.json({
      id: `sokuon-${token}`,
      japanese: token,
      romaji: "",
      meaning: "Sokuon (geminate consonant)",
      pronunciation: "double the next consonant",
      mnemonic: "Pause briefly and repeat the next sound (e.g., 'kko', 'ppa')",
      meta: "sokuon",
    });
  }

  if (smallKanaFallbacks[token]) {
    const base = smallKanaFallbacks[token];
    const baseMatch = characters.find((c) => c.japanese === base);
    if (baseMatch) {
      return NextResponse.json({
        ...baseMatch,
        id: `${baseMatch.id}-small`,
        japanese: token,
        romaji: `${baseMatch.romaji} (small)`,
        meaning: `Small form of ${baseMatch.meaning}`,
        pronunciation: "Used in yōon combos like きゃ, しゅ, etc.",
        mnemonic: `${baseMatch.mnemonic} — but mini.`,
        meta: "small-kana",
      });
    }
  }

  return NextResponse.json(null);
}
