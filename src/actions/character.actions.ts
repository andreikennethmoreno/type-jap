import { tokenizeKana } from "@/lib/helpers/tokenize-char";
import hiraganaChars from "../../prisma/data/json/characters/hiragana-characters.json";
import katakanaChars from "../../prisma/data/json/characters/katakana-characters.json";


// ✅ Merge kana characters
const characters = [
  ...hiraganaChars.characters,
  ...katakanaChars.characters,
];

// ✅ Get random kana character prompts based on type (HIRAGANA or KATAKANA)
export async function getRandomCharacters(type: string, count = 10) {
  const filtered = characters.filter(
    (char) => char.type === type.toUpperCase()
  );

  if (filtered.length === 0) return [];

  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}



// ✅ Get a single kana character by ID
export async function getCharacterById(id: string) {
  return characters.find((char) => char.id === id) ?? null;
}

// ✅ Get multiple kana characters by ID array
export async function geCharacterByIds(ids: string[]) {
  return characters.filter((char) => ids.includes(char.id));
}


const smallKanaFallbacks: Record<string, string> = {
  "っ": "つ", "ゃ": "や", "ゅ": "ゆ", "ょ": "よ", "ゎ": "わ",
  "ッ": "ツ", "ャ": "ヤ", "ュ": "ユ", "ョ": "ヨ", "ヮ": "ワ",
};

export async function getCharacterByJapanese(japanese: string) {
  const tokenized = tokenizeKana(japanese);
  const token = tokenized[0]; // Only handling single-token input

  const match = characters.find((char) => char.japanese === token);
  if (match) return match;

  // Handle chōonpu (ー)
  if (token.endsWith("ー")) {
    const base = token.slice(0, -1);
    const baseMatch = characters.find((char) => char.japanese === base);
    if (baseMatch) {
      return {
        ...baseMatch,
        id: `${baseMatch.id}-long`,
        japanese: token,
        romaji: `${baseMatch.romaji}-`,
        meaning: `${baseMatch.meaning} (long vowel)`,
        pronunciation: `${baseMatch.pronunciation} extended with ー`,
        mnemonic: `${baseMatch.mnemonic} — hold the sound!`,
        meta: "long-vowel",
      };
    }
  }

  // Handle sokuon (small っ/ッ)
  if (token === "っ" || token === "ッ") {
    return {
      id: `sokuon-${token}`,
      japanese: token,
      romaji: "",
      meaning: "Sokuon (geminate consonant)",
      pronunciation: "double the next consonant",
      mnemonic: "Pause briefly and repeat the next sound (e.g., 'kko', 'ppa')",
      meta: "sokuon",
    };
  }

  // Handle small kana
  if (smallKanaFallbacks[token]) {
    const base = smallKanaFallbacks[token];
    const baseMatch = characters.find((char) => char.japanese === base);
    if (baseMatch) {
      return {
        ...baseMatch,
        id: `${baseMatch.id}-small`,
        japanese: token,
        romaji: `${baseMatch.romaji} (small)`,
        meaning: `Small form of ${baseMatch.meaning}`,
        pronunciation: "Used in yōon combos like きゃ, しゅ, etc.",
        mnemonic: `${baseMatch.mnemonic} — but mini.`,
        meta: "small-kana",
      };
    }
  }

  // Handle yōon and foreign combos
  const complexMatch = characters.find((char) => char.japanese === token);
  if (complexMatch) {
    return {
      ...complexMatch,
      id: `${complexMatch.id}-combo`,
      japanese: token,
      romaji: complexMatch.romaji,
      meaning: complexMatch.meaning,
      pronunciation: complexMatch.pronunciation,
      mnemonic: complexMatch.mnemonic,
      meta: "compound",
    };
  }

  return null;
}


import imageListJson from "../../prisma/data/kana-image-manifest.json";

type KanaType = "hiragana" | "katakana";

const imageListRaw = imageListJson.imageListRaw as Record<KanaType, string[]>;

export function getImagesForCharacter(kana: string, type: KanaType): string[] {
  if (!imageListRaw || !imageListRaw[type]) return [];

  const matches = imageListRaw[type].filter((entry) =>
    entry.includes(kana)
  );

  // For use with public folder, prefix with `/kana-images/{type}/`
  return matches.map((filename) => `/${type}/${filename}`);
}