// components/typing/info-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3"
        >
          <Info className="w-4 h-4" />
          <span className="hidden lg:inline md:inlinen">Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About This Trainer</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          {/* TODO: Add explanation or help text here */}
          This section will include helpful info in the future.
        </div>
      </DialogContent>
    </Dialog>
  );
}
