"use server";

import { toPromptType } from "@/lib/helpers/prompt";
import { prisma } from "../../lib";

export async function getRandomPrompts(type: string, count = 10) {
  const normalizedType = toPromptType(type); // ✅ Safe enum conversion

  const allPrompts = await prisma.prompt.findMany({
    where: { type: normalizedType },
  });

  // Randomize & slice
  return allPrompts.sort(() => Math.random() - 0.5).slice(0, count);
}

export async function getPromptById(id: string) {
  return prisma.prompt.findUnique({
    where: { id },
  });
}