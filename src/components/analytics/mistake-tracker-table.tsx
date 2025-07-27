"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SessionHistory } from "@/interface/analytics.interface";

interface MistakeTrackerTableProps {
  history: SessionHistory[];
}

export function MistakeTrackerTable({ history }: MistakeTrackerTableProps) {
  // Get all incorrect answers
  const mistakes = history.flatMap((session) =>
    session.answers.filter((answer) => !answer.isCorrect)
  );

  // Count mistakes by character/word
  const mistakeMap = new Map<
    string,
    {
      count: number;
      japanese: string;
      romaji: string;
      meaning: string;
      userAnswers: string[];
    }
  >();

  mistakes.forEach((mistake) => {
    if (!mistake.prompt) return;

    const key = mistake.prompt.japanese;
    if (mistakeMap.has(key)) {
      const existing = mistakeMap.get(key)!;
      existing.count++;
      if (!existing.userAnswers.includes(mistake.userAnswer)) {
        existing.userAnswers.push(mistake.userAnswer);
      }
    } else {
      mistakeMap.set(key, {
        count: 1,
        japanese: mistake.prompt.japanese,
        romaji: mistake.prompt.romaji,
        meaning: mistake.prompt.meaning,
        userAnswers: [mistake.userAnswer],
      });
    }
  });

  // Sort by mistake count
  const sortedMistakes = Array.from(mistakeMap.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5); // Top 5 mistakes

  return (
    <Card className="col-span-2  pb-10">
      <CardHeader>
        <CardTitle>Most Common Mistakes</CardTitle>
        <CardDescription>
          Characters and words you struggle with most
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedMistakes.length === 0 ? (
          <p className=" text-center py-8">
            No mistakes found! Great job! 🎉
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Character</TableHead>
                <TableHead>Correct</TableHead>
                <TableHead>Your Answer(s)</TableHead>
                <TableHead className="text-right">Mistakes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMistakes.map(([key, mistake]) => (
                <TableRow key={key}>
                  <TableCell>
                    <div className="font-mono text-lg font-bold">
                      {mistake.japanese}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{mistake.romaji}</div>
                      <div className="text-sm text-muted-foreground">
                        {mistake.meaning}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {mistake.userAnswers.map((answer, index) => (
                        <Badge
                          key={index}
                          variant="destructive"
                          className="text-xs"
                        >
                          {answer}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-medium">
                      {mistake.count}x
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
