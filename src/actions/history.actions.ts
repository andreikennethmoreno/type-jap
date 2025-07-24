"use server";

import { prisma } from "../../lib";
import { getDbUserId } from "./user.actions";
import { getPromptsByIds } from "./prompt.actions"; // 👈 import your prompt fetcher

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

  // Flatten all promptIds from all history answer metadata
  const allPromptIds = histories.flatMap((history) => {
    const metadata = history.metadata as { answers?: any[] } | null;
    return metadata?.answers?.map((a) => a.promptId) ?? [];
  });

  // Get unique prompt IDs
  const uniquePromptIds = [...new Set(allPromptIds)];

  // Fetch all prompts once
  const prompts = await getPromptsByIds(uniquePromptIds);

  // Index prompts for fast lookup
  const promptMap = new Map(prompts.map((p) => [p.id, p]));

  return histories.map((history) => {
    const metadata = history.metadata as { answers?: any[] } | null;
    const answers = (metadata?.answers ?? []).map((answer) => ({
      ...answer,
      prompt: promptMap.get(answer.promptId) ?? null,
    }));

    return {
      ...history,
      answers,
    };
  });
}
