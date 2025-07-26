"use client";

import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SessionHistory } from "@/interface/analytics.interface";

interface ScoreOverTimeChartProps {
  history: SessionHistory[];
}

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--primary)",
  },
  average: {
    label: "Average",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

export function ScoreOverTimeChart({ history }: ScoreOverTimeChartProps) {
  const [timeRange, setTimeRange] = React.useState("all");

  // Filter data based on time range
  const getFilteredHistory = () => {
    if (timeRange === "all") return history;

    const now = new Date();
    let daysBack = 0;

    switch (timeRange) {
      case "7d":
        daysBack = 7;
        break;
      case "30d":
        daysBack = 30;
        break;
      case "90d":
        daysBack = 90;
        break;
      default:
        return history;
    }

    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    return history.filter(
      (session) => new Date(session.createdAt) >= cutoffDate
    );
  };

  const filteredHistory = getFilteredHistory();

  const chartData = filteredHistory
    .slice()
    .reverse()
    .map((session, index) => ({
      session: `Session ${index + 1}`,
      sessionNumber: index + 1,
      score: session.score,
      date: new Date(session.createdAt).toLocaleDateString(),
      type: session.session.type,
      createdAt: session.createdAt,
    }));

  const averageScore =
    filteredHistory.length > 0
      ? Math.round(
          filteredHistory.reduce((acc, session) => acc + session.score, 0) /
            filteredHistory.length
        )
      : 0;

  // Add average line to chart data
  const chartDataWithAverage = chartData.map((item) => ({
    ...item,
    average: averageScore,
  }));

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "7d":
        return "last 7 days";
      case "30d":
        return "last 30 days";
      case "90d":
        return "last 3 months";
      default:
        return "all sessions";
    }
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Score Progress Over Time</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Your performance across {getTimeRangeLabel()} (Average:{" "}
            {averageScore}%)
          </span>
          <span className="@[540px]/card:hidden">
            {getTimeRangeLabel()} (Avg: {averageScore}%)
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="all">All Sessions</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="All Sessions" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">
                All Sessions
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <LineChart
            data={chartDataWithAverage}
            margin={{
              top: 12,
              right: 12,
              left: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-muted"
            />
            <XAxis
              dataKey="session"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value, name, item) => {
                    if (name === "average") {
                      return [
                        <span key="average" className="text-muted-foreground">
                          {value}% (Average)
                        </span>,
                        "",
                      ];
                    }
                    return [
                      <div key="score" className="space-y-1">
                        <span className="font-medium text-primary">
                          Score: {value}%
                        </span>
                        <div className="text-sm text-muted-foreground">
                          <div>Date: {item.payload?.date}</div>
                          <div>Type: {item.payload?.type}</div>
                        </div>
                      </div>,
                      "",
                    ];
                  }}
                  indicator="dot"
                />
              }
            />
            {/* Average line */}
            <Line
              dataKey="average"
              type="monotone"
              stroke="var(--color-average)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
            />
            {/* Score line */}
            <Line
              dataKey="score"
              type="monotone"
              stroke="var(--color-score)"
              strokeWidth={3}
              dot={{
                fill: "var(--color-score)",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                stroke: "var(--color-score)",
                strokeWidth: 2,
                fill: "var(--background)",
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
