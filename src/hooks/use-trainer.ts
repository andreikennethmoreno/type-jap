"use client";

import { useEffect, useState } from "react";
import { ZodSchema } from "zod";
import { KatakanaWord } from "@/interface/katakana-word.interface";
import { checkKatakanaRomanji } from "@/lib/trainers/katakana/romanji";

// ✅ TEMP: Hardcoded import for testing

interface UseTrainerProps {
  words: KatakanaWord[];
  script: string;
  mode: string;
  schema: ZodSchema<{ inputText: string }>;
}

export function useTrainer({ words, script, mode, schema }: UseTrainerProps) {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [index, setIndex] = useState(0);
  const [checkAnswer, setCheckAnswer] = useState<
    ((input: string, word: any) => boolean) | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const current = words[index];

  useEffect(() => {
    // ✅ TEMP: Use fixed function instead of dynamic import
    setCheckAnswer(() => checkKatakanaRomanji);

    // ❌ Comment out dynamic logic for now
    /*
    import(`@/lib/trainers/${script}/${mode}`)
      .then((mod) => {
        const checkFn = Object.values(mod)[0] as (
          input: string,
          word: any
        ) => boolean;
        setCheckAnswer(() => checkFn);
      })
      .catch(() => console.error("Invalid trainer logic."));
    */
  }, [script, mode]);

  const handleSubmit = () => {
    const result = schema.safeParse({ inputText: input });
    if (!result.success) {
      // Extract the first error message for a cleaner user experience
      const firstError = result.error.issues[0];
      setError(firstError.message);
      return;
    }

    setError(null);
    if (!checkAnswer) return;

    const isCorrect = checkAnswer(input, current);
    setFeedback(isCorrect ? "correct" : "wrong");
  };
  const handleNext = () => {
    setInput("");
    setFeedback(null);
    setIndex((prev) => (prev + 1) % words.length);
    setError(null);
  };

  return {
    input,
    setInput,
    feedback,
    error,
    current,
    handleSubmit,
    handleNext,
  };
}
