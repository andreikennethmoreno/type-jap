import { PromptType } from "@prisma/client";

export function toVocabType(type: string): PromptType {
  const match = Object.values(PromptType).find(
    (v) => v.toLowerCase() === type.toLowerCase()
  );
  if (!match) {
    throw new Error(`Invalid prompt type: ${type}`);
  }
  return match as PromptType;
}
