import { NextResponse } from "next/server";
import { startOrResumeSession } from "@/actions/session.actions";

export async function POST(request: Request) {
  try {
    const { type } = await request.json();
    if (!type) {
      return NextResponse.json({ error: "Missing session type" }, { status: 400 });
    }

    const result = await startOrResumeSession(type);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to start or resume session" }, { status: 500 });
  }
}
