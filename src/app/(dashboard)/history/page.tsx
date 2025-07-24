import { getAllHistory } from "@/actions/history.actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function HistoryPage() {
  const histories = await getAllHistory();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Session History</h1>

      {histories.length === 0 ? (
        <p className="text-muted-foreground">No history yet.</p>
      ) : (
        histories.map((history) => (
          <Card key={history.id} className="p-4">
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(history.createdAt).toLocaleString()}
                  </p>
                  <h2 className="text-lg font-semibold">
                    {history.session.type} Session
                  </h2>
                </div>
                <Badge variant="outline">
                  Score: {history.score}/{history.total}
                </Badge>
              </div>

              <div className="grid gap-2">
                {history.answers.map((ans, i) => {
                  const prompt = ans.prompt;

                  if (!prompt) {
                    console.warn("⚠️ Missing prompt data in answer:", ans);

                    return (
                      <div
                        key={i}
                        className="border border-yellow-400 rounded-md p-3"
                      >
                        <p className="font-medium text-yellow-700">
                          ⚠️ Prompt data missing
                        </p>
                        <p>
                          Your answer:{" "}
                          <span className="font-mono">{ans.userAnswer}</span>
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className={`border rounded-md p-3 ${
                        ans.isCorrect
                          ? "border-green-400 "
                          : "border-red-400 "
                      }`}
                    >
                      <p className="font-medium">
                        {prompt.japanese} ({prompt.meaning})
                      </p>
                      <p>
                        Your answer:{" "}
                        <span className="font-mono">{ans.userAnswer}</span>{" "}
                        {ans.isCorrect ? "✅" : "❌"}
                      </p>
                      {!ans.isCorrect && (
                        <p className="text-sm text-muted-foreground">
                          Correct:{" "}
                          <span className="font-mono">{prompt.romaji}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
