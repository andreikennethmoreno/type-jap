"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SessionHistory, SessionType } from "@/interface/analytics.interface";
import { Brain, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PerformanceByTypeChartProps {
  history: SessionHistory[];
}

const TYPE_COLORS = {
  HIRAGANA: "#3B82F6", // blue
  KATAKANA: "#10B981", // green
  KANJI: "#F59E0B", // amber
  VOCAB: "#EF4444", // red
};

export function PerformanceByTypeChart({
  history,
}: PerformanceByTypeChartProps) {
  // Group sessions by type and calculate averages
  const typeStats = history.reduce(
    (acc, session) => {
      const type = session.session.type;
      if (!acc[type]) {
        acc[type] = {
          type,
          totalScore: 0,
          totalSessions: 0,
          totalAnswers: 0,
          totalCorrect: 0,
        };
      }

      acc[type].totalScore += session.score;
      acc[type].totalSessions += 1;
      acc[type].totalAnswers += session.total;
      acc[type].totalCorrect += session.correct;

      return acc;
    },
    {} as Record<
      SessionType,
      {
        type: SessionType;
        totalScore: number;
        totalSessions: number;
        totalAnswers: number;
        totalCorrect: number;
      }
    >
  );

  const chartData = Object.values(typeStats).map((stat) => ({
    type: stat.type,
    averageScore: Math.round(stat.totalScore / stat.totalSessions),
    accuracy: Math.round((stat.totalCorrect / stat.totalAnswers) * 100),
    sessions: stat.totalSessions,
  }));

  // Find areas needing improvement
  const lowestScore = chartData.reduce(
    (min, item) => (item.averageScore < min.averageScore ? item : min),
    chartData[0] || { averageScore: 100, type: "HIRAGANA" }
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Performance by Type</CardTitle>
        <CardDescription>
          Average scores across different Japanese writing systems
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="type" className="text-xs" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[0, 100]}
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover text-popover-foreground border rounded-lg p-3 shadow-md">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm">
                        <span className="font-medium text-primary">
                          Average Score: {data.averageScore}%
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          Accuracy: {data.accuracy}%
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          Sessions: {data.sessions}
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="averageScore" radius={[4, 4, 0, 0]} cursor="default">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={TYPE_COLORS[entry.type as SessionType]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {chartData.length > 0 && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">
              💡 Suggestion: Focus more on{" "}
              <strong>{lowestScore.type.toLowerCase()}</strong> practice
              (current average: {lowestScore.averageScore}%)
            </p>
          </div>
        )}

        
      </CardContent>
    </Card>
  );
}
