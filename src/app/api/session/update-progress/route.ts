import { NextResponse } from "next/server";
import { updateSessionProgress } from "@/actions/session.actions";

export async function POST(request: Request) {
  try {
    const { sessionId, progress } = await request.json();

    if (!sessionId || typeof progress !== "number") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const result = await updateSessionProgress(sessionId, progress);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
