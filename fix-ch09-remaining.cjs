const fs = require("fs");
let content = fs.readFileSync("data/ch09.json", "utf8");

// Replace all remaining corrupted patterns
const patterns = [
  [/�\?�\?/g, 'さい'],
  [/な�\?\?ま�\?�\?/g, 'なりました'],
  [/�\?つ/g, 'がつ'],
  [/にち/g, 'にち'],
  [/で�\?/g, 'です'],
  [/�\?\?/g, ''],
];

patterns.forEach(([pattern, replacement]) => {
  content = content.replace(pattern, replacement);
});

fs.writeFileSync("data/ch09.json", content, "utf8");
console.log("✓ Fixed all remaining corruption in Chapter 9");
