// components/Trainer.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KatakanaWord } from "@/interface/katakana-word.interface";
import { TestFormSchema } from "@/lib/form-scehma";
import { useTrainer } from "@/hooks/use-trainer";
import History from "@/components/history"; 
import ToggleRevealEng from "./toggle-reveal-eng";


interface Props {
  words: KatakanaWord[];
  script: string;
  mode: string;
}

export default function Trainer({ words, script, mode }: Props) {
  const {
    input,
    setInput,
    feedback,
    error,
    current,
    handleSubmit,
      handleNext,
    history
  } = useTrainer({
    words,
    script,
    mode,
    schema: TestFormSchema,
  });

  return (
    <div className="max-w-md mx-auto mt-10 text-center space-y-4">
      <h1 className="text-4xl font-bold">{current.Japanese}</h1>
      {/* <p className="text-muted-foreground">{current.Meaning}</p> */}
      <ToggleRevealEng
        hiddenText={current.Romanji}
        label="Show Romaji"
        hideLabel="Hide Romaji"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <Input
          placeholder={`Enter ${mode}...`}
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
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="space-x-2">
          <Button type="submit">Check</Button>
          {/* {feedback && <Button onClick={handleNext}>Next</Button>} */}
        </div>

        {feedback === "correct" && (
          <p className="text-green-600 font-medium">Correct!</p>
        )}
        {feedback === "wrong" && (
          <p className="text-red-600 font-medium">Wrong! Try again.</p>
        )}
      </form>

      <History history={history} />
    </div>
  );
}
