// 🔤 Hiragana yōon combos
const hiraganaGroups = [
  "きゃ", "きゅ", "きょ",
  "しゃ", "しゅ", "しょ",
  "ちゃ", "ちゅ", "ちょ",
  "にゃ", "にゅ", "にょ",
  "ひゃ", "ひゅ", "ひょ",
  "みゃ", "みゅ", "みょ",
  "りゃ", "りゅ", "りょ",
  "ぎゃ", "ぎゅ", "ぎょ",
  "じゃ", "じゅ", "じょ",
  "ぢゃ", "ぢゅ", "ぢょ",
  "びゃ", "びゅ", "びょ",
  "ぴゃ", "ぴゅ", "ぴょ",
];

// 🔤 Katakana yōon combos
const katakanaGroups = [
  "キャ", "キュ", "キョ",
  "シャ", "シュ", "ショ",
  "チャ", "チュ", "チョ",
  "ニャ", "ニュ", "ニョ",
  "ヒャ", "ヒュ", "ヒョ",
  "ミャ", "ミュ", "ミョ",
  "リャ", "リュ", "リョ",
  "ギャ", "ギュ", "ギョ",
  "ジャ", "ジュ", "ジョ",
  "ヂャ", "ヂュ", "ヂョ",
  "ビャ", "ビュ", "ビョ",
  "ピャ", "ピュ", "ピョ",
];

// 🔤 Katakana Small Vowel Combinations (New Set)
// These typically involve a full-sized kana + a small vowel (ァ, ィ, ゥ, ェ, ォ)
// to represent foreign sounds. This list is not exhaustive, but covers common ones.
const katakanaSmallVowelCombos = [
  // ti, di, etc.
  "ティ", "ディ",
  // tu, du
  "トゥ", "ドゥ",
  // fa, fi, fu, fe, fo
  "ファ", "フィ", "フェ", "フォ",
  // cha, chu, cho (these are sometimes written with small vowels in gairaigo too, though less common than the standard チャ, チュ, チョ)
  "チェ", // already covered by チャ, チュ, チョ as yoon, but "チェ" is specifically with small E
  // shi, ji (for 'she', 'je')
  "シェ", "ジェ",
  // vi, ve, vo (often derived from ヴ + small vowel)
  "ヴァ", "ヴィ", "ヴ", "ヴェ", "ヴォ", // Note: ヴ is a single character, often combined with small vowels.
  // zi, ze, zo etc. for foreign 'z' sounds (e.g., 'ディズニー' - Disney)
  "ツァ", "ツェ", "ツォ", // ts + a, e, o
  "スィ", // si + small i -> "si" like "sweet"
  // some less common ones, but for completeness
  "ウィ", "ウェ", "ウォ",
  "イェ", "シィ", "ズィ", "ツィ", "チィ",
  "ティェ", "ディェ",
  "フュ", "フョ",
  "グァ", "クァ", "クィ", "クェ", "クォ",
  "ヴュ", "ヴョ",
];

// 🧠 Unified group list - Now includes small vowel combinations
const kanaGroups = [
    ...hiraganaGroups,
    ...katakanaGroups,
    ...katakanaSmallVowelCombos // Add the new combinations here
];

// 🔧 Tokenizer function (splits smartly)
export function tokenizeKana(input: string): string[] {
  const result: string[] = [];
  let i = 0;

  while (i < input.length) {
    const currentChar = input[i];
    const nextChar = input[i + 1];
    const nextNextChar = input[i + 2];

    // 1. Handle Sokuon (っ/ッ)
    if (currentChar === "っ" || currentChar === "ッ") {
      // If sokuon is the last character, treat it as a standalone 'っ' or 'ッ'
      if (i + 1 >= input.length) {
        result.push(currentChar);
        i += 1;
        continue;
      }

      // Check for a 3-char combo (Sokuon + 2-char yōon/small vowel combo) after sokuon
      // e.g., 'ッテ' (ッ + テ), 'ッチョ' (ッ + チョ)
      const potentialThreeCharCombo = input.substring(i + 1, i + 3); // nextChar + nextNextChar
      if (i + 2 < input.length && (kanaGroups.includes(potentialThreeCharCombo) || katakanaSmallVowelCombos.includes(potentialThreeCharCombo))) {
         result.push(currentChar + potentialThreeCharCombo); // e.g., "ッテ" or "ッチョ"
         i += 3; // Consume ッ, char1, char2
         continue;
      }

      // If not a specific 2-char combo, then it's a single character after sokuon
      result.push(currentChar + nextChar); // e.g., "ッチ" for マッチ, "ッタ" for ホット
      i += 2; // Consume ッ and the character after it
      continue;
    }

    // 2. Prioritize checking for Katakana Small Vowel Combinations (2 or 3 characters)
    // Example: テ + ィ = ティ (2 chars)
    // Example: ヴ + ェ = ヴェ (2 chars)
    // It's important to check 3-character small vowel combos before 2-character ones if they exist,
    // though most are 2 characters (base kana + small vowel).
    const twoChar = currentChar + nextChar;
    const threeChar = currentChar + nextChar + nextNextChar; // For potential combos like フ + ォ + ン = フォン

    if (i + 2 < input.length && katakanaSmallVowelCombos.includes(threeChar)) {
        result.push(threeChar);
        i += 3;
        continue;
    }
    if (i + 1 < input.length && katakanaSmallVowelCombos.includes(twoChar)) {
        result.push(twoChar);
        i += 2;
        continue;
    }


    // 3. Handle 3-character yōon combos (e.g., きょ, チョ) - These were already in kanaGroups
    // (Ensure kanaGroups is broad enough, or specifically target these if needed)
    if (i + 2 < input.length && kanaGroups.includes(threeChar)) { // This will now catch yōon from kanaGroups
      result.push(threeChar);
      i += 3;
      continue;
    }

    // 4. Handle 2-character yōon combos (e.g., きゃ, シャ) - These were already in kanaGroups
    if (i + 1 < input.length && kanaGroups.includes(twoChar)) { // This will now catch yōon from kanaGroups
      result.push(twoChar);
      i += 2;
      continue;
      // Note: If a twoChar is both a standard kanaGroup and a katakanaSmallVowelCombo,
      // the order of checks (2 then 4) ensures the small vowel combo is prioritized.
      // For instance, "シェ" is in both; the check for katakanaSmallVowelCombos will catch it first.
    }


    // 5. Handle Chōonpu (ー)
    if (currentChar === "ー" && result.length > 0) {
      result[result.length - 1] += currentChar; // Merge into previous token
    } else {
      // 6. Handle single characters
      result.push(currentChar);
    }
    i += 1;
  }

  return result;
}