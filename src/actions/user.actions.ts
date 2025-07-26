"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../lib";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const existingUser = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}


export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      }
    });

    return user;
  } catch (error) {
    console.log("Error in getUser", error);
  }
}

export async function getCurrentDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  return await getUserByClerkId(userId);
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();

  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
}