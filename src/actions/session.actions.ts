"use server"

// /actions/session.actions.ts
import { PromptType } from "@prisma/client";
import { prisma } from "../../lib";

export async function startOrResumeSession(userId: string, type: PromptType) {
  // 1. Check if there's an unfinished session of this type
  const existing = await prisma.session.findFirst({
    where: {
      userId,
      type,
      isCompleted: false,
    },
  });

  if (existing) {
    return {
      resumed: true,
      session: existing,
    };
  }

  // 2. Fetch 10 random prompts of this type
  const prompts = await prisma.prompt.findMany({
    where: { type },
    orderBy: { createdAt: "asc" }, // Replace with random logic later
    take: 10,
  });

  const promptIds = prompts.map((p) => p.id);

  // 3. Create a new session
  const session = await prisma.session.create({
    data: {
      userId,
      type,
      promptIds,
    },
  });

  return {
    resumed: false,
    session,
  };
}



export async function submitAnswer(
  sessionId: string,
  promptId: string,
  userAnswer: string,
  correct: boolean
) {
  // Check if answer already exists
  const existing = await prisma.sessionAnswer.findUnique({
    where: {
      sessionId_promptId: {
        sessionId,
        promptId,
      },
    },
  });

  if (existing) {
    // Optionally update it or just return existing to prevent errors
    return existing;
  }

  // Otherwise create new answer
  return prisma.sessionAnswer.create({
    data: {
      sessionId,
      promptId,
      userAnswer,
      isCorrect: correct,
    },
  });
}


export async function markSessionCompleted(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { isCompleted: true },
  });
}