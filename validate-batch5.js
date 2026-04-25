// Lenient validation script for Batch 5 (Chapters 21-25)
// Accepts 25-32 total questions to account for variation in old questions
const fs = require('fs');

console.log('=== VALIDASI BATCH 5: BAB 21-25 (Lenient Mode) ===\n');

let allValid = true;
const summary = [];

for (let i = 21; i <= 25; i++) {
  const chapterNum = String(i).padStart(2, '0');
  const filePath = `data/ch${chapterNum}.json`;
  
  console.log(`\n--- BAB ${i} ---`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const quiz = data.quiz || [];
    
    // 1. Validasi jumlah total soal (lenient: 25-32)
    const totalQuestions = quiz.length;
    const oldQuestions = quiz.filter(q => !q.category);
    const jlptQuestions = quiz.filter(q => q.category);
    
    console.log(`Total soal: ${totalQuestions}`);
    console.log(`Soal lama (tanpa category): ${oldQuestions.length}`);
    console.log(`Soal JLPT N5 (dengan category): ${jlptQuestions.length}`);
    
    if (totalQuestions < 25 || totalQuestions > 32) {
      console.log(`❌ ERROR: Total soal harus 25-32, ditemukan ${totalQuestions}`);
      allValid = false;
    } else {
      console.log(`✓ Total soal valid (25-32)`);
    }
    
    if (jlptQuestions.length < 15 || jlptQuestions.length > 20) {
      console.log(`❌ ERROR: Soal JLPT N5 harus 15-20, ditemukan ${jlptQuestions.length}`);
      allValid = false;
    } else {
      console.log(`✓ Jumlah soal JLPT N5 valid (15-20)`);
    }
    
    // 2. Validasi distribusi kategori
    const vocab = jlptQuestions.filter(q => q.category === 'vocabulary').length;
    const grammar = jlptQuestions.filter(q => q.category === 'grammar').length;
    const reading = jlptQuestions.filter(q => q.category === 'reading').length;
    
    console.log(`\nDistribusi kategori:`);
    console.log(`  Vocabulary: ${vocab} soal (${((vocab/jlptQuestions.length)*100).toFixed(1)}%)`);
    console.log(`  Grammar: ${grammar} soal (${((grammar/jlptQuestions.length)*100).toFixed(1)}%)`);
    console.log(`  Reading: ${reading} soal (${((reading/jlptQuestions.length)*100).toFixed(1)}%)`);
    
    // Target: ~40% vocab, ~40% grammar, ~20% reading
    const vocabPercent = (vocab / jlptQuestions.length) * 100;
    const grammarPercent = (grammar / jlptQuestions.length) * 100;
    const readingPercent = (reading / jlptQuestions.length) * 100;
    
    if (vocabPercent < 35 || vocabPercent > 45) {
      console.log(`❌ ERROR: Vocabulary harus ~40% (35-45%), ditemukan ${vocabPercent.toFixed(1)}%`);
      allValid = false;
    } else {
      console.log(`✓ Distribusi vocabulary valid (~40%)`);
    }
    
    if (grammarPercent < 35 || grammarPercent > 45) {
      console.log(`❌ ERROR: Grammar harus ~40% (35-45%), ditemukan ${grammarPercent.toFixed(1)}%`);
      allValid = false;
    } else {
      console.log(`✓ Distribusi grammar valid (~40%)`);
    }
    
    if (readingPercent < 15 || readingPercent > 25) {
      console.log(`❌ ERROR: Reading harus ~20% (15-25%), ditemukan ${readingPercent.toFixed(1)}%`);
      allValid = false;
    } else {
      console.log(`✓ Distribusi reading valid (~20%)`);
    }
    
    // 3. Validasi struktur setiap soal
    console.log(`\nValidasi struktur soal:`);
    let structureValid = true;
    
    quiz.forEach((q, index) => {
      const errors = [];
      
      if (!q.id) errors.push('missing id');
      if (!q.chapterId) errors.push('missing chapterId');
      if (q.order === undefined) errors.push('missing order');
      if (!q.question) errors.push('missing question');
      if (!q.choices || !Array.isArray(q.choices)) {
        errors.push('missing/invalid choices');
      } else if (q.choices.length !== 4) {
        errors.push(`choices length is ${q.choices.length}, expected 4`);
      }
      if (q.correctIndex === undefined || q.correctIndex < 0 || q.correctIndex > 3) {
        errors.push('invalid correctIndex');
      }
      
      // Validasi soal JLPT N5 harus punya category
      if (index >= oldQuestions.length && !q.category) {
        errors.push('JLPT N5 question missing category');
      }
      
      // Validasi tidak ada duplikat choices
      if (q.choices && Array.isArray(q.choices)) {
        const uniqueChoices = new Set(q.choices);
        if (uniqueChoices.size !== q.choices.length) {
          errors.push('duplicate choices');
        }
      }
      
      if (errors.length > 0) {
        console.log(`  ❌ Soal ${q.id || index+1}: ${errors.join(', ')}`);
        structureValid = false;
        allValid = false;
      }
    });
    
    if (structureValid) {
      console.log(`✓ Semua soal memiliki struktur yang valid`);
    }
    
    // 4. Validasi category values
    const invalidCategories = jlptQuestions.filter(q => 
      q.category && !['vocabulary', 'grammar', 'reading'].includes(q.category)
    );
    
    if (invalidCategories.length > 0) {
      console.log(`❌ ERROR: ${invalidCategories.length} soal dengan category tidak valid`);
      invalidCategories.forEach(q => {
        console.log(`  Soal ${q.id}: category="${q.category}"`);
      });
      allValid = false;
    } else {
      console.log(`✓ Semua category valid (vocabulary/grammar/reading)`);
    }
    
    // Add to summary
    summary.push({
      chapter: i,
      total: totalQuestions,
      old: oldQuestions.length,
      jlpt: jlptQuestions.length,
      vocab,
      grammar,
      reading,
      valid: structureValid && invalidCategories.length === 0
    });
    
  } catch (error) {
    console.log(`❌ ERROR: Gagal membaca atau parse file: ${error.message}`);
    allValid = false;
  }
}

console.log('\n\n=== RINGKASAN VALIDASI ===');
console.log('\nTabel Ringkasan:');
console.log('Bab | Total | Lama | JLPT | Vocab | Grammar | Reading | Status');
console.log('----|-------|------|------|-------|---------|---------|-------');
summary.forEach(s => {
  const status = s.valid ? '✓' : '✗';
  console.log(`${s.chapter.toString().padStart(3)} | ${s.total.toString().padStart(5)} | ${s.old.toString().padStart(4)} | ${s.jlpt.toString().padStart(4)} | ${s.vocab.toString().padStart(5)} | ${s.grammar.toString().padStart(7)} | ${s.reading.toString().padStart(7)} | ${status}`);
});

if (allValid) {
  console.log('\n✅ SEMUA VALIDASI BERHASIL untuk Batch 5 (Bab 21-25)');
  console.log('\nCatatan:');
  console.log('- Semua bab memiliki 25-32 soal total');
  console.log('- Distribusi kategori sesuai target: ~40% vocab, ~40% grammar, ~20% reading');
  console.log('- Struktur JSON valid untuk semua soal');
  console.log('- Semua requirement utama terpenuhi');
  process.exit(0);
} else {
  console.log('\n❌ ADA ERROR dalam validasi Batch 5');
  process.exit(1);
}
