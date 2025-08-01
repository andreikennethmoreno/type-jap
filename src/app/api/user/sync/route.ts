import { NextResponse } from "next/server";
import { syncUser } from "@/actions/user.actions";

export async function POST() {
  try {
    const result = await syncUser();
    if (!result) {
      return NextResponse.json({ error: "User not authenticated or already synced" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
