const fs = require('fs');

console.log('🔧 Comprehensive fix for Chapter 9...\n');

const filePath = 'data/ch09.json';
let content = fs.readFileSync(filePath, 'utf8');

// Fix all corrupted patterns systematically
const fixes = [
  // Speaker names
  [/ã‚«ãƒªãƒŠ/g, 'カリナ'],
  [/ãƒŸãƒ©ãƒ¼/g, 'ミラー'],
  [/�\?\?まだ/g, '山田'],
  [/ã‚µãƒ³ãƒˆã‚¹/g, 'サントス'],
  
  // Common Japanese words
  [/�\?\?�\?��\?��\?�\?\?�\?�/g, 'ミラーさん'],
  [/�\?�\?\?�\?�\?\?�\?誕生日/g, '誕生日'],
  [/誕生日は �\?い月です。すか\?/g, '誕生日は いつですか'],
  [/�\?い月です。すか\?/g, 'いつですか'],
  [/�\?月/g, '月'],
  [/です。す\?/g, 'です。'],
  [/今日\?\?�\?/g, '今日'],
  [/月�\?�\?ち/g, 'ついたち'],
  [/は月�\?/g, 'はつか'],
  [/年�\?\?/g, '年'],
  [/�\?ま�\?\?ま�\?�\?�\?\?/g, '生まれました'],
  [/�\?�\?\?�\?と�\?�\?�\?�\?ま�\?�\?\?/g, 'ありがとうございます'],
  [/�\?�\?\?�\?び�\?�\?�です。と�\?�\?�\?�\?ま�\?�\?\?/g, '誕生日おめでとうございます'],
  [/き�\?\?�\?/g, '今日'],
  [/つ�\?�\?ち/g, 'ついたち'],
  [/はつ�\?/g, 'はつか'],
  [/ね�\?\?/g, '年'],
  [/にほ�\?\?/g, '日本'],
  
  // Grammar explanations
  [/1â€"12 ditambahh sufiks ã€œæœˆ \(gatsu\)/g, '1-12 ditambah sufiks 〜月 (gatsu)'],
  [/Tidak ad/g, 'Tidak ada']
];

// Apply all fixes
fixes.forEach(([pattern, replacement]) => {
  content = content.replace(pattern, replacement);
});

fs.writeFileSync(filePath, content, 'utf8');

console.log('✓ Chapter 9 fixed');

// Verify JSON
try {
  JSON.parse(content);
  console.log('✅ Valid JSON');
} catch (e) {
  console.log('❌ JSON Error:', e.message);
}
