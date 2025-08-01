import { NextResponse } from "next/server";

import { getDbUserId } from "@/actions/user.actions";
import { getVocabByIds } from "@/actions/vocabulary.actions";
import { JsonValue } from "@prisma/client/runtime/library";
import { prisma } from "../../../../lib";

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

interface PrismaHistoryResult {
  id: string;
  score: number;
  correct: number;
  total: number;
  createdAt: Date;
  metadata: JsonValue;
  session: {
    id: string;
    type: "HIRAGANA" | "KATAKANA" | "KANJI" | "VOCAB";
    promptIds: string[];
  };
}

interface SessionHistory {
  id: string;
  score: number;
  correct: number;
  total: number;
  createdAt: string;
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

export async function GET() {
  try {
    const userId = await getDbUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const histories = await prisma.history.findMany({
      where: {
        session: { userId },
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

    const allPromptIds = histories.flatMap((history: PrismaHistoryResult) => {
      const metadata = history.metadata as { answers?: Answer[] } | null;
      return metadata?.answers?.map((a) => a.promptId) ?? [];
    });

    const uniquePromptIds = [...new Set(allPromptIds)];
    const prompts = await getVocabByIds(uniquePromptIds);
    const promptMap = new Map(prompts.map((p: Prompt) => [p.id, p]));

    const results: SessionHistory[] = histories.map((history: PrismaHistoryResult) => {
      const metadata = history.metadata as { answers?: Answer[] } | null;
      const answers = (metadata?.answers ?? []).map((answer) => ({
        id: answer.promptId,
        isCorrect: answer.isCorrect,
        userAnswer: answer.userAnswer,
        prompt: promptMap.get(answer.promptId),
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

    return NextResponse.json(results);
  } catch (error) {
    console.error("[GET /api/history]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
