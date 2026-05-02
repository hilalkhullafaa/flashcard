const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Chapter 9 corruption...\n');

const filePath = path.join(__dirname, 'data', 'ch09.json');
let content = fs.readFileSync(filePath, 'utf8');

// Fix speaker names that are still corrupted
content = content.replace(/�??山田/g, '山田');

// Fix all instances of corrupted "いつ" (itsu - when)
content = content.replace(/�?い月です。すか\?/g, 'いつですか');
content = content.replace(/�?月/g, '月');

// Fix "です。す?" patterns
content = content.replace(/です。す\?/g, 'です。');

// Fix "今日??" patterns
content = content.replace(/今日\?\?�\?/g, '今日');

// Fix "月�?�?ち" patterns (ついたち - first day)
content = content.replace(/月�\?�\?ち/g, 'ついたち');

// Fix "は月�?" patterns (はつか - 20th day)
content = content.replace(/は月�\?/g, 'はつか');

// Fix "年�??" patterns
content = content.replace(/年�\?\?/g, '年');

// Fix "生まれました" patterns
content = content.replace(/�\?ま�\?\?ま�\?�\?�\?\?/g, '生まれました');

// Fix "ありがとうございます" patterns
content = content.replace(/�\?�\?\?�\?と�\?�\?�\?�\?ま�\?�\?\?/g, 'ありがとうございます');

// Fix "おめでとうございます" patterns
content = content.replace(/�\?�\?�です。と�\?�\?�\?�\?ま�\?�\?\?/g, 'おめでとうございます');

// Fix remaining corrupted Japanese characters in conversations
content = content.replace(/�\?\?�\?��\?��\?�\?\?�\?�/g, 'ミラーさん');
content = content.replace(/�\?�\?\?�\?�\?\?�\?誕生日/g, '誕生日');

// Fix grammar explanation
content = content.replace(/1â€"12 ditambahh sufiks ã€œæœˆ \(gatsu\)/g, '1-12 ditambah sufiks 〜月 (gatsu)');

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✓ Chapter 9 fixed');
console.log('\nVerifying JSON validity...');

try {
  JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log('✅ Chapter 9 is valid JSON');
} catch (e) {
  console.log('❌ Chapter 9 has JSON errors:', e.message);
}
