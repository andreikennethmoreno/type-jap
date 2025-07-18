import { notFound } from "next/navigation";
import Trainer from "@/components/trainer";
import katakanaWords from "@/lib/load/load-katakana";
import { KatakanaWord } from "@/interface/katakana-word.interface";
import { JSX } from "react";

interface TrainerPageProps {
  params: Promise<{
    script: string;
    mode: string;
  }>;
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default async function Page({
  params,
}: TrainerPageProps): Promise<JSX.Element> {
  // Await the params directly as it's a Promise in Next.js 15
  const awaitedParams = await params;
  const { script, mode } = awaitedParams;

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
