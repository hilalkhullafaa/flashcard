const fs = require('fs');

console.log('🔧 Final cleanup: Fixing quiz formatting in Chapters 1-4\n');

function fixQuizFormatting(chapterNum) {
  const filePath = `data/ch${String(chapterNum).padStart(2, '0')}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let fixCount = 0;
  
  data.quiz.forEach((q, index) => {
    if (q.question && typeof q.question === 'string') {
      const original = q.question;
      
      // Fix formatting:
      // 1. Replace double newlines with single newline
      // 2. Remove trailing spaces from each line
      // 3. Remove excessive spaces (2+ consecutive spaces)
      let fixed = q.question
        .replace(/\n\n+/g, '\n')  // Double newlines → single
        .split('\n')
        .map(line => line.replace(/\s+$/g, ''))  // Remove trailing spaces
        .join('\n')
        .replace(/  +/g, ' ')  // Multiple spaces → single space
        .trim();
      
      if (fixed !== original) {
        q.question = fixed;
        fixCount++;
      }
    }
  });
  
  if (fixCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Chapter ${chapterNum}: Fixed ${fixCount} quiz questions`);
  } else {
    console.log(`Chapter ${chapterNum}: No fixes needed`);
  }
  
  return fixCount;
}

let totalFixes = 0;
totalFixes += fixQuizFormatting(1);
totalFixes += fixQuizFormatting(2);
totalFixes += fixQuizFormatting(3);
totalFixes += fixQuizFormatting(4);

console.log(`\n✅ Total quiz questions fixed: ${totalFixes}`);
console.log('\nRun detect-all-corruption.cjs to verify all corruption is fixed.');
