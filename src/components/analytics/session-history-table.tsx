"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  Target,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Search,
} from "lucide-react";
import { SessionHistory, SessionType } from "@/interface/analytics.interface";

interface SessionHistoryTableProps {
  history: SessionHistory[];
}

const SESSION_TYPE_COLORS = {
  HIRAGANA: "bg-blue-100 text-blue-800 border-blue-200",
  KATAKANA: "bg-green-100 text-green-800 border-green-200",
  KANJI: "bg-amber-100 text-amber-800 border-amber-200",
  VOCAB: "bg-red-100 text-red-800 border-red-200",
};

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export function SessionHistoryTable({ history }: SessionHistoryTableProps) {
  const [expandedSessions, setExpandedSessions] = React.useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedTypes, setSelectedTypes] = React.useState<Set<SessionType>>(
    new Set()
  );
  const [scoreFilter, setScoreFilter] = React.useState<string>("all");
  const [dateFilter, setDateFilter] = React.useState<string>("all");

  // Filter data based on current filters
  const filteredHistory = React.useMemo(() => {
    return history.filter((session) => {
      // Type filter
      if (selectedTypes.size > 0 && !selectedTypes.has(session.session.type)) {
        return false;
      }

      // Score filter
      if (scoreFilter && scoreFilter !== "all") {
        const minScore = parseInt(scoreFilter);
        if (session.score < minScore) {
          return false;
        }
      }

      // Date filter (last N days)
      if (dateFilter && dateFilter !== "all") {
        const days = parseInt(dateFilter);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const sessionDate = new Date(session.createdAt);
        if (sessionDate < cutoffDate) {
          return false;
        }
      }

      return true;
    });
  }, [history, selectedTypes, scoreFilter, dateFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredHistory.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredHistory.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedTypes, scoreFilter, dateFilter]);

  const toggleSession = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const toggleType = (type: SessionType) => {
    const newSelected = new Set(selectedTypes);
    if (newSelected.has(type)) {
      newSelected.delete(type);
    } else {
      newSelected.add(type);
    }
    setSelectedTypes(newSelected);
  };

  const clearFilters = () => {
    setSelectedTypes(new Set());
    setScoreFilter("all");
    setDateFilter("all");
  };

  const hasActiveFilters =
    selectedTypes.size > 0 || scoreFilter !== "all" || dateFilter !== "all";

  return (
    <Card className="col-span-4 w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Session History</CardTitle>
        <CardDescription className="text-sm">
          Detailed breakdown of your recent practice sessions
        </CardDescription>

        {/* Filters Section */}
        <div className="flex flex-col gap-4 pt-4">
          {/* Mobile-first filter layout */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden xs:inline">Type</span>
                    {selectedTypes.size > 0 && (
                      <Badge variant="secondary" className="ml-1 px-1 text-xs">
                        {selectedTypes.size}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {(
                    ["HIRAGANA", "KATAKANA", "KANJI", "VOCAB"] as SessionType[]
                  ).map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedTypes.has(type)}
                      onCheckedChange={() => toggleType(type)}
                    >
                      <Badge
                        variant="outline"
                        className={`${SESSION_TYPE_COLORS[type]} mr-2`}
                      >
                        {type}
                      </Badge>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Score Filter */}
            <div className="flex items-center gap-2">
              <Label
                htmlFor="score-filter"
                className="text-sm font-medium whitespace-nowrap hidden sm:block"
              >
                Min Score:
              </Label>
              <Label
                htmlFor="score-filter"
                className="text-sm font-medium sm:hidden"
              >
                Score:
              </Label>
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger
                  className="w-20 sm:w-24"
                  size="sm"
                  id="score-filter"
                >
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="90">90%+</SelectItem>
                  <SelectItem value="80">80%+</SelectItem>
                  <SelectItem value="70">70%+</SelectItem>
                  <SelectItem value="50">50%+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Label
                htmlFor="date-filter"
                className="text-sm font-medium whitespace-nowrap"
              >
                Last:
              </Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger
                  className="w-24 sm:w-32"
                  size="sm"
                  id="date-filter"
                >
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="w-full sm:w-auto"
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Results Summary */}
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing {Math.min(pageSize, filteredHistory.length - startIndex)} of{" "}
            {filteredHistory.length} sessions
            {hasActiveFilters && ` (filtered from ${history.length} total)`}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6">
        <div className="space-y-4">
          {/* Sessions List */}
          <div className="space-y-2">
            {currentPageData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">
                  No sessions found matching your filters.
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="link"
                    onClick={clearFilters}
                    className="mt-2"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              currentPageData.map((session) => {
                const isExpanded = expandedSessions.has(session.id);
                const incorrectAnswers = session.answers.filter(
                  (answer) => !answer.isCorrect
                );

                return (
                  <Collapsible key={session.id}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full p-0 h-auto hover:bg-muted/50"
                        onClick={() => toggleSession(session.id)}
                      >
                        <div className="w-full p-3 sm:p-4 border rounded-lg">
                          {/* Mobile layout (< sm) */}
                          <div className="sm:hidden">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                )}
                                <Badge
                                  variant="outline"
                                  className={`${
                                    SESSION_TYPE_COLORS[session.session.type]
                                  } text-xs`}
                                >
                                  {session.session.type}
                                </Badge>
                              </div>
                              <div
                                className={`text-lg font-bold ${getScoreColor(
                                  session.score
                                )}`}
                              >
                                {session.score}%
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(
                                    session.createdAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Target className="h-3 w-3" />
                                <span>
                                  {session.correct}/{session.total}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop layout (>= sm) */}
                          <div className="hidden sm:flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                              )}

                              <div className="flex items-center space-x-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    SESSION_TYPE_COLORS[session.session.type]
                                  }
                                >
                                  {session.session.type}
                                </Badge>

                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(
                                      session.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2 text-sm">
                                  <Target className="h-4 w-4" />
                                  <span>
                                    {session.correct}/{session.total} correct
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div
                                className={`text-xl lg:text-2xl font-bold ${getScoreColor(
                                  session.score
                                )}`}
                              >
                                {session.score}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-2">
                      <div className="border rounded-lg p-3 sm:p-4 bg-muted/20">
                        <div className="grid gap-4 lg:grid-cols-2">
                          {/* Correct Answers */}
                          <div>
                            <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                Correct Answers
                              </span>
                              <span className="sm:hidden">Correct</span>(
                              {
                                session.answers.filter((a) => a.isCorrect)
                                  .length
                              }
                              )
                            </h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {session.answers
                                .filter((answer) => answer.isCorrect)
                                .slice(0, 10)
                                .map((answer) => (
                                  <div
                                    key={answer.id}
                                    className="text-sm p-2 rounded"
                                  >
                                    {answer.prompt ? (
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                                        <div className="font-mono font-bold text-base sm:text-lg">
                                          {answer.prompt.japanese}
                                        </div>
                                        <div className="text-left sm:text-right">
                                          <div className="font-medium text-sm">
                                            {answer.prompt.romaji}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {answer.prompt.meaning}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="italic text-muted-foreground text-xs">
                                        Prompt missing
                                      </div>
                                    )}
                                  </div>
                                ))}
                              {session.answers.filter((a) => a.isCorrect)
                                .length > 10 && (
                                <div className="text-xs text-muted-foreground text-center">
                                  And{" "}
                                  {session.answers.filter((a) => a.isCorrect)
                                    .length - 10}{" "}
                                  more...
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Incorrect Answers */}
                          <div>
                            <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                              <XCircle className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                Incorrect Answers
                              </span>
                              <span className="sm:hidden">Incorrect</span>(
                              {incorrectAnswers.length})
                            </h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {incorrectAnswers.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">
                                  Perfect session! No incorrect answers.
                                </p>
                              ) : (
                                incorrectAnswers.map((answer) => (
                                  <div
                                    key={answer.id}
                                    className="space-y-1 text-sm p-2 rounded"
                                  >
                                    {answer.prompt ? (
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                                        <div className="font-mono font-bold text-base sm:text-lg">
                                          {answer.prompt.japanese}
                                        </div>
                                        <div className="text-left sm:text-right">
                                          <div className="font-medium text-sm">
                                            {answer.prompt.romaji}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {answer.prompt.meaning}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="italic text-xs">
                                        Prompt data unavailable
                                      </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                      <span className="text-xs">
                                        Your answer:
                                      </span>
                                      <Badge
                                        variant="destructive"
                                        className="text-xs w-fit"
                                      >
                                        {answer.userAnswer}
                                      </Badge>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {filteredHistory.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1 sm:px-4">
              <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                0 of {filteredHistory.length} row(s) selected.
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8 w-full sm:w-fit">
                {/* Rows per page selector */}
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <Label
                    htmlFor="rows-per-page"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Rows per page
                  </Label>
                  <Select
                    value={`${pageSize}`}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger
                      size="sm"
                      className="w-16 sm:w-20"
                      id="rows-per-page"
                    >
                      <SelectValue placeholder={pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 30, 50].map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Page info and navigation */}
                <div className="flex items-center justify-between sm:justify-center gap-4">
                  <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
                    Page {currentPage} of {Math.max(1, totalPages)}
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      className="hidden sm:flex h-8 w-8 p-0"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Go to first page</span>
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden sm:flex h-8 w-8 p-0"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Go to last page</span>
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}