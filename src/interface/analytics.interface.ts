export type Answer = {
  id: string;
  isCorrect: boolean;
  userAnswer: string;
  prompt?: {
    id: string;
    japanese: string;
    romaji: string;
    meaning: string;
  };
};


export type SessionType = "HIRAGANA" | "KATAKANA" | "KANJI" | "VOCAB";
