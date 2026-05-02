const fs = require('fs');

console.log('🔧 Fixing Chapter 6 byte-level corruption\n');

const filePath = 'data/ch06.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Fix grammar[0]
if (data.grammar && data.grammar[0]) {
  data.grammar[0].title = 'Partikel を (wo) — Penanda Objek Langsung';
  data.grammar[0].explanation = 'Partikel を (dibaca \'o\') digunakan untuk menandai objek langsung dari verba transitif — yaitu benda atau orang yang menerima aksi dari verba. Dalam bahasa Indonesia, objek langsung biasanya tidak memerlukan preposisi khusus.';
  console.log('✓ Fixed grammar[0]');
}

// Fix patterns[0]
if (data.patterns && data.patterns[0]) {
  data.patterns[0].pattern = 'N を V';
  data.patterns[0].explanation = 'Partikel を (wo/o) menandai objek langsung dari suatu tindakan. Digunakan sebelum verba transitif untuk menunjukkan apa yang menjadi objek dari tindakan tersebut.';
  console.log('✓ Fixed patterns[0]');
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('\n✅ Chapter 6 corruption fixed!');
