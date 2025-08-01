import { NextResponse } from "next/server";
import { finalizeSession } from "@/actions/session.actions";

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    const result = await finalizeSession(sessionId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to finalize session" }, { status: 500 });
  }
}
