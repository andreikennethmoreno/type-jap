import { notFound } from "next/navigation";
import Trainer from "@/components/trainer";
import { JSX } from "react";
import { getRandomPrompt } from "@/actions/prompt.actions";

export default async function Page({
  params,
}: {
  params: Promise<{ script: string; mode: string }>;
}): Promise<JSX.Element> {
  const { script, mode } = await params;

  const prompt = await getRandomPrompt(script);
  if (!prompt) return notFound();

  // simulate words array to match Trainer's expected props
  const words = [prompt]; // just one random word for now

  return <Trainer words={words} script={script} mode={mode} />;
}
