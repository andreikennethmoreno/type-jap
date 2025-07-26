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

export type SessionHistory = {
  id: string;
  score: number;
  correct: number;
  total: number;
  createdAt: string; // ISO Date
  session: {
    id: string;
    type: "HIRAGANA" | "KATAKANA" | "KANJI" | "VOCAB";
    promptIds: string[];
  };
  answers: Answer[];
};

export type SessionType = "HIRAGANA" | "KATAKANA" | "KANJI" | "VOCAB";
