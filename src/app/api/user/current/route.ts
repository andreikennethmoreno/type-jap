import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/actions/user.actions";

export async function GET() {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching current DB user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
