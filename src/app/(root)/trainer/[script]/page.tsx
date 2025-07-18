import { notFound } from "next/navigation";

export default async function ScriptLanding({
  params,
}: {
  params: Promise<{ script: string }>;
}) {
  const { script } = await params;
  const modes = ["romaji", "meaning", "recognition"];
  const validScripts = ["katakana", "hiragana", "kanji"];

  if (!validScripts.includes(script)) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold capitalize">{script} Trainer</h1>
      <ul className="list-disc list-inside mt-4">
        {modes.map((mode) => (
          <li key={mode}>
            <a
              href={`/trainer/${script}/${mode}`}
              className="text-blue-600 underline"
            >
              Practice {mode}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
