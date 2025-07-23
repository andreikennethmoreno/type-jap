"use client";

import { useEffect, useState } from "react";
import { ZodSchema } from "zod";
import { JapanesePrompt } from "@/interface/japanese-prompt.interface";
import { checkKatakanaRomaji } from "@/lib/trainers/katakana/romaji";
import {
  finalizeSession,
  startOrResumeSession,
  submitAnswer,
  updateSessionProgress,
} from "@/actions/session.actions";
import { getPromptById } from "@/actions/prompt.actions";
import { PromptType } from "@prisma/client";

interface UseTrainerProps {
  script: string;
  mode: string;
  schema: ZodSchema<{ inputText: string }>;
}

export function useTrainer({ script, mode, schema }: UseTrainerProps) {
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

  // 1. Setup checker function
  useEffect(() => {
    setCheckAnswer(() => checkKatakanaRomaji);
    console.log("[INIT] Answer checker set up for script:", script);
  }, [script, mode]);

  // 2. Start or resume session on mount
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      const { session } = await startOrResumeSession( script as any);
      console.log("[SESSION] Active session ID:", session.id);
      console.log("[SESSION] Loaded prompt IDs:", session.promptIds);

      setSessionId(session.id);
      setPromptIds(session.promptIds);
      setCurrentIndex(session.progress || 0);

      const firstPrompt = await getPromptById(
        session.promptIds[session.progress || 0]
      );
      setCurrentPrompt(firstPrompt);

      console.log("[PROMPT] Loaded first prompt:" , firstPrompt);

      setLoading(false);
    };

    init();
  }, [ script]);

  const handleSubmit = async () => {
    if (submitting) return; // Prevent spam
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

if (!sessionId || !checkAnswer || !currentPrompt) {
  console.warn("[SUBMIT] Blocked: Data not yet initialized.");
  setSubmitting(false);
  return;
}
    setError(null);
    const isCorrect = checkAnswer(input, currentPrompt);
    const resultLabel = isCorrect ? "correct" : "wrong";

    console.log(`[CHECK] Input is ${resultLabel}.`);

    // Save answer to DB
    await submitAnswer(sessionId, currentPrompt.id, input, isCorrect);
    console.log("[DB] Answer submitted for prompt ID:", currentPrompt.id);

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

    // If all prompts completed
    if (nextIndex >= promptIds.length) {
      console.log("[SESSION] Reached end of session.");

      if (sessionId) {
        await finalizeSession(sessionId);
        console.log("[SESSION] Session marked as completed.");
      }

      // Start or resume next session automatically
      const { session: newSession } = await startOrResumeSession(script as any);
      console.log("[SESSION] New session started with ID:", newSession.id);

      setSessionId(newSession.id);
      setPromptIds(newSession.promptIds);
      setCurrentIndex(newSession.progress || 0);

      const firstPrompt = await getPromptById(
        newSession.promptIds[newSession.progress || 0]
      );
      setCurrentPrompt(firstPrompt);

      console.log("[PROMPT] Loaded new prompt after completion:", firstPrompt);
      return;
    }

    // Continue to next prompt in current session
    const nextPrompt = await getPromptById(promptIds[nextIndex]);
    setCurrentPrompt(nextPrompt);
    setCurrentIndex(nextIndex);

    if (sessionId) {
      await updateSessionProgress(sessionId, nextIndex);
    }

    console.log(`[PROMPT] Moved to prompt index ${nextIndex}:`, nextPrompt);
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
