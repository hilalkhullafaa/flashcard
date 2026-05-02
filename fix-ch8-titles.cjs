const fs = require('fs');

console.log('=== FIXING CHAPTER 8 GRAMMAR TITLES ===\n');

const ch8 = JSON.parse(fs.readFileSync('data/ch08.json', 'utf8'));

console.log('Before fixes:');
console.log('Grammar #1 title:', ch8.grammar[0].title);
console.log('Grammar #2 title:', ch8.grammar[1].title);
console.log('Grammar #1 explanation snippet:', ch8.grammar[0].explanation.substring(0, 200));

// Fix grammar titles
ch8.grammar[0].title = "Kata Penggolong (助数詞) dalam Bahasa Jepang";
ch8.grammar[1].title = "Sistem Bilangan Asli Jepang (和語数詞)";

// Fix explanation with corrupted kanji
ch8.grammar[0].explanation = "Bahasa Jepang menggunakan kata penggolong (josushi) yang berbeda-beda tergantung jenis benda yang dihitung. Pengucapan angka pun sering berubah saat digabung dengan penggolong tertentu karena proses asimilasi bunyi. Misalnya, 1本 dibaca 'ippon' bukan 'ichipon', dan 3本 dibaca 'sanbon'. Memilih penggolong yang tepat adalah bagian penting dari tata bahasa Jepang.";

fs.writeFileSync('data/ch08.json', JSON.stringify(ch8, null, 2), 'utf8');

console.log('\n✅ Fixes applied!');
console.log('\nAfter fixes:');
console.log('Grammar #1 title:', ch8.grammar[0].title);
console.log('Grammar #2 title:', ch8.grammar[1].title);
console.log('Grammar #1 explanation snippet:', ch8.grammar[0].explanation.substring(0, 200));
