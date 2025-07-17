import { notFound } from "next/navigation";
import Trainer from "@/components/trainer";
import katakanaWords from "@/lib/load/load-katakana";
import { KatakanaWord } from "@/interface/katakana-word.interface";

export default function Page({
  params,
}: {
  params: { script: string; mode: string };
}) {
  const { script, mode } = params;

  let words: KatakanaWord[] | null = null;

  // Load data based on script
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
      notFound(); // 404
  }

  if (!words) return notFound();

  return <Trainer words={words} script={script} mode={mode} />;
}
