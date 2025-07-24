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

  const allPromptIds = histories.flatMap((history) => {
    const metadata = history.metadata as { answers?: Answer[] } | null;
    return metadata?.answers?.map((a) => a.promptId) ?? [];
  });

  const uniquePromptIds = [...new Set(allPromptIds)];

  const prompts = await getPromptsByIds(uniquePromptIds);

  const promptMap = new Map(prompts.map((p: Prompt) => [p.id, p]));

  return histories.map((history) => {
    const metadata = history.metadata as { answers?: Answer[] } | null;
    const answers = (metadata?.answers ?? []).map((answer) => ({
      ...answer,
      prompt: promptMap.get(answer.promptId) ?? null,
    }));

    return {
      id: history.id,
      score: history.score,
      total: history.total,
      correct: history.correct,
      createdAt: history.createdAt.toISOString(), // ✅ serialize Date
      session: {
        id: history.session.id,
        type: history.session.type,
        promptIds: history.session.promptIds,
      },
      answers,
    };
  });
}
