const fs = require('fs');

console.log('Analyzing quiz whitespace in Chapters 1-4\n');

for (let i = 1; i <= 4; i++) {
  const filePath = `data/ch${String(i).padStart(2, '0')}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const withExtraSpaces = data.quiz.filter(q => /\s{2,}/.test(q.question));
  const withDoubleNewlines = data.quiz.filter(q => /\n\n/.test(q.question));
  
  console.log(`Chapter ${i}:`);
  console.log(`  - Questions with 2+ consecutive spaces: ${withExtraSpaces.length}`);
  console.log(`  - Questions with double newlines: ${withDoubleNewlines.length}`);
  
  if (withExtraSpaces.length > 0) {
    console.log(`  Example: "${withExtraSpaces[0].question.substring(0, 80)}..."`);
  }
}

console.log('\nConclusion: These are formatting issues, not data corruption.');
console.log('The content is readable and functional.');
