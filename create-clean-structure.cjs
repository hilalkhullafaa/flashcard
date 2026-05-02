const fs = require("fs");

// Read clean chapter 7 as template
const ch07 = JSON.parse(fs.readFileSync("data/ch07.json", "utf8"));

// Function to create clean chapter structure
function createCleanChapter(chNum, title, titleRomaji, titleId) {
  return {
    chapter: {
      id: chNum,
      title: title,
      titleRomaji: titleRomaji,
      titleId: titleId
    },
    vocabulary: [],
    conversations: [],
    patterns: [],
    grammar: [],
    quiz: []
  };
}

// Chapter 6
const ch06 = createCleanChapter(
  6,
  "毎朝 6時に 起きます",
  "Maiasa rokuji ni okimasu",
  "Saya bangun jam 6 setiap pagi"
);

// Chapter 8  
const ch08 = createCleanChapter(
  8,
  "そろそろ 失礼します",
  "Sorosoro shitsurei shimasu",
  "Saya permisi dulu"
);

// Chapter 10
const ch10 = createCleanChapter(
  10,
  "あそこに コンビニが あります",
  "Asoko ni konbini ga arimasu", 
  "Di sana ada konbini"
);

// Save files
fs.writeFileSync("data/ch06.json", JSON.stringify(ch06, null, 2), "utf8");
fs.writeFileSync("data/ch08.json", JSON.stringify(ch08, null, 2), "utf8");
fs.writeFileSync("data/ch10.json", JSON.stringify(ch10, null, 2), "utf8");

console.log("✓ Created clean structure for ch06, ch08, ch10");
