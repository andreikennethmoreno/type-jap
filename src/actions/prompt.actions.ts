"use server";

import { PromptType } from "@prisma/client";
import { prisma } from "../../lib";

export async function getRandomPrompts(type: PromptType, count = 10) {
  const allPrompts = await prisma.prompt.findMany({
    where: { type },
  });

  if (!allPrompts.length) return [];

  // Shuffle aggressively in memory
  const shuffled = allPrompts.sort(() => Math.random() - 0.5);

  // Take only the top `count`
  return shuffled.slice(0, count);
}

export async function getPromptById(id: string) {
  return prisma.prompt.findUnique({
    where: { id },
  });
}