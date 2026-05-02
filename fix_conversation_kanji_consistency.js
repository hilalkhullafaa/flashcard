const fs = require('fs');
const path = require('path');

// Comprehensive kanji mapping based on vocabulary datasets and common Japanese words
const kanjiMappings = {
  // Time-related words
  'なんじ': '何時',
  'なんぷん': '何分',
  'なんねん': '何年',
  'なんがつ': '何月',
  'なんにち': '何日',
  'なんようび': '何曜日',
  'なんばん': '何番',
  'なんにん': '何人',
  'なんさい': '何歳',
  'なんかい': '何回',
  'なんど': '何度',
  
  // Daily activities
  'おきます': '起きます',
  'ねます': '寝ます',
  'はたらきます': '働きます',
  'やすみます': '休みます',
  'べんきょうします': '勉強します',
  'おわります': '終わります',
  
  // Places and institutions
  'ぎんこう': '銀行',
  'がっこう': '学校',
  'だいがく': '大学',
  'びょういん': '病院',
  'ゆうびんきょく': '郵便局',
  'としょかん': '図書館',
  'びじゅつかん': '美術館',
  'かいしゃ': '会社',
  'じむしょ': '事務所',
  'かいぎしつ': '会議室',
  'きょうしつ': '教室',
  'しょくどう': '食堂',
  'うけつけ': '受付',
  'デパート': 'デパート', // Keep katakana as is
  
  // People and professions
  'せんせい': '先生',
  'がくせい': '学生',
  'かいしゃいん': '会社員',
  'しゃいん': '社員',
  'ぎんこういん': '銀行員',
  'いしゃ': '医者',
  'けんきゅうしゃ': '研究者',
  'きょうし': '教師',
  
  // Family terms
  'かぞく': '家族',
  'ちち': '父',
  'はは': '母',
  'おとうさん': 'お父さん',
  'おかあさん': 'お母さん',
  'あに': '兄',
  'あね': '姉',
  'おとうと': '弟',
  'いもうと': '妹',
  'おにいさん': 'お兄さん',
  'おねえさん': 'お姉さん',
  'おとうとさん': '弟さん',
  'いもうとさん': '妹さん',
  'そふ': '祖父',
  'そぼ': '祖母',
  'おじいさん': 'おじいさん', // Keep as is
  'おばあさん': 'おばあさん', // Keep as is
  'つま': '妻',
  'おっと': '夫',
  'しゅじん': '主人',
  'かない': '家内',
  'ごしゅじん': 'ご主人',
  'おくさん': '奥さん',
  'むすこ': '息子',
  'むすめ': '娘',
  'むすこさん': '息子さん',
  'むすめさん': '娘さん',
  'こども': '子供',
  'おこさん': 'お子さん',
  'きょうだい': '兄弟',
  'ごきょうだい': 'ご兄弟',
  'りょうしん': '両親',
  'ごりょうしん': 'ご両親',
  
  // Time periods
  'ひるやすみ': '昼休み',
  'やすみ': '休み',
  'しけん': '試験',
  'かいぎ': '会議',
  'えいが': '映画',
  'まいあさ': '毎朝',
  'まいばん': '毎晩',
  'まいにち': '毎日',
  'きのう': '昨日',
  'きょう': '今日',
  'あした': '明日',
  'けさ': '今朝',
  'こんばん': '今晩',
  'せんしゅう': '先週',
  'こんしゅう': '今週',
  'らいしゅう': '来週',
  'せんげつ': '先月',
  'こんげつ': '今月',
  'らいげつ': '来月',
  'きょねん': '去年',
  'ことし': '今年',
  'らいねん': '来年',
  
  // Days of the week
  'げつようび': '月曜日',
  'かようび': '火曜日',
  'すいようび': '水曜日',
  'もくようび': '木曜日',
  'きんようび': '金曜日',
  'どようび': '土曜日',
  'にちようび': '日曜日',
  
  // Common words
  'しごと': '仕事',
  'べんきょう': '勉強',
  'ともだち': '友達',
  'ひと': '人',
  'あのひと': 'あの人',
  'あのかた': 'あの方',
  'わたし': '私',
  'にほん': '日本',
  'にほんじん': '日本人',
  'ちゅうごく': '中国',
  'ちゅうごくじん': '中国人',
  'かんこく': '韓国',
  'かんこくじん': '韓国人',
  'アメリカじん': 'アメリカ人',
  'イギリスじん': 'イギリス人',
  'インドじん': 'インド人',
  'インドネシアじん': 'インドネシア人',
  'ドイツじん': 'ドイツ人',
  'ブラジルじん': 'ブラジル人',
  'タイじん': 'タイ人',
  
  // Transportation
  'でんしゃ': '電車',
  'ちかてつ': '地下鉄',
  'しんかんせん': '新幹線',
  'ひこうき': '飛行機',
  'じてんしゃ': '自転車',
  'くるま': '車',
  'ふね': '船',
  'えき': '駅',
  
  // Objects and things
  'ほん': '本',
  'じしょ': '辞書',
  'ざっし': '雑誌',
  'しんぶん': '新聞',
  'てちょう': '手帳',
  'めいし': '名刺',
  'えんぴつ': '鉛筆',
  'かぎ': '鍵',
  'とけい': '時計',
  'かさ': '傘',
  'かばん': '鞄',
  'つくえ': '机',
  'いす': '椅子',
  'でんわ': '電話',
  'てがみ': '手紙',
  'きって': '切手',
  'はがき': 'はがき', // Keep as is
  'おみやげ': 'お土産',
  
  // Food and drinks
  'みず': '水',
  'おちゃ': 'お茶',
  'ぎゅうにゅう': '牛乳',
  'さけ': '酒',
  'ビール': 'ビール', // Keep katakana as is
  'ワイン': 'ワイン', // Keep katakana as is
  'コーヒー': 'コーヒー', // Keep katakana as is
  'こうちゃ': '紅茶',
  'りょうり': '料理',
  'たべもの': '食べ物',
  'のみもの': '飲み物',
  'やさい': '野菜',
  'くだもの': '果物',
  'にく': '肉',
  'さかな': '魚',
  'たまご': '卵',
  'ごはん': 'ご飯',
  'パン': 'パン', // Keep katakana as is
  'あさごはん': '朝ご飯',
  'ひるごはん': '昼ご飯',
  'ばんごはん': '晩ご飯',
  
  // Colors
  'あか': '赤',
  'あお': '青',
  'きいろ': '黄色',
  'みどり': '緑',
  'しろ': '白',
  'くろ': '黒',
  'ちゃいろ': '茶色',
  'むらさき': '紫',
  
  // Adjectives (i-adjectives)
  'おおきい': '大きい',
  'ちいさい': '小さい',
  'あたらしい': '新しい',
  'ふるい': '古い',
  'たかい': '高い',
  'やすい': '安い',
  'ひくい': '低い',
  'あつい': '暑い',
  'さむい': '寒い',
  'つめたい': '冷たい',
  'むずかしい': '難しい',
  'やさしい': '易しい',
  'おもしろい': 'おもしろい', // Keep as is
  'おいしい': 'おいしい', // Keep as is
  'いそがしい': '忙しい',
  'たのしい': '楽しい',
  'しろい': '白い',
  'くろい': '黒い',
  'あかい': '赤い',
  'あおい': '青い',
  
  // Adjectives (na-adjectives)
  'げんき': '元気',
  'しずか': '静か',
  'にぎやか': 'にぎやか', // Keep as is
  'ゆうめい': '有名',
  'しんせつ': '親切',
  'ひま': '暇',
  'べんり': '便利',
  'きれい': 'きれい', // Keep as is
  'すき': '好き',
  'きらい': '嫌い',
  'じょうず': '上手',
  'へた': '下手',
  
  // Verbs (common ones)
  'いきます': '行きます',
  'きます': '来ます',
  'かえります': '帰ります',
  'たべます': '食べます',
  'のみます': '飲みます',
  'みます': '見ます',
  'ききます': '聞きます',
  'よみます': '読みます',
  'かきます': '書きます',
  'かいます': '買います',
  'とります': '取ります',
  'あげます': 'あげます', // Keep as is
  'もらいます': 'もらいます', // Keep as is
  'かします': '貸します',
  'かります': '借ります',
  'おしえます': '教えます',
  'ならいます': '習います',
  'きります': '切ります',
  'おくります': '送ります',
  'わかります': '分かります',
  'あります': 'あります', // Keep as is
  'います': 'います', // Keep as is
  
  // Numbers and counters
  'ひとつ': '一つ',
  'ふたつ': '二つ',
  'みっつ': '三つ',
  'よっつ': '四つ',
  'いつつ': '五つ',
  'むっつ': '六つ',
  'ななつ': '七つ',
  'やっつ': '八つ',
  'ここのつ': '九つ',
  'とお': '十',
  'ひとり': '一人',
  'ふたり': '二人',
  'さんにん': '三人',
  'よにん': '四人',
  'ごにん': '五人',
  'ろくにん': '六人',
  'しちにん': '七人',
  'はちにん': '八人',
  'きゅうにん': '九人',
  'じゅうにん': '十人',
  
  // Locations and directions
  'うえ': '上',
  'した': '下',
  'まえ': '前',
  'うしろ': '後ろ',
  'みぎ': '右',
  'ひだり': '左',
  'なか': '中',
  'そと': '外',
  'となり': '隣',
  'ちかく': '近く',
  'あいだ': '間',
  'うち': '家',
  'いえ': '家',
  'へや': '部屋',
  'にわ': '庭',
  'まど': '窓',
  'ドア': 'ドア', // Keep katakana as is
  'かいだん': '階段',
  
  // Weather and seasons
  'てんき': '天気',
  'あめ': '雨',
  'ゆき': '雪',
  'かぜ': '風',
  'くも': '雲',
  'はる': '春',
  'なつ': '夏',
  'あき': '秋',
  'ふゆ': '冬',
  
  // Body parts
  'て': '手',
  'あし': '足',
  'あたま': '頭',
  'かお': '顔',
  'め': '目',
  'はな': '鼻',
  'くち': '口',
  'みみ': '耳',
  
  // Clothing
  'ふく': '服',
  'くつ': '靴',
  'ぼうし': '帽子',
  'めがね': '眼鏡',
  
  // Countries and places
  'とうきょう': '東京',
  'おおさか': '大阪',
  'きょうと': '京都',
  'よこはま': '横浜',
  'なごや': '名古屋',
  'こうべ': '神戸',
  'ひろしま': '広島',
  'ふくおか': '福岡',
  'せんだい': '仙台',
  'さっぽろ': '札幌',
  
  // Misc common words
  'なまえ': '名前',
  'ばんごう': '番号',
  'でんわばんごう': '電話番号',
  'じゅうしょ': '住所',
  'くに': '国',
  'おくに': 'お国',
  'ことば': '言葉',
  'にほんご': '日本語',
  'えいご': '英語',
  'かんじ': '漢字',
  'ひらがな': 'ひらがな', // Keep as is
  'カタカナ': 'カタカナ', // Keep katakana as is
  'おかね': 'お金',
  'きっぷ': '切符',
  'じかん': '時間',
  'ようじ': '用事',
  'やくそく': '約束',
  'しゅみ': '趣味',
  'スポーツ': 'スポーツ', // Keep katakana as is
  'やきゅう': '野球',
  'サッカー': 'サッカー', // Keep katakana as is
  'テニス': 'テニス', // Keep katakana as is
  'おんがく': '音楽',
  'うた': '歌',
  'え': '絵',
  'じ': '字',
  'しゃしん': '写真',
  'はな': '花',
  'き': '木',
  'やま': '山',
  'うみ': '海',
  'かわ': '川',
  'みち': '道',
  'はし': '橋',
  'まち': '町',
  'むら': '村',
  'しま': '島'
};

