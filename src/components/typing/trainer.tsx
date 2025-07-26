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
import { TestFormSchema } from "@/lib/form-schema";
import { useTrainer } from "@/hooks/use-trainer";
import History from "@/components/typing/history-server";
import ToggleRevealEng from "./toggle-reveal-eng";
import { CheckCircle, XCircle, Brain, Zap } from "lucide-react";
import CombinedTrainerLoading from "./loading-state";

interface Props {
  script: string;
}

export default function Trainer({ script }: Props) {
  const {
    input,
    setInput,
    feedback,
    error,
    current,
    handleSubmit,
    history,
    sessionComplete,
    loading,
    submitting,
  } = useTrainer({
    script,
    schema: TestFormSchema,
  });

  const correctCount = history.filter((h) => h.result === "correct").length;
  const totalAttempts = history.length;
  const accuracy =
    totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

    if (loading || !current) {
      return (
        <CombinedTrainerLoading/>
      );
    }

  if (sessionComplete) {
    return (
      <div className="text-center mt-10 space-y-4">
        <h2 className="text-2xl font-bold">🎉 Session Complete!</h2>
        <p>You answered {history.length} prompts.</p>
        <p>Accuracy: {accuracy}%</p>
      </div>
    );
  }

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
            Type the <strong>romaji</strong> for this character
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
                placeholder="Enter romaji..."
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

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Checking..." : "Check Answer"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* History Section */}
      <History history={history} />
    </div>
  );
}
