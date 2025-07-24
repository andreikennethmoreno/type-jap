import { PrismaClient, PromptType } from "@prisma/client";
//import { promptSeedData } from "./data/hiragana-common-100-words";
import { promptSeedData } from "./data/kanji-common-100-words";


const prisma = new PrismaClient();

async function main() {
  await prisma.prompt.createMany({
    data: promptSeedData.map((item) => ({
      ...item,
      type: PromptType[item.type as keyof typeof PromptType], // 👈 safely cast string to enum
    })),
  });

  console.log("✅ Prompts seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
