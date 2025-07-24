"use server";

import { toPromptType } from "@/lib/helpers/prompt";
import { prisma } from "../../lib";

export async function getRandomPrompts(type: string, count = 10) {
  const normalizedType = toPromptType(type);

  const total = await prisma.prompt.count({
    where: { type: normalizedType },
  });

  if (total === 0) return [];

  const offsets = new Set<number>();
  while (offsets.size < Math.min(count, total)) {
    offsets.add(Math.floor(Math.random() * total));
  }

  const prompts = await Promise.all(
    [...offsets].map((offset) =>
      prisma.prompt.findFirst({
        where: { type: normalizedType },
        skip: offset,
      })
    )
  );

  // 🔥 Fix TS error with type guard
  return prompts.filter((p): p is NonNullable<typeof p> => p !== null);
}


export async function getPromptById(id: string) {
  return prisma.prompt.findUnique({
    where: { id },
  });
}

export async function getPromptsByIds(ids: string[]) {
  return prisma.prompt.findMany({
    where: {
      id: { in: ids },
    },
  });
}
