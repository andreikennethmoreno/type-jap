"use client";

import { useSessionHistory } from "@/hooks/use-history";
import { LoadingState } from "@/components/analytics/loading-state";
import { ErrorState } from "@/components/analytics/error-state";
import { EmptyState } from "@/components/analytics/empty-state";
import { MistakeTrackerTable } from "@/components/analytics/mistake-tracker-table";
import { PerformanceByTypeChart } from "@/components/analytics/performance-by-type-chart";
import { SummaryCards } from "@/components/analytics/summary-cards";
import { ScoreOverTimeChart } from "@/components/analytics/score-over-time-chart";
import { SessionHistoryTable } from "@/components/analytics/session-history-table";

export default function AnalyticsPage() {
  const { history, loading, error } = useSessionHistory();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!history || history.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        {/* <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 sm:mb-2">
            <div className="p-2 bg-primary/10 rounded-lg w-fit">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Japanese Learning Analytics
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
            Track your progress and identify areas for improvement in your
            Japanese language journey
          </p>
        </div> */}

        {/* Summary Cards */}
        <div className="mb-6 sm:mb-8">
          <SummaryCards history={history} />
        </div>

        {/* Main Content Grid */}
        <div className="space-y-6 sm:space-y-8">
          {/* Score Over Time Chart - Always Full Width */}
          <div className="w-full">
            <ScoreOverTimeChart history={history} />
          </div>

          {/* Charts Row - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Performance by Type Chart */}
            <div className="w-full">
              <PerformanceByTypeChart history={history} />
            </div>

            {/* Mistake Tracker Table */}
            <div className="w-full">
              <MistakeTrackerTable history={history} />
            </div>
          </div>

          {/* Session History - Full Width */}
          <div className="w-full">
            <SessionHistoryTable history={history} />
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-4 sm:h-6 lg:h-8" />
      </div>
    </div>
  );
}
