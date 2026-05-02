const fs = require('fs');

// Mapping of corrupted characters to correct Japanese characters
const encodingFixes = {
  // Common corrupted patterns
  '�??': 'さ',
  '�?�': 'ま',
  '�?べ': 'た',
  '�?き': 'い',
  '�?�?': 'す',
  '�??�': 'ん',
  '�?つ': 'い',
  '�?�': 'の',
  '�??': 'ん',
  '�?�': 'し',
  '�?�': 'り',
  '�?�': 'く',
  '�?�': 'み',
  '�?�': 'に',
  '�?�': 'か',
  '�?�': 'て',
  '�?�': 'で',
  '�?�': 'は',
  '�?�': 'を',
  '�?�': 'が',
  '�?�': 'と',
  '�?�': 'も',
  '�?�': 'よ',
  '�?�': 'ら',
  '�?�': 'わ',
  '�?�': 'な',
  '�?�': 'こ',
  '�?�': 'そ',
  '�?�': 'ほ',
  '�?�': 'ち',
  '�?�': 'つ',
  '�?�': 'ね',
  '�?�': 'ひ',
  '�?�': 'ふ',
  '�?�': 'へ',
  '�?�': 'ほ',
  '�?�': 'む',
  '�?�': 'ゆ',
  '�?�': 'ろ',
  '�?�': 'ん',
  
  // Specific patterns found in the files
  '�??まだ': 'やまだ',
  'ãƒŸãƒ©ãƒ¼': 'ミラー',
  'ã‚«ãƒªãƒŠ': 'カリナ',
  '�?�便�?': '郵便局',
  '�?�?�': 'まい',
  '�??�?��?��?�??': 'ミラーさん',
  '�?�??�?�??�?び': 'たんじょうび',
  '�?�??�?�': 'たん',
  '�??�?��??�?�??': 'カリナさん',
  '�??�?��?��?�??は': 'ミラーさんは',
  '�?�?�': 'まい',
  '�?べま�?': 'たべます',
  '�?きま�?': 'いきます',
  '�?�??': 'さん',
  '�?�': 'あ',
  '�?�': 'え',
  '�?�': 'お',
  '�?�': 'う',
  '木': 'き',
  '来': 'き',
  '好': 'す'
};

// More comprehensive character mapping based on common hiragana
const hiraganaMap = {
  'あ': 'あ', 'い': 'い', 'う': 'う', 'え': 'え', 'お': 'お',
  'か': 'か', 'き': 'き', 'く': 'く', 'け': 'け', 'こ': 'こ',
  'が': 'が', 'ぎ': 'ぎ', 'ぐ': 'ぐ', 'げ': 'げ', 'ご': 'ご',
  'さ': 'さ', 'し': 'し', 'す': 'す', 'せ': 'せ', 'そ': 'そ',
  'ざ': 'ざ', 'じ': 'じ', 'ず': 'ず', 'ぜ': 'ぜ', 'ぞ': 'ぞ',
  'た': 'た', 'ち': 'ち', 'つ': 'つ', 'て': 'て', 'と': 'と',
  'だ': 'だ', 'ぢ': 'ぢ', 'づ': 'づ', 'で': 'で', 'ど': 'ど',
  'な': 'な', 'に': 'に', 'ぬ': 'ぬ', 'ね': 'ね', 'の': 'の',
  'は': 'は', 'ひ': 'ひ', 'ふ': 'ふ', 'へ': 'へ', 'ほ': 'ほ',
  'ば': 'ば', 'び': 'び', 'ぶ': 'ぶ', 'べ': 'べ', 'ぼ': 'ぼ',
  'ぱ': 'ぱ', 'ぴ': 'ぴ', 'ぷ': 'ぷ', 'ぺ': 'ぺ', 'ぽ': 'ぽ',
  'ま': 'ま', 'み': 'み', 'む': 'む', 'め': 'め', 'も': 'も',
  'や': 'や', 'ゆ': 'ゆ', 'よ': 'よ',
  'ら': 'ら', 'り': 'り', 'る': 'る', 'れ': 'れ', 'ろ': 'ろ',
  'わ': 'わ', 'ゐ': 'ゐ', 'ゑ': 'ゑ', 'を': 'を', 'ん': 'ん'
};

