"use client";

import { useEffect, useState } from "react";
import { ZodSchema } from "zod";
import { JapanesePrompt } from "@/interface/japanese-prompt.interface";
import {
  finalizeSession,
  startOrResumeSession,
  submitAnswer,
  updateSessionProgress,
} from "@/actions/session.actions";
import { getVocabById, getRandomVocabs } from "@/actions/prompt.actions";
import { PromptType } from "@prisma/client";
import { getCurrentDbUser } from "@/actions/user.actions";
import { checkRomaji } from "@/lib/trainers/check-romaji";

interface UseTrainerProps {
  script: string;
  schema: ZodSchema<{ inputText: string }>;
}

interface DbUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  clerkId: string;
}

export function useTrainer({ script, schema }: UseTrainerProps) {
const [user, setUser] = useState<DbUser | null>(null);
  const [submitting, setSubmitting] = useState(false);
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

  // 0. Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentDbUser();
      setUser(currentUser ?? null);
      console.log("[USER] Current user:", currentUser);
    };

    fetchUser();
  }, []);

  // 1. Setup checker function
  useEffect(() => {
    setCheckAnswer(() => checkRomaji);
    console.log("[INIT] Answer checker set up for script:", script);
  }, [script]);

  // 2. Start session OR fetch guest prompts
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      if (user) {
        const { session } = await startOrResumeSession(script as PromptType);
        console.log("[SESSION] Active session ID:", session.id);

        setSessionId(session.id);
        setPromptIds(session.promptIds);
        setCurrentIndex(session.progress || 0);

        const firstPrompt = await getVocabById(
          session.promptIds[session.progress || 0]
        );
        setCurrentPrompt(firstPrompt);
        console.log("[PROMPT] Loaded first prompt (user):", firstPrompt);
      } else {
        const prompts = await getRandomVocabs(script as PromptType, 10);
        const ids = prompts.map((p) => p.id);
        setPromptIds(ids);
        setCurrentIndex(0);
        setCurrentPrompt(prompts[0] || null);
        console.log("[PROMPT] Loaded random prompts (guest):", prompts);
      }

      setLoading(false);
    };

    // Only initialize when we have determined the user state
    if (user !== undefined) {
      init();
    }
  }, [script, user]);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    console.log("[SUBMIT] Submitting input:", input);
    const result = schema.safeParse({ inputText: input });

    if (!result.success) {
      const issue = result.error.issues[0].message;
      setError(issue);
      console.warn("[VALIDATION] Error:", issue);
      setSubmitting(false);
      return;
    }

    if (!checkAnswer || !currentPrompt) {
      console.warn("[SUBMIT] Blocked: Data not yet initialized.");
      setSubmitting(false);
      return;
    }

    setError(null);
    const isCorrect = checkAnswer(input, currentPrompt);
    const resultLabel = isCorrect ? "correct" : "wrong";
    console.log(`[CHECK] Input is ${resultLabel}.`);

    if (user && sessionId) {
      await submitAnswer(sessionId, currentPrompt.id, input, isCorrect);
      console.log("[DB] Answer submitted for prompt ID:", currentPrompt.id);
    }

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
      setSubmitting(false);
    }, 1000);
  };

  const handleNext = async () => {
    setInput("");
    setFeedback(null);
    setError(null);

    const nextIndex = currentIndex + 1;

    if (nextIndex >= promptIds.length) {
      console.log("[SESSION] Reached end of prompts.");

      if (user && sessionId) {
        await finalizeSession(sessionId);
        console.log("[SESSION] Session marked as completed.");

        const { session: newSession } = await startOrResumeSession(
          script as PromptType
        );
        setSessionId(newSession.id);
        setPromptIds(newSession.promptIds);
        setCurrentIndex(newSession.progress || 0);

        const firstPrompt = await getVocabById(
          newSession.promptIds[newSession.progress || 0]
        );
        setCurrentPrompt(firstPrompt);
        console.log("[PROMPT] Loaded next session prompt:", firstPrompt);
      } else {
        const prompts = await getRandomVocabs(script as PromptType, 10);
        const ids = prompts.map((p) => p.id);
        setPromptIds(ids);
        setCurrentIndex(0);
        setCurrentPrompt(prompts[0] || null);
        console.log("[PROMPT] Guest: reshuffled new prompts.");
      }

      return;
    }

    const nextPrompt = await getVocabById(promptIds[nextIndex]);
    setCurrentPrompt(nextPrompt);
    setCurrentIndex(nextIndex);

    if (user && sessionId) {
      await updateSessionProgress(sessionId, nextIndex);
    }

    console.log(`[PROMPT] Moved to index ${nextIndex}:`, nextPrompt);
  };

  return {
    submitting,
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
