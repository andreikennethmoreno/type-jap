"use client";

import { useEffect, useState } from "react";
import { getKanaPromptByCharacter } from "@/actions/character.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { ReactNode } from "react";

type KanaPrompt = {
  id: string;
  japanese: string;
  romaji: string;
  meaning: string;
  mnemonic: string;
  pronunciation: string;
};

export default function InfoDialog({
  char,
  trigger,
}: {
  char: string;
  trigger: ReactNode;
}) {
  const [info, setInfo] = useState<KanaPrompt | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const result = await getKanaPromptByCharacter(char);
      setInfo(result);
    };

    fetchInfo();
  }, [char]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Character Info: {char}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          {info ? (
            <>
              <p>
                <strong>Romaji:</strong> {info.romaji}
              </p>
              <p>
                <strong>Meaning:</strong> {info.meaning}
              </p>
              <p>
                <strong>Pronunciation:</strong> {info.pronunciation}
              </p>
              <p>
                <strong>Mnemonic:</strong> {info.mnemonic}
              </p>
            </>
          ) : (
            <p>
              Loading info for <strong>{char}</strong>...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
