// app/trainer/[script]/[mode]/page.tsx

import { notFound } from "next/navigation";
import Trainer from "@/components/trainer";
import katakanaWords from "@/lib/load/load-katakana";
import { KatakanaWord } from "@/interface/katakana-word.interface";
import { JSX } from "react";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default async function Page({
  params,
}: {
  params: Promise<{ script: string; mode: string }>;
}): Promise<JSX.Element> {
  const { script, mode } = await params;

  let words: KatakanaWord[] | null = null;
  switch (script) {
    case "katakana":
      words = katakanaWords;
      break;
    case "hiragana":
    case "kanji":
      break;
    default:
      return notFound();
  }

  if (!words?.length) return notFound();

  const shuffledWords = shuffle(words);
  return <Trainer words={shuffledWords} script={script} mode={mode} />;
}
