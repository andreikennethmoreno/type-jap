const fs = require("fs");


// Load file
const filePath = "./prisma/data/json/hiragana-words.json"; // <- change if needed
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

data.vocabulary = data.vocabulary.map((item , index ) => {
  return {
    id: `hiragana-${index + 1}`, // or use padStart for prettier IDs
    ...item,
  };
});

// Save to a new file (optional backup)
fs.writeFileSync("./hiragana-with-ids.json", JSON.stringify(data, null, 2));

console.log("✅ Added IDs to all vocabulary entries!");
