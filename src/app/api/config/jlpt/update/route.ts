import { NextResponse } from "next/server";
import { updateJLPTConfig } from "@/actions/jlpt-config.actions";

export async function POST(request: Request) {
  try {
    const { levels } = await request.json();

    if (!Array.isArray(levels)) {
      return NextResponse.json({ error: "Invalid 'levels' format" }, { status: 400 });
    }

    const updated = await updateJLPTConfig(levels);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update JLPT config" }, { status: 500 });
  }
}
