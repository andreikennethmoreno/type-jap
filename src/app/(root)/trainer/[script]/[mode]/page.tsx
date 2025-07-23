import { notFound } from "next/navigation";
import Trainer from "@/components/trainer";
import { JSX } from "react";

export default async function Page({
  params,
}: {
  params: { script: string; mode: string };
}): Promise<JSX.Element> {
  const { script, mode } = params;

  return <Trainer script={script} mode={mode} />;
}
