"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trash2,
  Bookmark,
  Trophy,
  Calendar,
  Target,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";


type SortOption = "newest" | "oldest" | "highest-score" | "lowest-score";
type FilterOption = "all" | "Vocabulary" | "Grammar" | "Kanji";

export default function HistoryPage() {
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [bookmarkedPrompts, setBookmarkedPrompts] = useState<Set<string>>(
    new Set()
  );

  

  // Mock histories data - in real app, this would come from props or API call
  const histories = mockHistories;

  const toggleSession = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const handleRedoSession = (sessionId: string) => {
    console.log("🔄 Redoing session:", sessionId);
    // Mock backend call - implement actual redo logic
  };

  const handleDeleteHistory = (historyId: string) => {
    console.log("🗑️ Deleting history:", historyId);
    // Mock backend call - implement actual delete logic
  };

  const handleBookmarkPrompt = (promptId: string) => {
    const newBookmarked = new Set(bookmarkedPrompts);
    if (newBookmarked.has(promptId)) {
      newBookmarked.delete(promptId);
      console.log("🔖 Removed bookmark for prompt:", promptId);
    } else {
      newBookmarked.add(promptId);
      console.log("🔖 Bookmarked prompt:", promptId);
    }
    setBookmarkedPrompts(newBookmarked);
    // Mock backend call - implement actual bookmark logic
  };

  const filteredAndSortedHistories = useMemo(() => {
    let filtered = histories;

    // Apply filter
    if (filterBy !== "all") {
      filtered = filtered.filter(
        (history) => history.session.type === filterBy
      );
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest-score":
          return b.score / b.total - a.score / a.total;
        case "lowest-score":
          return a.score / a.total - b.score / b.total;
        default:
          return 0;
      }
    });

    return sorted;
  }, [histories, filterBy, sortBy]);

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 70)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreIcon = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return <Trophy className="w-4 h-4" />;
    if (percentage >= 70) return <Target className="w-4 h-4" />;
    return <Target className="w-4 h-4 opacity-60" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">


        {/* Controls */}
        <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select
                    value={filterBy}
                    onValueChange={(value: FilterOption) => setFilterBy(value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Vocabulary">Vocabulary</SelectItem>
                      <SelectItem value="Grammar">Grammar</SelectItem>
                      <SelectItem value="Kanji">Kanji</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  {sortBy.includes("newest") || sortBy.includes("oldest") ? (
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Select
                    value={sortBy}
                    onValueChange={(value: SortOption) => setSortBy(value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest-score">
                        Highest Score
                      </SelectItem>
                      <SelectItem value="lowest-score">Lowest Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                {filteredAndSortedHistories.length} session
                {filteredAndSortedHistories.length !== 1 ? "s" : ""}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        {filteredAndSortedHistories.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No sessions found</h3>
                <p className="text-muted-foreground">
                  {filterBy === "all"
                    ? "You haven't completed any learning sessions yet."
                    : `No ${filterBy} sessions found. Try a different filter.`}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedHistories.map((history) => {
              const isExpanded = expandedSessions.has(history.id);
              const correctAnswers = history.answers.filter(
                (ans) => ans.isCorrect
              ).length;
              const incorrectAnswers = history.answers.filter(
                (ans) => !ans.isCorrect
              ).length;

              return (
                <Card
                  key={history.id}
                  className="border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-medium">
                            {history.session.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(history.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={`px-3 py-1 ${getScoreColor(
                              history.score,
                              history.total
                            )}`}
                          >
                            <span className="flex items-center gap-1">
                              {getScoreIcon(history.score, history.total)}
                              {history.score}/{history.total}
                            </span>
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {Math.round((history.score / history.total) * 100)}%
                            accuracy
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Session History
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this session
                                history? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteHistory(history.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRedoSession(history.session.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Collapsible
                      open={isExpanded}
                      onOpenChange={() => toggleSession(history.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-0 h-auto mt-3"
                        >
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-600 font-medium">
                              ✓ {correctAnswers} correct
                            </span>
                            {incorrectAnswers > 0 && (
                              <span className="text-red-600 font-medium">
                                ✗ {incorrectAnswers} incorrect
                              </span>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="space-y-0">
                        <Separator className="my-4" />
                        <div className="space-y-3">
                          {history.answers.map((ans, i) => {
                            const prompt = ans.prompt;
                            const isBookmarked = bookmarkedPrompts.has(ans.id);

                            if (!prompt) {
                              return (
                                <div
                                  key={i}
                                  className="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
                                >
                                  <p className="font-medium text-yellow-800 mb-2">
                                    ⚠️ Prompt data missing
                                  </p>
                                  <p className="text-sm">
                                    Your answer:{" "}
                                    <span className="font-mono bg-white px-2 py-1 rounded">
                                      {ans.userAnswer}
                                    </span>
                                  </p>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={i}
                                className={`border rounded-lg p-4 transition-all duration-200 ${
                                  ans.isCorrect
                                    ? "border-green-200 bg-green-50/50 hover:bg-green-50"
                                    : "border-red-200 bg-red-50/50 hover:bg-red-50"
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg font-medium">
                                        {prompt.japanese}
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        ({prompt.meaning})
                                      </span>
                                      {ans.isCorrect ? (
                                        <span className="text-green-600 text-lg">
                                          ✅
                                        </span>
                                      ) : (
                                        <span className="text-red-600 text-lg">
                                          ❌
                                        </span>
                                      )}
                                    </div>

                                    <div className="space-y-1">
                                      <p className="text-sm">
                                        <span className="text-muted-foreground">
                                          Your answer:
                                        </span>{" "}
                                        <span
                                          className={`font-mono px-2 py-1 rounded text-sm ${
                                            ans.isCorrect
                                              ? "bg-green-100 text-green-800"
                                              : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          {ans.userAnswer}
                                        </span>
                                      </p>

                                      {!ans.isCorrect && (
                                        <p className="text-sm">
                                          <span className="text-muted-foreground">
                                            Correct answer:
                                          </span>{" "}
                                          <span className="font-mono bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                            {prompt.romaji}
                                          </span>
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {!ans.isCorrect && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleBookmarkPrompt(ans.id)
                                      }
                                      className={`${
                                        isBookmarked
                                          ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                          : "text-muted-foreground hover:text-yellow-600 hover:bg-yellow-50"
                                      }`}
                                    >
                                      <Bookmark
                                        className={`w-4 h-4 ${
                                          isBookmarked ? "fill-current" : ""
                                        }`}
                                      />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
