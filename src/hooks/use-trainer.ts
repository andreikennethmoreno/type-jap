"use client";

import { useEffect, useState } from "react";
import { ZodSchema } from "zod";
import { JapanesePrompt } from "@/interface/japanese-prompt.interface";
import { checkKatakanaRomaji } from "@/lib/trainers/katakana/romaji";
import {
  startOrResumeSession,
  submitAnswer,
  markSessionCompleted,
} from "@/actions/session.actions";
import { getPromptById } from "@/actions/prompt.actions"; // You’ll need this

interface UseTrainerProps {
  userId: string;
  script: string; // PromptType (e.g., KATAKANA)
  mode: string;
  schema: ZodSchema<{ inputText: string }>;
}

export function useTrainer({ userId, script, mode, schema }: UseTrainerProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [promptIds, setPromptIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentPrompt, setCurrentPrompt] = useState<JapanesePrompt | null>(
    null
  );
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [checkAnswer, setCheckAnswer] = useState<
    ((input: string, word: JapanesePrompt) => boolean) | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { word: JapanesePrompt; userInput: string; result: "correct" | "wrong" }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // 1. Setup checker function
  useEffect(() => {
    setCheckAnswer(() => checkKatakanaRomaji);
  }, [script, mode]);

  // 2. Start or resume session on mount
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { session } = await startOrResumeSession(userId, script as any); // type cast if needed
      setSessionId(session.id);
      setPromptIds(session.promptIds);
      setCurrentIndex(session.progress || 0); // start from where user left off
      const firstPrompt = await getPromptById(
        session.promptIds[session.progress || 0]
      );
      setCurrentPrompt(firstPrompt);
      setLoading(false);
    };

    init();
  }, [userId, script]);

  const handleSubmit = async () => {
    const result = schema.safeParse({ inputText: input });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    if (!sessionId || !checkAnswer || !currentPrompt) return;

    setError(null);
    const isCorrect = checkAnswer(input, currentPrompt);
    const resultLabel = isCorrect ? "correct" : "wrong";

    // Save answer to DB
    await submitAnswer(sessionId, currentPrompt.id, input, isCorrect);

    setFeedback(resultLabel);
    setHistory((prev) => [
      ...prev,
      {
        word: currentPrompt,
        userInput: input,
        result: resultLabel,
      },
    ]);

    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleNext = async () => {
    setInput("");
    setFeedback(null);
    setError(null);

    const nextIndex = currentIndex + 1;

    // End of session?
    if (nextIndex >= promptIds.length) {
      if (sessionId) await markSessionCompleted(sessionId);
      setCurrentPrompt(null); // could trigger "session complete" UI
      return;
    }

    const nextPrompt = await getPromptById(promptIds[nextIndex]);
    setCurrentPrompt(nextPrompt);
    setCurrentIndex(nextIndex);
  };

  return {
    input,
    setInput,
    feedback,
    error,
    current: currentPrompt,
    handleSubmit,
    history,
    sessionComplete: currentPrompt === null,
    loading,
  };
}
