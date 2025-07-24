import { notFound } from "next/navigation";
import Trainer from "@/components/trainer";
import { JSX } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ script: string }>;
}): Promise<JSX.Element> {
  const { script } = await params;

  const validScripts = ["katakana", "hiragana", "kanji"];
  if (!validScripts.includes(script)) notFound();

  return <Trainer script={script} />;
}
