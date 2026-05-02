const fs = require('fs');
const path = require('path');

console.log('🔧 Task 49: Comprehensive corruption fix\n');
console.log('Strategy: Fix line breaks and normalize text\n');

// Create backup
function createBackup(chapterNum) {
  const filePath = path.join(__dirname, 'data', `ch${String(chapterNum).padStart(2, '0')}.json`);
  const backupPath = `${filePath}.backup-task49-${Date.now()}`;
  
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`✓ Backup: ${path.basename(backupPath)}`);
  }
}

// Fix quiz questions with excessive line breaks
function fixQuizLineBreaks(chapterNum) {
  const filePath = path.join(__dirname, 'data', `ch${String(chapterNum).padStart(2, '0')}.json`);
  
  console.log(`\n📖 Chapter ${chapterNum}: Fixing quiz questions...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found`);
    return 0;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let fixCount = 0;
  
  if (data.quiz && Array.isArray(data.quiz)) {
    data.quiz.forEach((q, index) => {
      if (q.question && typeof q.question === 'string') {
        const original = q.question;
        
        // Fix excessive line breaks
        let fixed = q.question
          // Remove 3+ consecutive line breaks
          .replace(/\n{3,}/g, '\n\n')
          // Remove trailing spaces before line breaks
          .replace(/ +\n/g, '\n')
          // Remove leading spaces after line breaks  
          .replace(/\n +/g, '\n')
          // Remove excessive spaces
          .replace(/  +/g, ' ')
          // Trim
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
  } else {
    console.log(`  ✓ No fixes needed`);
  }
  
  return fixCount;
}

// Fix corrupted text by removing replacement characters
function cleanCorruptedText(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Remove replacement characters and control characters
  return text
    .replace(/�/g, '')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    .replace(/\uFFFD/g, '')
    .trim();
}

// Recursively clean all strings in an object
function cleanObject(obj) {
  if (typeof obj === 'string') {
    return cleanCorruptedText(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item));
  } else if (obj && typeof obj === 'object') {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
      cleaned[key] = cleanObject(obj[key]);
    });
    return cleaned;
  }
  return obj;
}

// Fix severely corrupted chapters
function fixSevereCorruption(chapterNum) {
  const filePath = path.join(__dirname, 'data', `ch${String(chapterNum).padStart(2, '0')}.json`);
  
  console.log(`\n📖 Chapter ${chapterNum}: Cleaning corruption...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found`);
    return 0;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const cleaned = cleanObject(data);
  
  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf8');
  console.log(`  ✓ Cleaned all text fields`);
  
  return 1;
}

// Main execution
console.log('Creating backups...\n');
for (let i = 1; i <= 10; i++) {
  createBackup(i);
}

console.log('\n' + '='.repeat(60));
console.log('PHASE 1: Fix quiz line breaks (Chapters 1-4)');
console.log('='.repeat(60));

let totalFixes = 0;
totalFixes += fixQuizLineBreaks(1);
totalFixes += fixQuizLineBreaks(2);
totalFixes += fixQuizLineBreaks(3);
totalFixes += fixQuizLineBreaks(4);

console.log('\n' + '='.repeat(60));
console.log('PHASE 2: Clean severe corruption (Chapters 6, 8, 9, 10)');
console.log('='.repeat(60));

fixSevereCorruption(6);
fixSevereCorruption(8);
fixSevereCorruption(9);
fixSevereCorruption(10);

console.log('\n' + '='.repeat(60));
console.log('📊 Summary');
console.log('='.repeat(60));
console.log(`Quiz fixes: ${totalFixes}`);
console.log(`Severe corruption cleaned: Chapters 6, 8, 9, 10`);
console.log('\n✅ Phase 1 complete!');
console.log('\nNext: Run detect-all-corruption.cjs to verify');
