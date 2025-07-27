"use server";

import { prisma } from "../../lib"; 
import { getDbUserId } from "./user.actions";

const DEFAULT_LEVELS = ["N5", "N4", "N3", "N2", "N1"];

// 🧠 Core DB logic
export async function createDefaultJLPTConfig() {
  const userId = await getDbUserId();
  if (!userId) throw new Error("User not authenticated");

  const existing = await prisma.userConfig.findFirst({
    where: { userId, key: "jlptLevels" },
  });

  if (existing) return existing;

  return await prisma.userConfig.create({
    data: {
      key: "jlptLevels",
      value: { levels: DEFAULT_LEVELS },
      userId,
    },
  });
}

export async function getJLPTConfig() {
  const userId = await getDbUserId();
  if (!userId) throw new Error("User not authenticated");

  return await prisma.userConfig.findFirst({
    where: { userId, key: "jlptLevels" },
  });
}

export async function updateJLPTConfig(levels: string[]) {
  const userId = await getDbUserId();
  if (!userId) throw new Error("User not authenticated");

  const newLevels = levels.length > 0 ? levels : DEFAULT_LEVELS;

  return await prisma.userConfig.upsert({
    where: {
      userId_key: { userId, key: "jlptLevels" },
    },
    update: {
      value: { levels: newLevels },
    },
    create: {
      key: "jlptLevels",
      value: { levels: newLevels },
      userId,
    },
  });
}


export async function resetJLPTConfig() {
  return await updateJLPTConfig(DEFAULT_LEVELS);
}

export async function loadJLPTLevels() {
  const config = (await getJLPTConfig()) ?? (await createDefaultJLPTConfig());
  const value = config?.value;

  if (
    value &&
    typeof value === "object" &&
    "levels" in value &&
    Array.isArray((value as any).levels)
  ) {
    return (value as any).levels as string[];
  }

  return DEFAULT_LEVELS;
}
