"use server";

import { PromptType } from "@prisma/client";
import { prisma } from "../../lib";

export async function getRandomPrompt(script: string) {
  const type = script.toUpperCase() as PromptType;

  const count = await prisma.prompt.count({
    where: { type },
  });

  if (count === 0) return null;

  const randomIndex = Math.floor(Math.random() * count);

  const prompt = await prisma.prompt.findMany({
    where: { type },
    skip: randomIndex,
    take: 1,
  });

  return prompt[0] ?? null;
}
