// hooks/useSessionHistory.ts
import { getAllHistory } from "@/actions/history.actions";
import { SessionHistory } from "@/interface/analytics.interface";
import { useState, useEffect } from "react";

export function useSessionHistory() {
  const [history, setHistory] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getAllHistory();
        setHistory(data); // fix types here as needed
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return { history, loading, error };
}
