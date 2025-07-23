"use client";

import { useEffect, useState } from "react";
import { ZodSchema } from "zod";

// ✅ TEMP: Hardcoded import for testing
import { checkKatakanaRomanji } from "@/lib/trainers/katakana/romanji";
import { JapanesePrompt } from "@/interface/katakana-word.interface";

interface UseTrainerProps {
  words: JapanesePrompt[];
  script: string;
  mode: string;
  schema: ZodSchema<{ inputText: string }>;
}

export function useTrainer({ words, script, mode, schema }: UseTrainerProps) {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [index, setIndex] = useState(0);
  const [checkAnswer, setCheckAnswer] = useState<
    ((input: string, word: JapanesePrompt) => boolean) | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<
    { word: JapanesePrompt; userInput: string; result: "correct" | "wrong" }[]
  >([]);

  const current = words[index];

  useEffect(() => {
    setCheckAnswer(() => checkKatakanaRomanji);
  }, [script, mode]);

 const handleSubmit = () => {
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

   // Automatically go to next word after small delay
   setTimeout(() => {
     handleNext();
   }, 1000); // Adjust delay as needed
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
    // handleNext,
    history, // ✅ Return properly typed history
  };
}
