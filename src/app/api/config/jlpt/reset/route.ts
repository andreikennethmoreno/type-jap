import { NextResponse } from "next/server";
import { resetJLPTConfig } from "@/actions/jlpt-config.actions";

export async function POST() {
  try {
    const reset = await resetJLPTConfig();
    return NextResponse.json(reset);
  } catch {
    return NextResponse.json({ error: "Failed to reset JLPT config" }, { status: 500 });
  }
}
