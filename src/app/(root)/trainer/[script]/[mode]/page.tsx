// src/app/(root)/trainer/[script]/[mode]/page.tsx

import { notFound } from "next/navigation";
import Trainer from "@/components/trainer";
import katakanaWords from "@/lib/load/load-katakana";
import { KatakanaWord } from "@/interface/katakana-word.interface";
import { JSX } from "react";

// Define the exact type for your PageProps
interface TrainerPageProps {
  params: {
    script: string;
    mode: string;
  };
  // Next.js also provides a 'searchParams' object, even if empty.
  // It's good practice to include it in your type definition.
  searchParams?: { [key: string]: string | string[] | undefined };
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// Use the defined interface for your props
export default async function Page({
  params,
}: TrainerPageProps): Promise<JSX.Element> {
  // You can keep Promise<JSX.Element> or remove it, let's keep it for now
  const { script, mode } = params;

  let words: KatakanaWord[] | null = null;

  switch (script) {
    case "katakana":
      words = katakanaWords;
      break;
    case "hiragana":
      // words = hiraganaWords; // Make sure these are uncommented if you plan to use them
      break;
    case "kanji":
      // words = kanjiWords; // Make sure these are uncommented if you plan to use them
      break;
    default:
      notFound();
  }

  if (!words || words.length === 0) return notFound();

  const shuffledWords = shuffle(words);

  return <Trainer words={shuffledWords} script={script} mode={mode} />;
}
