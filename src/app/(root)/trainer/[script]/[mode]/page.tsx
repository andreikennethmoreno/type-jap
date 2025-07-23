import { notFound } from "next/navigation";
import Trainer from "@/components/trainer";
import { JSX } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ script: string; mode: string }>;
}): Promise<JSX.Element> {
  const { script, mode } = await params;

  return <Trainer script={script} mode={mode} />;
}
