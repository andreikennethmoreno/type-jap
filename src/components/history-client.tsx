"use client";

import { useState, useEffect } from "react";

import { getAllHistory } from "@/actions/history.actions";
import { HistoryFilters } from "@/components/history-filters";
import { SessionCard } from "@/components/session-cards";

interface HistoryItem {
  id: string;
  score: number;
  total: number;
  createdAt: string;
  session: {
    id: string;
    type: string;
  };
  answers: Array<{
    id: string;
    isCorrect: boolean;
    userAnswer: string;
    prompt?: {
      japanese: string;
      meaning: string;
      romaji: string;
    };
  }>;
}

export default function HistoryClient() {
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getAllHistory();
        setHistories(data);
                console.log(data);

      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const sessionTypes = Array.from(
    new Set(histories.map((h) => h.session.type))
  );

  const filteredAndSortedHistories = histories
    .filter(
      (history) =>
        selectedType === "all" || history.session.type === selectedType
    )
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "score") {
        const aPercentage = (a.score / a.total) * 100;
        const bPercentage = (b.score / b.total) * 100;
        comparison = aPercentage - bPercentage;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleRedo = (sessionId: string) => {
    console.log("Redo session:", sessionId);
    // TODO: Navigate to session or restart session
  };

  const handleDelete = (historyId: string) => {
    console.log("Delete history:", historyId);
    // TODO: Delete history item
    setHistories((prev) => prev.filter((h) => h.id !== historyId));
  };

  if (loading) {
    return (
      <div className="p-6">
        {/* <h1 className="text-2xl font-bold mb-6">Session History</h1> */}
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        {/* <h1 className="text-2xl font-bold">Session History</h1> */}
        <span className="text-sm text-muted-foreground">
          {filteredAndSortedHistories.length} session
          {filteredAndSortedHistories.length !== 1 ? "s" : ""}
        </span>
      </div>

      {histories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No sessions completed yet.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Complete a learning session to see your history here.
          </p>
        </div>
      ) : (
        <>
          <HistoryFilters
            sessionTypes={sessionTypes}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          {filteredAndSortedHistories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No sessions found with the current filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedHistories.map((history) => (
                <SessionCard
                  key={history.id}
                  history={history}
                  onRedo={handleRedo}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
