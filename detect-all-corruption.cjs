const fs = require('fs');

console.log('🔍 Comprehensive corruption detection for chapters 1-10...\n');

function hasCorruption(text) {
  if (!text || typeof text !== 'string') return false;
  // Detect replacement character, control characters, and malformed UTF-8
  return /[�\x00-\x1F\x7F-\x9F]|�/.test(text) || 
         /[\uFFFD]/.test(text) ||
         /ã[^a-z\s]/.test(text); // Common UTF-8 corruption pattern
}

function checkObject(obj, path = '') {
  const issues = [];
  
  if (typeof obj === 'string') {
    if (hasCorruption(obj)) {
      issues.push({ path, value: obj.substring(0, 100) });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      issues.push(...checkObject(item, `${path}[${index}]`));
    });
  } else if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      issues.push(...checkObject(obj[key], path ? `${path}.${key}` : key));
    });
  }
  
  return issues;
}

let totalIssues = 0;
const corruptedChapters = [];

for (let chapterNum = 1; chapterNum <= 10; chapterNum++) {
  const chNum = chapterNum.toString().padStart(2, '0');
  const filePath = `data/ch${chNum}.json`;
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`\n📖 Chapter ${chapterNum}:`);
    const issues = checkObject(data);
    
    if (issues.length > 0) {
      console.log(`  ⚠️  Found ${issues.length} corrupted fields:`);
      
      // Group by section
      const bySection = {};
      issues.forEach(issue => {
        const section = issue.path.split('.')[0] || issue.path.split('[')[0];
        if (!bySection[section]) bySection[section] = [];
        bySection[section].push(issue);
      });
      
      Object.keys(bySection).forEach(section => {
        console.log(`\n  📍 ${section.toUpperCase()}:`);
        bySection[section].slice(0, 5).forEach(issue => {
          console.log(`     ${issue.path}`);
          console.log(`     Value: ${issue.value}...`);
        });
        if (bySection[section].length > 5) {
          console.log(`     ... and ${bySection[section].length - 5} more`);
        }
      });
      
      totalIssues += issues.length;
      corruptedChapters.push(chapterNum);
    } else {
      console.log('  ✅ No corruption detected');
    }
    
  } catch (error) {
    console.error(`  ❌ Error reading: ${error.message}`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`📊 Summary:`);
console.log(`   Total corrupted fields: ${totalIssues}`);
console.log(`   Corrupted chapters: ${corruptedChapters.length > 0 ? corruptedChapters.join(', ') : 'None'}`);

if (corruptedChapters.length > 0) {
  console.log(`\n⚠️  Chapters ${corruptedChapters.join(', ')} need complete reconstruction`);
  console.log('   This includes: title, vocabulary, conversations, quiz, patterns, grammar');
}
