const fs = require('fs');
const path = require('path');

console.log('=== RESTORING FROM DEPLOYMENT BACKUP ===\n');
console.log('Source: backups/deployment_20260502_205220/\n');

const restorations = [
  { chapter: 6, source: 'backups/deployment_20260502_205220/ch06.json', target: 'data/ch06.json' },
  { chapter: 8, source: 'backups/deployment_20260502_205220/ch08.json', target: 'data/ch08.json' },
  { chapter: 10, source: 'backups/deployment_20260502_205220/ch10.json', target: 'data/ch10.json' }
];

let successCount = 0;
let errorCount = 0;

for (const restore of restorations) {
  try {
    console.log(`\n--- Chapter ${restore.chapter} ---`);
    
    // Check if source exists
    if (!fs.existsSync(restore.source)) {
      console.error(`❌ Source file not found: ${restore.source}`);
      errorCount++;
      continue;
    }
    
    // Read source
    console.log(`Reading: ${restore.source}`);
    const sourceContent = fs.readFileSync(restore.source, 'utf8');
    
    // Validate JSON
    let data;
    try {
      data = JSON.parse(sourceContent);
    } catch (parseError) {
      console.error(`❌ Source file is not valid JSON: ${parseError.message}`);
      errorCount++;
      continue;
    }
    
    // Verify structure
    if (!data.chapter || !data.vocabulary || !data.conversations) {
      console.error(`❌ Source file missing required structure`);
      errorCount++;
      continue;
    }
    
    console.log(`✓ Source validated:`);
    console.log(`  - Chapter ID: ${data.chapter.id}`);
    console.log(`  - Title: ${data.chapter.title}`);
    console.log(`  - Vocabulary: ${data.vocabulary.length} items`);
    console.log(`  - Conversations: ${data.conversations.length} items`);
    console.log(`  - Patterns: ${data.patterns ? data.patterns.length : 0} items`);
    console.log(`  - Grammar: ${data.grammar ? data.grammar.length : 0} items`);
    console.log(`  - Quiz: ${data.quiz ? data.quiz.length : 0} items`);
    
    // Write to target
    console.log(`Writing to: ${restore.target}`);
    fs.writeFileSync(restore.target, JSON.stringify(data, null, 2), 'utf8');
    
    // Verify written file
    const verifyContent = fs.readFileSync(restore.target, 'utf8');
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
  console.log(`\n🎉 All chapters restored from deployment backup!`);
  console.log(`\nNext step: Run corruption detection to verify`);
} else {
  console.log(`\n⚠️  Some chapters failed to restore. Please check errors above.`);
}
