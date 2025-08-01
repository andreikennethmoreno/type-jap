import { NextResponse } from "next/server";
import imageListJson from "@/prisma/data/kana-image-manifest.json";

const imageListRaw = imageListJson.imageListRaw as Record<"hiragana" | "katakana", string[]>;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kana = searchParams.get("kana");
  const type = searchParams.get("type") as "hiragana" | "katakana";

  if (!kana || !type || !imageListRaw[type]) {
    return NextResponse.json({ error: "Missing or invalid params" }, { status: 400 });
  }

  const matches = imageListRaw[type].filter((entry) => entry.includes(kana));
  const urls = matches.map((filename) => `/${type}/${filename}`);

  return NextResponse.json(urls);
}
