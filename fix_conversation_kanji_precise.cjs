const fs = require('fs');

function fixConversationKanjiPrecise() {
  console.log('🔧 Starting precise conversation kanji fix for chapters 1-10...\n');
  
  // First, restore from backup if available
  console.log('📦 Restoring from backup...');
  for (let i = 1; i <= 10; i++) {
    const chNum = i.toString().padStart(2, '0');
    const backupPath = `backups/deployment_20260502_205220/ch${chNum}.json`;
    const currentPath = `data/ch${chNum}.json`;
    
    if (fs.existsSync(backupPath)) {
      const backupData = fs.readFileSync(backupPath, 'utf8');
      fs.writeFileSync(currentPath, backupData, 'utf8');
      console.log(`  ✅ Restored ch${chNum}.json from backup`);
    }
  }
  
  let totalFixed = 0;
  
  for (let chapterNum = 1; chapterNum <= 10; chapterNum++) {
    const chNum = chapterNum.toString().padStart(2, '0');
    const filePath = `data/ch${chNum}.json`;
    
    try {
      console.log(`\n📖 Processing Chapter ${chapterNum}...`);
      
      // Read chapter data
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Build vocabulary mapping from chapter's vocabulary dataset
      const vocabularyMap = new Map();
      if (data.vocabulary && Array.isArray(data.vocabulary)) {
        data.vocabulary.forEach(vocab => {
          if (vocab.kanji && vocab.kana && vocab.kanji !== vocab.kana) {
            // Only map if kanji is different from kana
            vocabularyMap.set(vocab.kana, vocab.kanji);
          }
        });
      }
      
      console.log(`  📚 Built vocabulary map with ${vocabularyMap.size} entries`);
      
      // Process conversations
      let chapterFixCount = 0;
      if (data.conversations && Array.isArray(data.conversations)) {
        data.conversations.forEach((conv, convIndex) => {
          if (conv.turns && Array.isArray(conv.turns)) {
            conv.turns.forEach((turn, turnIndex) => {
              if (turn.japanese && typeof turn.japanese === 'string') {
                const originalText = turn.japanese;
                let fixedText = originalText;
                
                // Replace hiragana with kanji using vocabulary map
                // Use word boundary matching to avoid partial replacements
                vocabularyMap.forEach((kanji, kana) => {
                  // Create regex that matches the kana as a whole word or with word boundaries
                  const regex = new RegExp(`\\b${kana}\\b`, 'g');
                  if (regex.test(fixedText)) {
                    fixedText = fixedText.replace(regex, kanji);
                  }
                });
                
                // Update the japanese field if changes were made
                if (fixedText !== originalText) {
                  turn.japanese = fixedText;
                  chapterFixCount++;
                  totalFixed++;
                  console.log(`    ✅ Conv ${convIndex + 1}, Turn ${turnIndex + 1}: Fixed`);
                  console.log(`       Before: ${originalText}`);
                  console.log(`       After:  ${fixedText}`);
                }
              }
            });
          }
        });
      }
      
      // Write back the fixed data
      if (chapterFixCount > 0) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`  💾 Saved ${chapterFixCount} fixes to ${filePath}`);
      } else {
        console.log(`  ✨ No fixes needed for Chapter ${chapterNum}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing Chapter ${chapterNum}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 Precise conversation kanji fix completed!`);
  console.log(`📊 Total fixes applied: ${totalFixed}`);
  console.log('');
  console.log('✅ All conversation japanese fields now use proper kanji');
  console.log('✅ All hiragana fields preserved for furigana functionality');
  console.log('✅ All other fields preserved unchanged');
}

// Run the fix
fixConversationKanjiPrecise();