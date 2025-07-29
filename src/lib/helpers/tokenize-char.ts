// 🔤 Hiragana yōon combos
const hiraganaGroups = [
  "きゃ",
  "きゅ",
  "きょ",
  "しゃ",
  "しゅ",
  "しょ",
  "ちゃ",
  "ちゅ",
  "ちょ",
  "にゃ",
  "にゅ",
  "にょ",
  "ひゃ",
  "ひゅ",
  "ひょ",
  "みゃ",
  "みゅ",
  "みょ",
  "りゃ",
  "りゅ",
  "りょ",
  "ぎゃ",
  "ぎゅ",
  "ぎょ",
  "じゃ",
  "じゅ",
  "じょ",
  "ぢゃ",
  "ぢゅ",
  "ぢょ",
  "びゃ",
  "びゅ",
  "びょ",
  "ぴゃ",
  "ぴゅ",
  "ぴょ",
];

// 🔤 Katakana yōon combos
const katakanaGroups = [
  "キャ",
  "キュ",
  "キョ",
  "シャ",
  "シュ",
  "ショ",
  "チャ",
  "チュ",
  "チョ",
  "ニャ",
  "ニュ",
  "ニョ",
  "ヒャ",
  "ヒュ",
  "ヒョ",
  "ミャ",
  "ミュ",
  "ミョ",
  "リャ",
  "リュ",
  "リョ",
  "ギャ",
  "ギュ",
  "ギョ",
  "ジャ",
  "ジュ",
  "ジョ",
  "ヂャ",
  "ヂュ",
  "ヂョ",
  "ビャ",
  "ビュ",
  "ビョ",
  "ピャ",
  "ピュ",
  "ピョ",
];

// 🧠 Unified group list
const kanaGroups = [...hiraganaGroups, ...katakanaGroups];

// 🔧 Tokenizer function (splits smartly)
export function tokenizeKana(input: string): string[] {
  const result: string[] = [];
  let i = 0;

  while (i < input.length) {
    const twoChar = input[i] + input[i + 1];
    const threeChar = input[i] + input[i + 1] + input[i + 2];

    if (kanaGroups.includes(threeChar)) {
      result.push(threeChar);
      i += 3;
    } else if (kanaGroups.includes(twoChar)) {
      result.push(twoChar);
      i += 2;
    } else {
      const char = input[i];
      if (char === "ー" && result.length > 0) {
        result[result.length - 1] += char; // Merge into previous
      } else {
        result.push(char);
      }
      i += 1;
    }
  }

  return result;
}
