"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Clock, Award } from "lucide-react";
import { SessionHistory } from "@/interface/analytics.interface";

interface SummaryCardsProps {
  history: SessionHistory[];
}

export function SummaryCards({ history }: SummaryCardsProps) {
  const totalSessions = history.length;
  const totalAnswers = history.reduce((acc, s) => acc + s.total, 0);
  const totalCorrect = history.reduce((acc, s) => acc + s.correct, 0);
  const averageScore =
    totalSessions > 0
      ? Math.round(history.reduce((acc, s) => acc + s.score, 0) / totalSessions)
      : 0;
  const accuracy =
    totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  // Streak = consecutive sessions with >=70% score
  let streak = 0;
  for (let i = 0; i < history.length; i++) {
    if (history[i].score >= 70) streak++;
    else break;
  }

  const cards = [
    {
      label: "Sessions",
      value: totalSessions.toString(),
      sub: `${totalAnswers} answers`,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "Avg. Score",
      value: `${averageScore}%`,
      sub: "Overall session avg",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
      sub: `${totalCorrect}/${totalAnswers} correct`,
      icon: Target,
      color: "text-purple-600",
    },
    {
      label: "Streak",
      value: `${streak}`,
      sub: "70%+ sessions",
      icon: Award,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card key={i} className="p-2 sm:p-4">
            <CardHeader className="p-0 flex items-center justify-between">
              <CardTitle className="text-xs text-muted-foreground font-medium">
                {card.label}
              </CardTitle>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-xl font-semibold">
                {card.value}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                {card.sub}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
