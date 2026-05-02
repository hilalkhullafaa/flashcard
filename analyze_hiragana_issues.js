const fs = require('fs');

// Common words that should have kanji
const kanjiWords = {
  'ぎんこう': '銀行',
  'がっこう': '学校', 
  'びょういん': '病院',
  'としょかん': '図書館',
  'なんじ': '何時',
  'まいにち': '毎日',
  'べんきょう': '勉強',
  'しごと': '仕事',
  'せんせい': '先生',
  'がくせい': '学生',
  'わたし': '私',
  'きょう': '今日',
  'あした': '明日',
  'きのう': '昨日',
  'いま': '今',
  'じかん': '時間',
  'ひと': '人',
  'にほん': '日本',
  'かいしゃ': '会社',
  'でんわ': '電話',
  'しんぶん': '新聞',
  'ほん': '本',
  'くるま': '車',
  'でんしゃ': '電車',
  'ひこうき': '飛行機',
  'やすみ': '休み',
  'しけん': '試験',
  'かいぎ': '会議',
  'えいが': '映画'
};

for (let i = 1; i <= 10; i++) {
  const chNum = i.toString().padStart(2, '0');
  const filePath = `data/ch${chNum}.json`;
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const conversations = data.conversations || [];
    
    let hasHiraganaIssues = false;
    let issueCount = 0;
    
    conversations.forEach((conv, convIndex) => {
      if (conv.turns) {
        conv.turns.forEach((turn, turnIndex) => {
          if (turn.japanese) {
            // Check if japanese field contains hiragana that should be kanji
            for (const [hiragana, kanji] of Object.entries(kanjiWords)) {
              if (turn.japanese.includes(hiragana)) {
                hasHiraganaIssues = true;
                issueCount++;
                console.log(`Chapter ${i}: Conv ${convIndex + 1}, Turn ${turnIndex + 1}: '${hiragana}' should be '${kanji}'`);
                console.log(`  Text: ${turn.japanese}`);
              }
            }
          }
        });
      }
    });
    
    if (hasHiraganaIssues) {
      console.log(`\n*** Chapter ${i} has ${issueCount} hiragana issues that need kanji replacement ***\n`);
    } else {
      console.log(`Chapter ${i}: OK - no obvious hiragana-only issues found`);
    }
    
  } catch (error) {
    console.log(`Chapter ${i}: ERROR - ${error.message}`);
  }
}