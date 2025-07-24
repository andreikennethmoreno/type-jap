"use server";

import { prisma } from "../../lib";
import { getDbUserId } from "./user.actions";


export async function getAllHistory() {
  const userId = await getDbUserId();
  if (!userId) throw new Error("User not found");

  const histories = await prisma.history.findMany({
    where: {
      session: {
        userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      score: true,
      total: true,
      correct: true,
      createdAt: true,
      metadata: true,
      session: {
        select: {
          id: true,
          type: true,
          promptIds: true,
        },
      },
    },
  });

  return histories;
}
