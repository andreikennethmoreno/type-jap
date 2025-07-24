"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, RotateCcw, Trash2 } from "lucide-react";

interface SessionCardProps {
  history: {
    id: string;
    score: number;
    total: number;
    createdAt: string;
    session: {
      id: string;
      type: string;
    };
    answers: Array<{
      id: string;
      isCorrect: boolean;
      userAnswer: string;
      prompt?: {
        japanese: string;
        meaning: string;
        romaji: string;
      };
    }>;
  };
  onRedo: (sessionId: string) => void;
  onDelete: (historyId: string) => void;
}

export function SessionCard({ history, onRedo, onDelete }: SessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const percentage = Math.round((history.score / history.total) * 100);
  const correctCount = history.answers.filter((ans) => ans.isCorrect).length;
  const incorrectCount = history.answers.filter((ans) => !ans.isCorrect).length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{history.session.type}</Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(history.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  percentage >= 80
                    ? "default"
                    : percentage >= 60
                    ? "secondary"
                    : "destructive"
                }
              >
                {history.score}/{history.total} ({percentage}%)
              </Badge>
              <span className="text-sm text-muted-foreground">
                {correctCount} correct, {incorrectCount} incorrect
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRedo(history.session.id)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Redo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(history.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between px-6 py-2">
            <span>View answers</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {history.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    answer.isCorrect
                      ? "border-green-200"
                      : "border-red-200"
                  }`}
                >
                  {answer.prompt ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {answer.prompt.japanese} ({answer.prompt.meaning})
                        </span>
                        <span className="text-lg">
                          {answer.isCorrect ? "✅" : "❌"}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>
                          Your answer:{" "}
                          <span className="font-mono px-2 py-1 rounded">
                            {answer.userAnswer}
                          </span>
                        </p>
                        {!answer.isCorrect && (
                          <p>
                            Correct answer:{" "}
                            <span className="font-mono px-2 py-1 rounded text-green-700">
                              {answer.prompt.romaji}
                            </span>
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-yellow-700">
                      <p className="font-medium">⚠️ Prompt data missing</p>
                      <p className="text-sm">
                        Your answer:{" "}
                        <span className="font-mono bg-white px-2 py-1 rounded">
                          {answer.userAnswer}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
