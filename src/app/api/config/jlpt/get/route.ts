import { NextResponse } from "next/server";
import { getJLPTConfig } from "@/actions/jlpt-config.actions";

export async function GET() {
  const config = await getJLPTConfig();
  return NextResponse.json(config);
}
