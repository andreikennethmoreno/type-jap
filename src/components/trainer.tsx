"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KatakanaWord } from "@/interface/katakana-word.interface";

interface Props {
  words: KatakanaWord[];
  script: string;
  mode: string;
}

export default function Trainer({ words, script, mode }: Props) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const current = words[index];

  const handleSubmit = () => {
    if (mode === "romaji") {
      const isCorrect =
        input.trim().toLowerCase() === current.Romanji.toLowerCase();
      setFeedback(isCorrect ? "correct" : "wrong");
    }

    // Add other modes here like "meaning"
  };

  const handleNext = () => {
    setInput("");
    setFeedback(null);
    setIndex((prev) => (prev + 1) % words.length);
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center space-y-4">
      <h1 className="text-4xl font-bold">{current.Japanese}</h1>
      <p className="text-muted-foreground">{current.Meaning}</p>

      <Input
        placeholder={
          mode === "romaji" ? "Type romaji..." : "Enter your guess..."
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={
          feedback === "correct"
            ? "border-green-500"
            : feedback === "wrong"
            ? "border-red-500"
            : ""
        }
      />

      <div className="space-x-2">
        <Button onClick={handleSubmit}>Check</Button>
        {feedback && <Button onClick={handleNext}>Next</Button>}
      </div>

      {feedback === "correct" && (
        <p className="text-green-600 font-medium">Correct!</p>
      )}
      {feedback === "wrong" && (
        <p className="text-red-600 font-medium">Wrong! Try again.</p>
      )}
    </div>
  );
}
