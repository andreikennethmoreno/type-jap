"use server"

// /actions/session.actions.ts
import { prisma } from "../../lib";
import { getDbUserId } from "./user.actions";
import { getRandomVocabs } from "./prompt.actions";
import { toVocabType } from "@/lib/helpers/prompt";

export async function startOrResumeSession(type: string) {
  const userId = await getDbUserId();
  if (!userId) throw new Error("User not found");

  const normalizedType = toVocabType(type);

  // Step 1: Check for existing unfinished session
  const existing = await prisma.session.findFirst({
    where: {
      userId,
      type: normalizedType,
      isCompleted: false,
    },
    orderBy: { startedAt: "desc" }, // prioritize most recent unfinished session
  });

  if (existing) {
    return {
      resumed: true,
      session: existing,
    };
  }

  // Step 2: Generate prompt IDs with fast random fetching
  const prompts = await getRandomVocabs(normalizedType, 10);
  if (!prompts.length) throw new Error("No prompts found for this type");

  const promptIds = prompts.map((p) => p.id);

  // Step 3: Create new session with prompt IDs
  const session = await prisma.session.create({
    data: {
      userId,
      type: normalizedType,
      promptIds,
    },
    select: {
      id: true,
      userId: true,
      type: true,
      promptIds: true,
      startedAt: true,
      isCompleted: true,
      progress: true,
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

export async function updateSessionProgress(
  sessionId: string,
  progress: number
) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { progress },
  });
}

export async function finalizeSession(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      answers: true,
    },
  });

  if (!session) throw new Error("Session not found");

  const total = session.answers.length;
  const correct = session.answers.filter((a) => a.isCorrect).length;
  const score = Math.round((correct / total) * 100); // % score

  const metadata = {
    answers: session.answers.map((a) => ({
      promptId: a.promptId,
      userAnswer: a.userAnswer,
      isCorrect: a.isCorrect,
      answeredAt: a.answeredAt,
    })),
  };

  // Create History entry
  await prisma.history.create({
    data: {
      sessionId,
      score,
      total,
      correct,
      metadata,
    },
  });

  // 2. Delete SessionAnswer records (now safely archived)
  await prisma.sessionAnswer.deleteMany({
    where: { sessionId },
  });

  // Mark session complete
  return prisma.session.update({
    where: { id: sessionId },
    data: { isCompleted: true },
  });
}