const fs = require('fs');
const path = require('path');

console.log('=== FINAL RESTORATION: Chapters 6, 8, 10 ===\n');

const restorations = [
  {
    chapter: 6,
    backupFile: 'data/ch06.json.backup-1777738117582',
    targetFile: 'data/ch06.json'
  },
  {
    chapter: 8,
    backupFile: 'data/ch08.json.backup-1777738117944',
    targetFile: 'data/ch08.json'
  },
  {
    chapter: 10,
    backupFile: 'data/ch10.json.backup-1777738118313',
    targetFile: 'data/ch10.json'
  }
];

let successCount = 0;
let errorCount = 0;

for (const restore of restorations) {
  try {
    console.log(`\n--- Chapter ${restore.chapter} ---`);
    
    // Check if backup exists
    if (!fs.existsSync(restore.backupFile)) {
      console.error(`❌ Backup file not found: ${restore.backupFile}`);
      errorCount++;
      continue;
    }
    
    // Read backup
    console.log(`Reading backup: ${restore.backupFile}`);
    const backupContent = fs.readFileSync(restore.backupFile, 'utf8');
    
    // Validate JSON
    let data;
    try {
      data = JSON.parse(backupContent);
    } catch (parseError) {
      console.error(`❌ Backup file is not valid JSON: ${parseError.message}`);
      errorCount++;
      continue;
    }
    
    // Verify structure
    if (!data.chapter || !data.vocabulary || !data.conversations) {
      console.error(`❌ Backup file missing required structure`);
      errorCount++;
      continue;
    }
    
    console.log(`✓ Backup validated:`);
    console.log(`  - Chapter ID: ${data.chapter.id}`);
    console.log(`  - Vocabulary: ${data.vocabulary.length} items`);
    console.log(`  - Conversations: ${data.conversations.length} items`);
    console.log(`  - Patterns: ${data.patterns ? data.patterns.length : 0} items`);
    console.log(`  - Grammar: ${data.grammar ? data.grammar.length : 0} items`);
    console.log(`  - Quiz: ${data.quiz ? data.quiz.length : 0} items`);
    
    // Write to target
    console.log(`Writing to: ${restore.targetFile}`);
    fs.writeFileSync(restore.targetFile, JSON.stringify(data, null, 2), 'utf8');
    
    // Verify written file
    const verifyContent = fs.readFileSync(restore.targetFile, 'utf8');
    const verifyData = JSON.parse(verifyContent);
    
    if (verifyData.chapter.id === restore.chapter) {
      console.log(`✅ Chapter ${restore.chapter} restored successfully!`);
      successCount++;
    } else {
      console.error(`❌ Verification failed for Chapter ${restore.chapter}`);
      errorCount++;
    }
    
  } catch (error) {
    console.error(`❌ Error restoring Chapter ${restore.chapter}: ${error.message}`);
    errorCount++;
  }
}

console.log(`\n=== RESTORATION SUMMARY ===`);
console.log(`✅ Successful: ${successCount}/3`);
console.log(`❌ Failed: ${errorCount}/3`);

if (successCount === 3) {
  console.log(`\n🎉 All chapters restored successfully!`);
  console.log(`\nNext steps:`);
  console.log(`1. Verify data renders correctly in the application`);
  console.log(`2. Test vocabulary, conversations, patterns, grammar, and quiz`);
  console.log(`3. Run corruption detection to confirm all clean`);
} else {
  console.log(`\n⚠️  Some chapters failed to restore. Please check errors above.`);
}
