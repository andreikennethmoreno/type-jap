// components/History.tsx
import { KatakanaWord } from "@/interface/katakana-word.interface";

interface Props {
  history: {
    word: KatakanaWord;
    userInput: string;
    result: "correct" | "wrong";
  }[];
}

export default function History({ history }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 text-left max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">History</h2>
      <ul className="space-y-1 max-h-48 overflow-y-auto text-sm">
        {[...history].reverse().map((entry, idx) => (
          <li
            key={idx}
            className={`p-2 rounded border ${
              entry.result === "correct" ? "border-green-400" : "border-red-400"
            }`}
          >
            <strong>{entry.word.Japanese}</strong> →{" "}
            <code className="font-mono">{entry.userInput}</code>{" "}
            <span className="text-gray-500">
              (Expected: {entry.word.Romanji})
            </span>{" "}
            <span
              className={`ml-2 font-semibold ${
                entry.result === "correct" ? "text-green-600" : "text-red-600"
              }`}
            >
              ({entry.result})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
