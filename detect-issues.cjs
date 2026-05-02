const fs = require('fs');

console.log('🔍 Detecting issues in conversation data...\n');

let totalIssues = 0;

for (let chapterNum = 1; chapterNum <= 10; chapterNum++) {
  const chNum = chapterNum.toString().padStart(2, '0');
  const filePath = `data/ch${chNum}.json`;
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`\n📖 Chapter ${chapterNum}:`);
    let chapterIssues = 0;
    
    if (data.conversations && Array.isArray(data.conversations)) {
      data.conversations.forEach((conv, convIndex) => {
        if (conv.turns && Array.isArray(conv.turns)) {
          conv.turns.forEach((turn, turnIndex) => {
            const japanese = turn.japanese || '';
            const hiragana = turn.hiragana || '';
            
            // Check for corrupted characters
            const hasCorrupted = /[�\x00-\x1F\x7F-\x9F]/.test(japanese) || /[�\x00-\x1F\x7F-\x9F]/.test(hiragana);
            
            // Check for mismatched kanji/hiragana
            const japaneseHasKanji = /[\u4e00-\u9faf]/.test(japanese);
            const hiraganaHasKanji = /[\u4e00-\u9faf]/.test(hiragana);
            
            // Check for common words that should be kanji but are hiragana
            const shouldBeKanji = [
              'きます', 'いきます', 'かえります', 'きました', 'いきました', 'かえりました',
              'かきます', 'ききます', 'かきました', 'ききました',
              'ときどき', 'きれい', 'おおきい', 'ちいさい',
              'すき', 'だいすき', 'じょうず', 'へた', 'わかります',
              'ひとり', 'ふたり'
            ];
            
            let hasIssue = false;
            let issueDetails = [];
            
            if (hasCorrupted) {
              hasIssue = true;
              issueDetails.push('Corrupted characters detected');
              chapterIssues++;
            }
            
            if (hiraganaHasKanji) {
              hasIssue = true;
              issueDetails.push('Hiragana field contains kanji');
              chapterIssues++;
            }
            
            // Check for words that should be kanji
            shouldBeKanji.forEach(word => {
              if (japanese.includes(word)) {
                hasIssue = true;
                issueDetails.push(`Contains "${word}" which should be kanji`);
                chapterIssues++;
              }
            });
            
            if (hasIssue) {
              console.log(`  ⚠️  Conv ${convIndex + 1}, Turn ${turnIndex + 1} (${turn.speaker}):`);
              issueDetails.forEach(detail => console.log(`      - ${detail}`));
              console.log(`      Japanese: ${japanese}`);
              console.log(`      Hiragana: ${hiragana}`);
              totalIssues++;
            }
          });
        }
      });
    }
    
    if (chapterIssues === 0) {
      console.log('  ✅ No issues detected');
    } else {
      console.log(`  ⚠️  Found ${chapterIssues} issues`);
    }
    
  } catch (error) {
    console.error(`❌ Error reading Chapter ${chapterNum}: ${error.message}`);
  }
}

console.log(`\n📊 Total issues found: ${totalIssues}`);
console.log('\n🔧 Will create fix script to address these issues...');