"use client";

import { useEffect, useState } from "react";
import { ZodSchema } from "zod";
import { JapanesePrompt } from "@/interface/katakana-word.interface";
import { checkKatakanaRomaji } from "@/lib/trainers/katakana/romaji";
import { getRandomPrompt } from "@/actions/prompt.actions";

interface UseTrainerProps {
  initialPrompt: JapanesePrompt;
  script: string;
  mode: string;
  schema: ZodSchema<{ inputText: string }>;
}

export function useTrainer({
  initialPrompt,
  script,
  mode,
  schema,
}: UseTrainerProps) {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [current, setCurrent] = useState<JapanesePrompt>(initialPrompt);
  const [checkAnswer, setCheckAnswer] = useState<((input: string, word: JapanesePrompt) => boolean) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { word: JapanesePrompt; userInput: string; result: "correct" | "wrong" }[]
  >([]);

  useEffect(() => {
    setCheckAnswer(() => checkKatakanaRomaji);
  }, [script, mode]);

  const handleSubmit = async () => {
    const result = schema.safeParse({ inputText: input });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    if (!checkAnswer) return;

    const isCorrect = checkAnswer(input, current);
    const resultLabel = isCorrect ? "correct" : "wrong";

    setFeedback(resultLabel);
    setHistory((prev) => [
      ...prev,
      {
        word: current,
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

    const newPrompt = await getRandomPrompt(script);
    if (newPrompt) {
      setCurrent(newPrompt);
    } else {
      console.error("No more prompts available!");
    }
  };

  return {
    input,
    setInput,
    feedback,
    error,
    current,
    handleSubmit,
    history,
  };
}