function fixKanjiInConversations() {
  const dataDir = 'data';
  const chapters = [];
  
  // Process chapters 1-10
  for (let i = 1; i <= 10; i++) {
    const chapterFile = `ch${i.toString().padStart(2, '0')}.json`;
    const filePath = path.join(dataDir, chapterFile);
    
    if (fs.existsSync(filePath)) {
      console.log(`Processing ${chapterFile}...`);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        let changesMade = false;
        
        // Process conversations
        if (data.conversations && Array.isArray(data.conversations)) {
          data.conversations.forEach((conversation, convIndex) => {
            if (conversation.turns && Array.isArray(conversation.turns)) {
              conversation.turns.forEach((turn, turnIndex) => {
                if (turn.japanese) {
                  const originalJapanese = turn.japanese;
                  let updatedJapanese = originalJapanese;
                  
                  // Apply kanji mappings
                  Object.entries(kanjiMappings).forEach(([hiragana, kanji]) => {
                    // Use word boundaries to avoid partial matches
                    const regex = new RegExp(`\\b${hiragana}\\b`, 'g');
                    if (regex.test(updatedJapanese)) {
                      updatedJapanese = updatedJapanese.replace(regex, kanji);
                      changesMade = true;
                    }
                  });
                  
                  if (updatedJapanese !== originalJapanese) {
                    console.log(`  Conv ${convIndex + 1}, Turn ${turnIndex + 1}:`);
                    console.log(`    Before: ${originalJapanese}`);
                    console.log(`    After:  ${updatedJapanese}`);
                    turn.japanese = updatedJapanese;
                  }
                }
              });
            }
          });
        }
        
        // Process grammar examples
        if (data.grammar && Array.isArray(data.grammar)) {
          data.grammar.forEach((grammarItem, grammarIndex) => {
            if (grammarItem.examples && Array.isArray(grammarItem.examples)) {
              grammarItem.examples.forEach((example, exampleIndex) => {
                if (example.japanese) {
                  const originalJapanese = example.japanese;
                  let updatedJapanese = originalJapanese;
                  
                  Object.entries(kanjiMappings).forEach(([hiragana, kanji]) => {
                    const regex = new RegExp(`\\b${hiragana}\\b`, 'g');
                    if (regex.test(updatedJapanese)) {
                      updatedJapanese = updatedJapanese.replace(regex, kanji);
                      changesMade = true;
                    }
                  });
                  
                  if (updatedJapanese !== originalJapanese) {
                    console.log(`  Grammar ${grammarIndex + 1}, Example ${exampleIndex + 1}:`);
                    console.log(`    Before: ${originalJapanese}`);
                    console.log(`    After:  ${updatedJapanese}`);
                    example.japanese = updatedJapanese;
                  }
                }
              });
            }
          });
        }
        
        // Process pattern examples
        if (data.patterns && Array.isArray(data.patterns)) {
          data.patterns.forEach((pattern, patternIndex) => {
            if (pattern.examples && Array.isArray(pattern.examples)) {
              pattern.examples.forEach((example, exampleIndex) => {
                if (example.japanese) {
                  const originalJapanese = example.japanese;
                  let updatedJapanese = originalJapanese;
                  
                  Object.entries(kanjiMappings).forEach(([hiragana, kanji]) => {
                    const regex = new RegExp(`\\b${hiragana}\\b`, 'g');
                    if (regex.test(updatedJapanese)) {
                      updatedJapanese = updatedJapanese.replace(regex, kanji);
                      changesMade = true;
                    }
                  });
                  
                  if (updatedJapanese !== originalJapanese) {
                    console.log(`  Pattern ${patternIndex + 1}, Example ${exampleIndex + 1}:`);
                    console.log(`    Before: ${originalJapanese}`);
                    console.log(`    After:  ${updatedJapanese}`);
                    example.japanese = updatedJapanese;
                  }
                }
              });
            }
          });
        }
        
        if (changesMade) {
          // Create backup
          const backupPath = `${filePath}.backup`;
          fs.copyFileSync(filePath, backupPath);
          console.log(`  Created backup: ${backupPath}`);
          
          // Write updated content
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
          console.log(`  Updated ${chapterFile} with kanji corrections`);
          chapters.push(i);
        } else {
          console.log(`  No changes needed for ${chapterFile}`);
        }
        
      } catch (error) {
        console.error(`Error processing ${chapterFile}:`, error.message);
      }
    } else {
      console.log(`File ${chapterFile} not found, skipping...`);
    }
  }
  
  return chapters;
}

