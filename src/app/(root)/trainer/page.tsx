// app/trainer/page.tsx

"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const scripts = ["katakana", "hiragana", "kanji"];
const modes = ["romaji", "meaning", "recognition"];

export default function TrainerHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Choose Your Training</h1>
      <div className="space-y-4">
        {scripts.map((script) => (
          <div key={script}>
            <h2 className="font-semibold">{script.toUpperCase()}</h2>
            <div className="flex gap-2 mt-2">
              {modes.map((mode) => (
                <Link key={mode} href={`/trainer/${script}/${mode}`}>
                  <Button variant="outline">{mode}</Button>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
