import { notFound } from "next/navigation";
import Trainer from "@/components/trainer";
import katakanaWords from "@/lib/load/load-katakana";
import { KatakanaWord } from "@/interface/katakana-word.interface";

// ✅ Updated PageProps for Next.js 15
type PageProps = {
  params: Promise<{
    script: string;
    mode: string;
  }>;
};

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default async function Page({ params }: PageProps) {
  // ✅ Await the params Promise
  const { script, mode } = await params;

  let words: KatakanaWord[] | null = null;

  switch (script) {
    case "katakana":
      words = katakanaWords;
      break;
    case "hiragana":
      // words = hiraganaWords;
      break;
    case "kanji":
      // words = kanjiWords;
      break;
    default:
      notFound();
  }

  if (!words || words.length === 0) return notFound();

  const shuffledWords = shuffle(words);

  return <Trainer words={shuffledWords} script={script} mode={mode} />;
}
