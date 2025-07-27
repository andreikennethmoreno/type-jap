import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Skeleton component for individual elements
const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
      {...props}
    />
  );
};

// Loading state for the main trainer component
export function TrainerLoading() {
  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 space-y-6">
      {/* Stats Header Loading */}
      <div className="flex justify-center gap-4">
        <Badge variant="outline" className="text-sm">
          <Skeleton className="w-8 h-4 inline-block" />
        </Badge>
        <Badge variant="outline" className="text-sm">
          <Skeleton className="w-12 h-4 inline-block" />
        </Badge>
      </div>

      {/* Main Trainer Card Loading */}
      <Card className="mx-auto max-w-lg">
        <CardHeader className="text-center pb-2">
          {/* Japanese Character Loading */}
          <div className="mb-2">
            <Skeleton className="h-20 w-32 mx-auto rounded-lg" />
          </div>
          {/* Description Loading */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle Button Loading */}
          <div className="flex justify-center">
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>

          {/* Form Loading */}
          <div className="space-y-4">
            {/* Input Loading */}
            <Skeleton className="h-12 w-full rounded-md" />

            {/* Submit Button Loading */}
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* History Section Loading */}
      <HistoryLoading />
    </div>
  );
}

// Loading state for the history component
export function HistoryLoading() {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Badge variant="secondary" className="ml-auto text-sm">
            <Skeleton className="w-16 h-4" />
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {/* Generate 5 skeleton history entries */}
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-4 py-3 rounded-md border bg-muted/30"
              >
                {/* Status + Character Block */}
                <div className="flex items-start gap-3 sm:gap-4 min-w-[100px]">
                  {/* Emoji icon skeleton */}
                  <Skeleton className="w-6 h-6 rounded-full mt-1" />

                  {/* Word + Meaning skeleton */}
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>

                {/* User Answer + Correct Answer skeleton */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-6 w-16 rounded" />
                  </div>

                  {/* Randomly show arrow and correct answer for variety */}
                  {idx % 3 !== 0 && (
                    <>
                      <Skeleton className="w-4 h-4" />
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-6 w-16 rounded" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Combined loading state for when both are loading
export default function CombinedTrainerLoading() {
  return (
    <div className="space-y-8">
      <TrainerLoading />
    </div>
  );
}
