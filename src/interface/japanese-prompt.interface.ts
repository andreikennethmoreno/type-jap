// japanese-prompt.interface.ts

export interface JapanesePrompt {
  id: string;
  romaji: string;
  japanese: string;
  meaning: string;
}

export interface Answer {
  id: string;
  isCorrect: boolean;
  userAnswer: string;
  prompt: JapanesePrompt; // use your simplified version instead of full Prisma Prompt
}

export interface HistoryItem {
  id: string;
  score: number;
  total: number;
  correct: number;
  createdAt: Date;
  metadata: string;
}
