// app/dashboard/history/page.tsx (or similar)

import { getAllHistory } from "@/actions/history.actions"; // adjust path if needed
import { format } from "date-fns";

export default async function Page() {
  const histories = await getAllHistory();

  console.log(histories)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Session History</h1>

      {histories.length === 0 ? (
        <p>No history yet. Go train, warrior 🥋</p>
      ) : (
        <ul className="space-y-4">
          {histories.map((h) => (
            <li key={h.id} className="border rounded p-4 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Type: {h.session.type}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Date: {format(new Date(h.createdAt), "PPpp")}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    Score:{" "}
                    <strong>
                      {h.correct}/{h.total}
                    </strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Accuracy: {((h.correct / h.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
