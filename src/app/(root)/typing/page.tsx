"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const scripts = ["katakana", "hiragana", "kanji"];

export default function TrainerHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Choose Your Training</h1>
      <div className="space-y-4">
        {scripts.map((script) => (
          <div key={script}>
            <h2 className="font-semibold">{script.toUpperCase()}</h2>
            <Link href={`/trainer/${script}`}>
              <Button variant="outline" className="mt-2">
                Start Romaji Practice
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
