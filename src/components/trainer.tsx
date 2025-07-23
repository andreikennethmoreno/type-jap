"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestFormSchema } from "@/lib/form-scehma";
import { useTrainer } from "@/hooks/use-trainer";
import History from "@/components/history";
import ToggleRevealEng from "./toggle-reveal-eng";
import { CheckCircle, XCircle, Brain, Zap } from "lucide-react";
import { JapanesePrompt } from "@/interface/katakana-word.interface";

interface Props {
  words: JapanesePrompt[];
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
    // handleNext,
    history,
  } = useTrainer({
    words,
    script,
    mode,
    schema: TestFormSchema,
  });

  const correctCount = history.filter((h) => h.result === "correct").length;
  const totalAttempts = history.length;
  const accuracy =
    totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 space-y-6">
      {/* Stats Header */}
      <div className="flex justify-center gap-4">
        <Badge variant="outline" className="text-sm">
          <Brain className="w-4 h-4 mr-1" />
          {correctCount} Correct
        </Badge>
        <Badge variant="outline" className="text-sm">
          <Zap className="w-4 h-4 mr-1" />
          {accuracy}% Accuracy
        </Badge>
      </div>

      {/* Main Trainer Card */}
      <Card className="mx-auto max-w-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-6xl font-bold mb-2 tracking-wider">
            {current.japanese}
          </CardTitle>
          <CardDescription className="text-base">
            Type the {mode} for this character
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRevealEng
            hiddenText={current.meaning}
            label="Show English"
            hideLabel="Hide English"
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="relative">
              <Input
                autoFocus
                placeholder={`Enter ${mode}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`text-lg text-center transition-all duration-300 ${
                  feedback === "correct"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : feedback === "wrong"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : ""
                }`}
              />
              {feedback === "correct" && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              )}
              {feedback === "wrong" && (
                <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" size="lg">
              Check Answer
            </Button>

            {/* Feedback Messages
            {feedback === "correct" && (
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-300 font-medium flex items-center justify-center gap-2">
                  <span className="text-2xl">🎉</span>
                  Perfect! Well done!
                </p>
              </div>
            )}
            {feedback === "wrong" && (
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-300 font-medium flex items-center justify-center gap-2">
                  <span className="text-2xl">💪</span>
                  {`Keep trying! You've got this!`}
                </p>
              </div>
            )} */}
          </form>
        </CardContent>
      </Card>

      {/* History Section */}
      <History history={history} />
    </div>
  );
}
