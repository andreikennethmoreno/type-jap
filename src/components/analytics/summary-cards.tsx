"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock, Award } from "lucide-react";
import { SessionHistory } from "@/interface/analytics.interface";

interface SummaryCardsProps {
  history: SessionHistory[];
}

export function SummaryCards({ history }: SummaryCardsProps) {
  const totalSessions = history.length;
  const totalAnswers = history.reduce((acc, session) => acc + session.total, 0);
  const totalCorrect = history.reduce(
    (acc, session) => acc + session.correct,
    0
  );
  const averageScore =
    totalSessions > 0
      ? Math.round(
          history.reduce((acc, session) => acc + session.score, 0) /
            totalSessions
        )
      : 0;
  const overallAccuracy =
    totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  // Calculate streak (consecutive sessions with >70% score)
  let currentStreak = 0;
  for (let i = 0; i < history.length; i++) {
    if (history[i].score >= 70) {
      currentStreak++;
    } else {
      break;
    }
  }

  const cards = [
    {
      title: "Total Sessions",
      value: totalSessions.toString(),
      description: `${totalAnswers} total answers`,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      description: "Across all sessions",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Overall Accuracy",
      value: `${overallAccuracy}%`,
      description: `${totalCorrect}/${totalAnswers} correct`,
      icon: Target,
      color: "text-purple-600",
    },
    {
      title: "Current Streak",
      value: currentStreak.toString(),
      description: "Sessions with 70%+",
      icon: Award,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
