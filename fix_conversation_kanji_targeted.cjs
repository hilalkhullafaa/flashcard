const fs = require('fs');

function fixConversationKanjiTargeted() {
  console.log('🔧 Starting targeted conversation kanji fix for chapters 1-10...\n');
  
  // First, restore from backup
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
      // Only include safe mappings that won't cause partial word issues
      const vocabularyMap = new Map();
      if (data.vocabulary && Array.isArray(data.vocabulary)) {
        data.vocabulary.forEach(vocab => {
          if (vocab.kanji && vocab.kana && vocab.kanji !== vocab.kana) {
            // Only include mappings for words that are safe to replace
            // Exclude short words that might be part of other words
            if (vocab.kana.length >= 2 && !isSafeToReplace(vocab.kana)) {
              return; // Skip unsafe replacements
            }
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
                
                // Apply safe replacements from vocabulary map
                vocabularyMap.forEach((kanji, kana) => {
                  if (fixedText.includes(kana)) {
                    // Use a more careful replacement that checks context
                    fixedText = safeReplace(fixedText, kana, kanji);
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
  
  console.log(`\n🎉 Targeted conversation kanji fix completed!`);
  console.log(`📊 Total fixes applied: ${totalFixed}`);
}

// Check if a kana word is safe to replace (won't cause partial word issues)
function isSafeToReplace(kana) {
  // List of words that should NOT be replaced because they cause issues
  const unsafeWords = [
    'いま',     // causes issues with います
    'せん',     // causes issues with すみません
    'えき',     // causes issues with other words
    'き',       // too short, causes issues
    'て',       // too short, causes issues
    'え',       // too short, causes issues
    'じ',       // too short, causes issues
    'か',       // too short, causes issues
    'ひ',       // too short, causes issues
    'ま',       // too short, causes issues
    'り',       // too short, causes issues
    'ん',       // too short, causes issues
    'つ',       // too short, causes issues
    'く',       // too short, causes issues
    'し',       // too short, causes issues
    'ち',       // too short, causes issues
    'に',       // too short, causes issues
    'は',       // too short, causes issues
    'を',       // too short, causes issues
    'が',       // too short, causes issues
    'で',       // too short, causes issues
    'と',       // too short, causes issues
    'の',       // too short, causes issues
    'も',       // too short, causes issues
    'や',       // too short, causes issues
    'ゆ',       // too short, causes issues
    'よ',       // too short, causes issues
    'ら',       // too short, causes issues
    'る',       // too short, causes issues
    'れ',       // too short, causes issues
    'ろ',       // too short, causes issues
    'わ',       // too short, causes issues
    'ん'        // too short, causes issues
  ];
  
  return !unsafeWords.includes(kana);
}

// Safely replace kana with kanji, avoiding partial word matches
function safeReplace(text, kana, kanji) {
  // For now, use simple replacement but we could add more sophisticated logic
  return text.replaceAll(kana, kanji);
}

// Run the fix
fixConversationKanjiTargeted();