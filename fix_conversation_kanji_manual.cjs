const fs = require('fs');

function fixConversationKanjiManual() {
  console.log('🔧 Starting manual conversation kanji fix for chapters 1-10...\n');
  
  let totalFixed = 0;
  
  for (let chapterNum = 1; chapterNum <= 10; chapterNum++) {
    const chNum = chapterNum.toString().padStart(2, '0');
    const filePath = `data/ch${chNum}.json`;
    
    try {
      console.log(`📖 Processing Chapter ${chapterNum}...`);
      
      // Read chapter data
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Build vocabulary mapping from chapter's vocabulary dataset
      const vocabularyMap = new Map();
      if (data.vocabulary && Array.isArray(data.vocabulary)) {
        data.vocabulary.forEach(vocab => {
          if (vocab.kanji && vocab.kana && vocab.kanji !== vocab.kana) {
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
                
                // Apply replacements from vocabulary map
                vocabularyMap.forEach((kanji, kana) => {
                  if (fixedText.includes(kana)) {
                    fixedText = fixedText.replaceAll(kana, kanji);
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
  
  console.log(`\n🎉 Manual conversation kanji fix completed!`);
  console.log(`📊 Total fixes applied: ${totalFixed}`);
}

// Run the fix
fixConversationKanjiManual();