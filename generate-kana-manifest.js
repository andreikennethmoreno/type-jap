const fs = require("fs");
const path = require("path");

const HIRAGANA_DIR = path.join(__dirname, "./public/hiragana-compressed");
const KATAKANA_DIR = path.join(__dirname, "./public/katakana-compressed");
const OUTPUT_FILE = path.join(__dirname, "./prisma/data/kana-image-manifest.json");

function getFilenamesFromDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) =>
    /\.(png|jpe?g|webp)$/i.test(file)
  );
}

function generateManifest() {
  const hiragana = getFilenamesFromDir(HIRAGANA_DIR);
  const katakana = getFilenamesFromDir(KATAKANA_DIR);

  const manifest = {
    hiragana,
    katakana,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`✅ Kana image manifest written to: ${OUTPUT_FILE}`);
}

generateManifest();
