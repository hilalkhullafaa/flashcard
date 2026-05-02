const fs = require('fs');
const path = require('path');

/**
 * Fix specific kanji consistency issues in conversations
 * This script targets the exact issues mentioned in the task
 */

// Specific kanji fixes based on the task requirements
const specificFixes = {
  // Incorrect kanji usage that needs to be fixed
  '起来ます': '起きます',
  '起来る': '起きる',
  '起来': '起き',
  
  // Common words that should use kanji (from vocabulary dataset)
  'ぎんこう': '銀行',
  'なんじ': '何時',
  'ひるやすみ': '昼休み',
  'しごと': '仕事',
  'べんきょう': '勉強',
  'べんきょうします': '勉強します',
  'おきます': '起きます',
  
  // Time-related
  'まいにち': '毎日',
  'まいあさ': '毎朝',
  'まいばん': '毎晩',
  'ごぜん': '午前',
  'ごご': '午後',
  
  // Days of the week
  'げつようび': '月曜日',
  'かようび': '火曜日',
  'すいようび': '水曜日',
  'もくようび': '木曜日',
  'きんようび': '金曜日',
  'どようび': '土曜日',
  'にちようび': '日曜日',
  'なんようび': '何曜日',
  
  // Common verbs
  'やすみます': '休みます',
  'やすみ': '休み',
  'おわります': '終わります',
  'はじまります': '始まります',
  'みます': '見ます',
  'ききます': '聞きます',
  'よみます': '読みます',
  'かきます': '書きます',
  'たべます': '食べます',
  'のみます': '飲みます',
  
  // Common nouns
  'がっこう': '学校',
  'かいしゃ': '会社',
  'びょういん': '病院',
  'としょかん': '図書館',
  'せんせい': '先生',
  'がくせい': '学生',
  'けんきゅうしゃ': '研究者',
  'いしゃ': '医者',
  
  // Question words
  'だれ': '誰',
  'なに': '何',
  'なん': '何',
  
  // Countries and people
  'にほん': '日本',
  'にほんじん': '日本人',
  'ちゅうごく': '中国',
  'ちゅうごくじん': '中国人',
  'かんこく': '韓国',
  'かんこくじん': '韓国人',
  
  // Common expressions
  'わたし': '私',
  'あのひと': 'あの人',
  'あのかた': 'あの方',
  
  // Time expressions
  'きょう': '今日',
  'きのう': '昨日',
  'あした': '明日',
  
  // Family
  'おとうさん': 'お父さん',
  'おかあさん': 'お母さん',
  
  // Transportation
  'でんしゃ': '電車',
  'ひこうき': '飛行機',
  'じてんしゃ': '自転車',
  'くるま': '車',
  
  // Places
  'いえ': '家',
  'へや': '部屋',
  'えき': '駅',
  
  // Activities
  'しけん': '試験',
  'かいぎ': '会議',
  'りょこう': '旅行',
  'りょうり': '料理',
  
  // Numbers
  'ひとり': '一人',
  'ふたり': '二人',
  'ひゃく': '百',
  'せん': '千',
  'まん': '万',
  'えん': '円'
};

/**
 * Apply specific kanji fixes to Japanese text
 * @param {string} text - The Japanese text to process
 * @returns {string} - Text with specific kanji fixes applied
 */
function applySpecificFixes(text) {
  let result = text;
  
  // Sort fixes by length (longest first) to avoid partial replacements
  const sortedFixes = Object.entries(specificFixes).sort((a, b) => b[0].length - a[0].length);
  
  for (const [hiragana, kanji] of sortedFixes) {
    // Use global replacement for exact matches
    const regex = new RegExp(hiragana.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, kanji);
  }
  
  return result;
}

/**
 * Process a single chapter file
 * @param {number} chapterNum - Chapter number (1-10)
 */
function processChapter(chapterNum) {
  const filePath = path.join(__dirname, 'data', `ch${chapterNum.toString().padStart(2, '0')}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  console.log(`Processing chapter ${chapterNum}...`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.conversations || !Array.isArray(data.conversations)) {
      console.log(`No conversations found in chapter ${chapterNum}`);
      return;
    }
    
    let changesCount = 0;
    
    // Process each conversation
    data.conversations.forEach((conversation, convIndex) => {
      if (!conversation.turns || !Array.isArray(conversation.turns)) {
        return;
      }
      
      // Process each turn in the conversation
      conversation.turns.forEach((turn, turnIndex) => {
        if (turn.japanese && typeof turn.japanese === 'string') {
          const originalText = turn.japanese;
          const updatedText = applySpecificFixes(originalText);
          
          if (originalText !== updatedText) {
            console.log(`  Conv ${convIndex + 1}, Turn ${turnIndex + 1}:`);
            console.log(`    Before: ${originalText}`);
            console.log(`    After:  ${updatedText}`);
            turn.japanese = updatedText;
            changesCount++;
          }
        }
      });
    });
    
    if (changesCount > 0) {
      // Create backup
      const backupPath = `${filePath}.backup-targeted-${Date.now()}`;
      fs.writeFileSync(backupPath, fs.readFileSync(filePath));
      console.log(`  Created backup: ${backupPath}`);
      
      // Write updated file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`  Applied ${changesCount} targeted kanji fixes to chapter ${chapterNum}`);
    } else {
      console.log(`  No changes needed for chapter ${chapterNum}`);
    }
    
  } catch (error) {
    console.error(`Error processing chapter ${chapterNum}:`, error.message);
  }
}

/**
 * Main function to process all chapters 1-10
 */
function main() {
  console.log('Starting targeted kanji consistency fix for chapters 1-10...\n');
  
  for (let i = 1; i <= 10; i++) {
    processChapter(i);
  }
  
  console.log('\nTargeted kanji consistency fix completed!');
  console.log('\nSummary:');
  console.log('- Fixed specific kanji usage issues in conversations');
  console.log('- Corrected 起来ます → 起きます and similar issues');
  console.log('- Applied kanji forms from vocabulary dataset');
  console.log('- Hiragana field remains unchanged');
  console.log('- Backups created for all modified files');
  console.log('\nNote: Vocabulary datasets were NOT modified (read-only)');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { applySpecificFixes, processChapter };