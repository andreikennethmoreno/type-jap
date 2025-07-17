"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  label?: string;
  hiddenText: string;
  hideLabel?: string;
}

export default function ToggleRevealEng({
  hiddenText,
  label = "Show Answer",
  hideLabel = "Hide Answer",
}: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mt-2 text-sm text-muted-foreground space-y-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setRevealed(!revealed)}
        className="text-xs underline"
      >
        {revealed ? hideLabel : label}
      </Button>

      {revealed && (
        <div className="text-lg font-semibold text-primary">{hiddenText}</div>
      )}
    </div>
  );
}
