import { KatakanaWord } from "@/interface/katakana-word.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  history: {
    word: KatakanaWord;
    userInput: string;
    result: "correct" | "wrong";
  }[];
}

export default function History({ history }: Props) {
  if (history.length === 0) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          Practice History
          <Badge variant="secondary" className="ml-auto">
            {history.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {[...history].reverse().map((entry, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border transition-all duration-200 flex flex-col gap-1 ${
                  entry.result === "correct"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">
                      {entry.word.Japanese}
                    </span>
                    <span className="text-sm text-muted-foreground">→</span>
                    <code className="font-mono text-sm bg-background px-2 py-1 rounded">
                      {entry.userInput}
                    </code>
                  </div>
                  <span className="text-lg">
                    {entry.result === "correct" ? "✅" : "❌"}
                  </span>
                </div>
                {entry.result === "wrong" && (
                  <div className="text-md text-muted-foreground">
                    
                    <code className="font-mono">{entry.word.Romanji}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
