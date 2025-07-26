"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp } from "lucide-react";

export function EmptyState() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        {/* <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Japanese Learning Analytics
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your progress and identify areas for improvement in your
            Japanese language journey
          </p>
        </div> */}

        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                <BookOpen className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">
                Start Your Learning Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground text-lg">
                No practice sessions found yet. Complete your first Japanese
                learning session to see detailed analytics and track your
                progress.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📊 Track your scores over time</p>
                <p>🎯 Identify areas for improvement</p>
                <p>📈 Monitor your learning streaks</p>
                <p>🔍 Review common mistakes</p>
              </div>
              <Button className="w-full mt-6" size="lg">
                <BookOpen className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
