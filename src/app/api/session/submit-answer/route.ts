import { NextResponse } from "next/server";
import { submitAnswer } from "@/actions/session.actions";

export async function POST(request: Request) {
  try {
    const { sessionId, promptId, userAnswer, correct } = await request.json();

    if (!sessionId || !promptId || typeof userAnswer !== "string" || typeof correct !== "boolean") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const result = await submitAnswer(sessionId, promptId, userAnswer, correct);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 });
  }
}
