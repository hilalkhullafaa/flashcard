const fs = require('fs');
const path = require('path');

console.log('🔧 Task 49: Fixing remaining 86 corrupted fields\n');

// Fix quiz trailing spaces (Chapters 1-4)
function fixQuizTrailingSpaces(chapterNum) {
  const filePath = path.join(__dirname, 'data', `ch${String(chapterNum).padStart(2, '0')}.json`);
  
  console.log(`\n📖 Chapter ${chapterNum}: Fixing quiz trailing spaces...`);
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let fixCount = 0;
  
  if (data.quiz && Array.isArray(data.quiz)) {
    data.quiz.forEach((q, index) => {
      if (q.question && typeof q.question === 'string') {
        const original = q.question;
        
        // Remove trailing spaces from each line
        let fixed = q.question
          .split('\n')
          .map(line => line.trimEnd())
          .join('\n')
          .trim();
        
        if (fixed !== original) {
          q.question = fixed;
          fixCount++;
        }
      }
    });
  }
  
  if (fixCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`  ✓ Fixed ${fixCount} quiz questions`);
  }
  
  return fixCount;
}

// Fix speaker names and specific text patterns
function fixSpecificCorruption(chapterNum, fixes) {
  const filePath = path.join(__dirname, 'data', `ch${String(chapterNum).padStart(2, '0')}.json`);
  
  console.log(`\n📖 Chapter ${chapterNum}: Fixing specific corruption...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fixCount = 0;
  
  fixes.forEach(fix => {
    if (content.includes(fix.from)) {
      content = content.split(fix.from).join(fix.to);
      fixCount++;
      console.log(`  ✓ Fixed: ${fix.from.substring(0, 30)}... → ${fix.to.substring(0, 30)}...`);
    }
  });
  
  if (fixCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return fixCount;
}

// Main execution
console.log('='.repeat(60));
console.log('PHASE 1: Fix quiz trailing spaces (Chapters 1-4)');
console.log('='.repeat(60));

let totalFixes = 0;
totalFixes += fixQuizTrailingSpaces(1);
totalFixes += fixQuizTrailingSpaces(2);
totalFixes += fixQuizTrailingSpaces(3);
totalFixes += fixQuizTrailingSpaces(4);

console.log('\n' + '='.repeat(60));
console.log('PHASE 2: Fix speaker names and text (Chapters 6, 9, 10)');
console.log('='.repeat(60));

// Chapter 6 fixes
const ch6Fixes = [
  { from: 'ãƒŸãƒ©ãƒ¼', to: 'ミラー' },
  { from: 'ã‚«ãƒªãƒŠ', to: 'カリナ' },
  { from: 'ã‚'', to: 'を' },
  { from: 'â€"', to: '—' },
  { from: 'Partikel ã‚' (wo) â€" Penanda Objek Langsung', to: 'Partikel を (wo) — Penanda Objek Langsung' },
  { from: 'Partikel ã‚' (dibaca \'o\') digunakan untuk menandai objek langsung daari verba transitif â€" yaitu ben', to: 'Partikel を (dibaca \'o\') digunakan untuk menandai objek langsung dari verba transitif — yaitu ben' },
  { from: 'N ã‚' V', to: 'N を V' },
  { from: 'Partikel ã‚' (wo/o) menandai objek langsung dari suatu tindakan. Diggunakan sebelum verba transitif u', to: 'Partikel を (wo/o) menandai objek langsung dari suatu tindakan. Digunakan sebelum verba transitif u' }
];
totalFixes += fixSpecificCorruption(6, ch6Fixes);

// Chapter 9 fixes
const ch9Fixes = [
  { from: 'Nama bulan dalam bahasa Jepang dibentuk dengan angka 1â€"12 ditambahh sufiks ã€œæœˆ (gatsu). Tidak ad', to: 'Nama bulan dalam bahasa Jepang dibentuk dengan angka 1—12 ditambah sufiks 月 (gatsu). Tidak ad' }
];
totalFixes += fixSpecificCorruption(9, ch9Fixes);

// Chapter 10 fixes
const ch10Fixes = [
  { from: 'ãƒŸãƒ©ãƒ¼', to: 'ミラー' },
  { from: 'ã‚«ãƒªãƒŠ', to: 'カリナ' },
  { from: 'Partikel ãŒ â€" Penanda Objek Kemampuan', to: 'Partikel が — Penanda Objek Kemampuan' }
];
totalFixes += fixSpecificCorruption(10, ch10Fixes);

console.log('\n' + '='.repeat(60));
console.log('📊 Summary');
console.log('='.repeat(60));
console.log(`Total fixes applied: ${totalFixes}`);
console.log('\n✅ Task 49 Phase 2 complete!');
console.log('\nNext: Run detect-all-corruption.cjs to verify all corruption is fixed');
