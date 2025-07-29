import hiraganaChars from "../../prisma/data/json/characters/hiragana-characters.json";
import katakanaChars from "../../prisma/data/json/characters/katakana-characters.json";


// ✅ Merge kana characters
const characters = [
  ...hiraganaChars.characters,
  ...katakanaChars.characters,
];

// ✅ Get random kana character prompts based on type (HIRAGANA or KATAKANA)
export async function getRandomKanaPrompts(type: string, count = 10) {
  const filtered = characters.filter(
    (char) => char.type === type.toUpperCase()
  );

  if (filtered.length === 0) return [];

  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ✅ Get a single kana character by ID
export async function getKanaPromptById(id: string) {
  return characters.find((char) => char.id === id) ?? null;
}

// ✅ Get multiple kana characters by ID array
export async function getKanaPromptsByIds(ids: string[]) {
  return characters.filter((char) => ids.includes(char.id));
}

const smallKanaFallbacks: Record<string, string> = {
  っ: "つ",
  ゃ: "や",
  ゅ: "ゆ",
  ょ: "よ",
  ゎ: "わ",
};

export async function getKanaPromptByCharacter(japanese: string) {
  const match = characters.find((char) => char.japanese === japanese);
  if (match) return match;

  // Handle long vowel fallback for katakana/hiragana
  if (japanese.endsWith("ー")) {
    const base = japanese.slice(0, -1);
    const baseMatch = characters.find((char) => char.japanese === base);
    if (baseMatch) {
      return {
        ...baseMatch,
        id: `${baseMatch.id}-long`,
        japanese,
        romaji: `${baseMatch.romaji} (long)`,
        meaning: `${baseMatch.meaning} (long vowel)`,
        pronunciation: `${baseMatch.pronunciation} extended with ー`,
        mnemonic: `${baseMatch.mnemonic} — Just hold the sound longer!`,
      };
    }
  }

  // Handle small kana fallback
  if (smallKanaFallbacks[japanese]) {
    const base = smallKanaFallbacks[japanese];
    const baseMatch = characters.find((char) => char.japanese === base);
    if (baseMatch) {
      return {
        ...baseMatch,
        id: `${baseMatch.id}-small`,
        japanese,
        romaji: `${baseMatch.romaji} (small)`,
        meaning: `Small version of ${baseMatch.meaning}`,
        pronunciation: `Used to form combos like きゃ, しゃ, etc.`,
        mnemonic: `${baseMatch.mnemonic} — but mini.`,
      };
    }
  }

  return null;
}

