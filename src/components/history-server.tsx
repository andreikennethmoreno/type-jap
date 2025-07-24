import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { JapanesePrompt } from "@/interface/japanese-prompt.interface";

interface Props {
  history: {
    word: JapanesePrompt;
    userInput: string;
    result: "correct" | "wrong";
  }[];
}

export default function HistoryServer({ history }: Props) {
  if (history.length === 0) return null;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {[...history].reverse().map((entry, idx) => {
              const isCorrect = entry.result === "correct";
              return (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-4 py-3 rounded-md border transition-colors ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50"
                      : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50"
                  }`}
                >
                  {/* Status + Katakana Block */}
                  <div className="flex items-start gap-3 sm:gap-4 min-w-[100px]">
                    {/* Emoji icon */}
                    <div className="text-xl pt-1">
                      {isCorrect ? "✅" : "❌"}
                    </div>

                    {/* Word + Meaning */}
                    <div>
                      <div className="text-lg font-semibold text-primary leading-tight">
                        {entry.word.japanese}
                      </div>
                      <div className="text-sm text-muted-foreground leading-tight">
                        {entry.word.meaning}
                      </div>
                    </div>
                  </div>

                  {/* User Answer + Correct Answer */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-nowrap">
                      You:{" "}
                      <code
                        className={`font-mono px-2 py-0.5 rounded ${
                          isCorrect
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {entry.userInput}
                      </code>
                    </span>

                    {!isCorrect && (
                      <>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                        <span className="text-nowrap">
                          Correct:{" "}
                          <code className="font-mono px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            {entry.word.romaji}
                          </code>
                        </span>
                      </>
                    )}

                    {isCorrect && (
                      <span className="text-nowrap">
                        Romaji:{" "}
                        <code className="font-mono px-2 py-0.5 text-muted-foreground">
                          {entry.word.romaji}
                        </code>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          Practice History
          <Badge variant="secondary" className="ml-auto text-sm">
            {history.length} attempts
          </Badge>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
