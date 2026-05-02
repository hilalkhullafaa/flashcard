const fs = require('fs');

console.log('🔧 Fixing ALL remaining corruption in Chapter 9...\n');

const filePath = 'data/ch09.json';
let content = fs.readFileSync(filePath, 'utf8');

// Fix all corrupted patterns systematically
const fixes = [
  // Fix corrupted Japanese text
  ['今日は 4がつ ついたちでさい?', '今日は 4月 ついたちです。'],
  ['�?�さいの さい?さい?�?びは 7がつ はつかでさい?', '私の 誕生日は 7月 はつかです。'],
  ['�?�さいの さい?さい?�?びは 3がつでさい?', '私の 誕生日は 3月です。'],
  ['さい?さい?�?びは がつでさい', '誕生日は いつですか'],
  ['�?�さいの さい?さい?�?びは 3がつ 15にちでさい?', '私の 誕生日は 3月 15日です。'],
  ['�?�さいは 1990年 7がつ 20にちに 生まれました', '私は 1990年 7月 20日に 生まれました。'],
  ['�?��?��?�は がつでさい', 'パーティーは いつですか。'],
  
  // Fix grammar explanation
  ['tahun (年)  bulan ()  tanggal (�?�)', 'tahun (年) → bulan (月) → tanggal (日)'],
  
  // Fix remaining corrupted characters
  [/�\?�さい/g, '私'],
  [/さい\?さい\?�\?び/g, '誕生日'],
  [/がつでさい/g, 'いつですか'],
  [/でさい\?/g, 'です。'],
  [/�\?�/g, '日'],
];

// Apply all fixes
let fixCount = 0;
fixes.forEach(([pattern, replacement]) => {
  const before = content;
  if (typeof pattern === 'string') {
    content = content.split(pattern).join(replacement);
  } else {
    content = content.replace(pattern, replacement);
  }
  if (content !== before) {
    fixCount++;
  }
});

console.log(`Applied ${fixCount} fixes`);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✓ Chapter 9 completely fixed');

// Verify JSON
try {
  JSON.parse(content);
  console.log('✅ Valid JSON');
} catch (e) {
  console.log('❌ JSON Error:', e.message);
}

// Check for remaining strange symbols
const hasStrangeSymbols = content.includes('�');
console.log(hasStrangeSymbols ? '⚠️  Still has strange symbols' : '✅ No strange symbols');