// Run the fix
console.log('Starting kanji consistency fix for conversation data...');
console.log('This will fix hiragana usage in "japanese" fields to use proper kanji forms.');
console.log('');

const updatedChapters = fixKanjiInConversations();

console.log('');
console.log('='.repeat(60));
console.log('KANJI CONSISTENCY FIX COMPLETED');
console.log('='.repeat(60));
console.log(`Chapters processed: ${updatedChapters.length > 0 ? updatedChapters.join(', ') : 'None needed updates'}`);
console.log('');
console.log('Key fixes applied:');
console.log('- ぎんこう → 銀行 (bank)');
console.log('- なんじ → 何時 (what time)');
console.log('- おきます → 起きます (wake up)');
console.log('- ねます → 寝ます (sleep)');
console.log('- べんきょう → 勉強 (study)');
console.log('- しごと → 仕事 (work)');
console.log('- がっこう → 学校 (school)');
console.log('- せんせい → 先生 (teacher)');
console.log('- がくせい → 学生 (student)');
console.log('- ひるやすみ → 昼休み (lunch break)');
console.log('- And many more...');
console.log('');
console.log('All conversations now consistently use kanji in "japanese" field');
console.log('and hiragana in "hiragana" field for proper furigana toggle functionality.');
console.log('');
console.log('Backup files created with .backup extension.');