function fixJapaneseEncoding(text) {
  let fixed = text;
  
  // Apply specific fixes first
  for (const [corrupted, correct] of Object.entries(encodingFixes)) {
    fixed = fixed.replace(new RegExp(corrupted, 'g'), correct);
  }
  
  return fixed;
}

function reconstructFromRomaji(romaji) {
  // Basic romaji to hiragana conversion for common patterns
  const romajiMap = {
    'miraa': 'ミラー',
    'yamada': 'やまだ',
    'karina': 'カリナ',
    'maiasa': 'まいあさ',
    'tabemasu': 'たべます',
    'ikimasu': 'いきます',
    'kimasu': 'きます',
    'kaerimasu': 'かえります',
    'tanjoubi': 'たんじょうび',
    'itsu': 'いつ',
    'desu': 'です',
    'ka': 'か',
    'wa': 'は',
    'ga': 'が',
    'o': 'を',
    'ni': 'に',
    'de': 'で',
    'to': 'と',
    'mo': 'も',
    'nani': 'なに',
    'doko': 'どこ',
    'dare': 'だれ',
    'nan': 'なん',
    'dou': 'どう',
    'hai': 'はい',
    'iie': 'いいえ',
    'arigatou': 'ありがとう',
    'sumimasen': 'すみません',
    'gozaimasu': 'ございます',
    'onegaishimasu': 'おねがいします'
  };
  
  let result = romaji.toLowerCase();
  for (const [roma, hira] of Object.entries(romajiMap)) {
    result = result.replace(new RegExp(roma, 'g'), hira);
  }
  
  return result;
}

function fixChapterFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Fix chapter title
    if (data.chapter && data.chapter.title) {
      data.chapter.title = fixJapaneseEncoding(data.chapter.title);
    }
    
    // Fix conversations
    if (data.conversations) {
      data.conversations.forEach(conv => {
        if (conv.turns) {
          conv.turns.forEach(turn => {
            // Fix speaker names
            if (turn.speaker) {
              turn.speaker = fixJapaneseEncoding(turn.speaker);
            }
            
            // Fix Japanese text
            if (turn.japanese) {
              turn.japanese = fixJapaneseEncoding(turn.japanese);
            }
            
            // Fix hiragana text
            if (turn.hiragana) {
              turn.hiragana = fixJapaneseEncoding(turn.hiragana);
            }
          });
        }
      });
    }
    
    // Fix vocabulary if needed
    if (data.vocabulary) {
      data.vocabulary.forEach(vocab => {
        if (vocab.kanji) {
          vocab.kanji = fixJapaneseEncoding(vocab.kanji);
        }
        if (vocab.kana) {
          vocab.kana = fixJapaneseEncoding(vocab.kana);
        }
      });
    }
    
    // Fix grammar examples
    if (data.grammar) {
      data.grammar.forEach(grammar => {
        if (grammar.examples) {
          grammar.examples.forEach(example => {
            if (example.japanese) {
              example.japanese = fixJapaneseEncoding(example.japanese);
            }
          });
        }
      });
    }
    
    // Fix pattern examples
    if (data.patterns) {
      data.patterns.forEach(pattern => {
        if (pattern.examples) {
          pattern.examples.forEach(example => {
            if (example.japanese) {
              example.japanese = fixJapaneseEncoding(example.japanese);
            }
          });
        }
      });
    }
    
    // Write the fixed content back
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Fixed ${filePath}`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process the affected chapters
const chaptersToFix = ['ch05.json', 'ch06.json', 'ch09.json', 'ch10.json'];

chaptersToFix.forEach(chapter => {
  const filePath = `data/${chapter}`;
  fixChapterFile(filePath);
});

console.log('Japanese encoding fix completed!');