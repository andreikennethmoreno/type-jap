"use server";

import { prisma } from "../../lib";
import { getDbUserId } from "./user.actions";
import { getPromptsByIds } from "./prompt.actions";

interface Answer {
  promptId: string;
  userAnswer: string;
  isCorrect: boolean;
}

interface Prompt {
  id: string;
  japanese: string;
  romaji: string;
  meaning: string;
}

interface SessionHistory {
  id: string;
  score: number;
  correct: number;
  total: number;
  createdAt: Date; // ISO Date
   metadata: any;
  session: {
    id: string;
    type: "HIRAGANA" | "KATAKANA" | "KANJI" | "VOCAB";
    promptIds: string[];
  };
  answers: {
    id: string;
    isCorrect: boolean;
    userAnswer: string;
    prompt?: Prompt;
  }[];
}


export async function getAllHistory() {
  const userId = await getDbUserId();
  if (!userId) throw new Error("User not found");

  const histories = await prisma.history.findMany({
    where: {
      session: {
        userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      score: true,
      total: true,
      correct: true,
      createdAt: true,
      metadata: true,
      session: {
        select: {
          id: true,
          type: true,
          promptIds: true,
        },
      },
    },
  });

  const allPromptIds: string[] = histories.flatMap((history : SessionHistory) => {
    const metadata = history.metadata as { answers?: Answer[] } | null;
    return metadata?.answers?.map((a) => a.promptId) ?? [];
  });

  const uniquePromptIds: string[] = [...new Set(allPromptIds)];

  const prompts = await getPromptsByIds(uniquePromptIds);

  const promptMap = new Map(prompts.map((p: Prompt) => [p.id, p]));

  return histories.map((history : SessionHistory) => {
    const metadata = history.metadata as { answers?: Answer[] } | null;

    const answers = (metadata?.answers ?? []).map((answer) => ({
      id: answer.promptId,
      isCorrect: answer.isCorrect,
      userAnswer: answer.userAnswer,
      prompt: promptMap.get(answer.promptId) ?? undefined,
    }));

    return {
      id: history.id,
      score: history.score,
      total: history.total,
      correct: history.correct,
      createdAt: history.createdAt.toISOString(),
      session: {
        id: history.session.id,
        type: history.session.type,
        promptIds: history.session.promptIds,
      },
      answers,
    };
  });
}