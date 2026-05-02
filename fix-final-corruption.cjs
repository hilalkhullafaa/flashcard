const fs = require('fs');
const path = require('path');

console.log('🔧 Task 49: Final corruption fix\n');

// Fix quiz trailing spaces
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

// Fix speaker names and text using regex
function fixChapterText(chapterNum) {
  const filePath = path.join(__dirname, 'data', `ch${String(chapterNum).padStart(2, '0')}.json`);
  
  console.log(`\n📖 Chapter ${chapterNum}: Fixing text corruption...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix common corrupted patterns using regex
  // Katakana names
  content = content.replace(/ãƒŸãƒ©ãƒ¼/g, 'ミラー');
  content = content.replace(/ã‚«ãƒªãƒŠ/g, 'カリナ');
  content = content.replace(/ã‚µãƒ³ãƒˆã‚¹/g, 'サントス');
  
  // Particles
  content = content.replace(/ã‚'/g, 'を');
  content = content.replace(/ãŒ/g, 'が');
  
  // Punctuation
  content = content.replace(/â€"/g, '—');
  content = content.replace(/â€"/g, '–');
  content = content.replace(/ã€œ/g, '〜');
  
  // Japanese characters
  content = content.replace(/æœˆ/g, '月');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Fixed text corruption`);
    return 1;
  } else {
    console.log(`  ✓ No fixes needed`);
    return 0;
  }
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
console.log('PHASE 2: Fix text corruption (Chapters 6, 9, 10)');
console.log('='.repeat(60));

totalFixes += fixChapterText(6);
totalFixes += fixChapterText(9);
totalFixes += fixChapterText(10);

console.log('\n' + '='.repeat(60));
console.log('📊 Summary');
console.log('='.repeat(60));
console.log(`Total fixes applied: ${totalFixes}`);
console.log('\n✅ Task 49 complete!');
console.log('\nVerifying: Run detect-all-corruption.cjs');
