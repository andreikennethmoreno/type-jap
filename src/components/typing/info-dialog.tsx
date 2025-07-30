"use client";

import { useEffect, useState } from "react";
import { getKanaImagesForCharacter, getKanaPromptByCharacter } from "@/actions/character.actions";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

type KanaType = "hiragana" | "katakana";

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
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      setIsLoading(true);
      try {
        const result = await getKanaPromptByCharacter(char);
        setInfo(result);

        if (result) {
          const type: KanaType = result.id.startsWith("hiragana") ? "hiragana" : "katakana";
          const imageList = getKanaImagesForCharacter(result.japanese, type);
          setImages(imageList);
        }
      } catch (error) {
        console.error("Failed to fetch character info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfo();
  }, [char]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[280px] w-[280px] gap-3 p-4">
        <DialogTitle className="sr-only"></DialogTitle>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="w-full aspect-square rounded" />
            <div className="space-y-1">
              <Skeleton className="h-6 w-12 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ) : info ? (
          <div className="space-y-2 p-5">
            {/* Main Image/Character Display */}
            <div className="w-full aspect-square rounded border bg-white flex items-center justify-center">
              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={`Mnemonic for ${char}`}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
            <div className="flex items-center justify-center w-full h-full p-2">
<span className="text-[#45ACE7] font-bold text-center text-[clamp(2.5rem,6vw,4.5rem)] leading-none break-words">
                {info.japanese}
              </span>
            </div>


              )}
            </div>

            {/* Character Info */}
            <div className="text-center space-y-1">
              <div className="text-xl font-bold text-foreground">
                {info.romaji}
              </div>
              <div className="text-xs text-muted-foreground">
                {info.pronunciation}
              </div>
            </div>

            {/* Mnemonic */}
            {info.mnemonic && (
              <div className="text-xs text-center text-muted-foreground leading-snug px-1">
                {info.mnemonic}
              </div>
            )}

            {/* Additional Images */}
            {images.length > 1 && (
              <div className="flex gap-1 justify-center">
                {images.slice(1, 4).map((imgUrl, idx) => (
                  <img
                    key={idx + 1}
                    src={imgUrl}
                    alt={`Mnemonic ${idx + 2} for ${char}`}
                    className="w-8 h-8 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-xs text-muted-foreground">
              Failed to load info for <strong>{char}</strong>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}