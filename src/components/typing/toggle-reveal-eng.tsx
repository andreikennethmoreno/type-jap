"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

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
    <div className="text-center space-y-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setRevealed(!revealed)}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {revealed ? (
          <>
            <EyeOff className="w-4 h-4 mr-2" />
            {hideLabel}
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 mr-2" />
            {label}
          </>
        )}
      </Button>

      {revealed && (
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="text-xl font-mono font-semibold text-primary">
            {hiddenText}
          </div>
        </div>
      )}
    </div>
  );
}
