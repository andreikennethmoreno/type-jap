import { notFound } from "next/navigation";
import Trainer from "@/components/trainer";
import { JSX } from "react";
import { getRandomPrompt } from "@/actions/prompt.actions";

export default async function Page({
  params,
}: {
  params: { script: string; mode: string };
}): Promise<JSX.Element> {
  const { script, mode } = params;

  const prompt = await getRandomPrompt(script);
  if (!prompt) return notFound();

  return <Trainer userId="TODO_ADD_USERID" script={script} mode={mode} />;
}
