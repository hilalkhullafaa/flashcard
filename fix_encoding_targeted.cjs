const fs = require('fs');

// Comprehensive mapping based on the actual corrupted patterns found
const specificFixes = {
  // Chapter titles
  '�?�便�?は ど�?で�?�?': '郵便局は どこですか',
  '�?�?� 6�??に 起きま�?': 'まいあさ 6じに おきます',
  '�?�??�?�は �?つで�?�?': 'たんじょうびは いつですか',
  '�?��?��?�? �?�? 話�?ま�?': 'にほんごが すこし はなせます',
  
  // Speaker names
  '�??まだ': 'やまだ',
  'ãƒŸãƒ©ãƒ¼': 'ミラー',
  'ã‚«ãƒªãƒŠ': 'カリナ',
  
  // Common corrupted Japanese phrases
  '�??�?��?��?�??': 'ミラーさん',
  '�?��?��??�?�??': 'カリナさん',
  '�??まだ�?�??': 'やまださん',
  '�?�??�?�??�?び': 'たんじょうび',
  '�?�?�': 'まい',
  '�?べま�?': 'たべます',
  '�?きま�?': 'いきます',
  '�?�??': 'さん',
  '�?つで�?': 'いつです',
  '�?�?�?': 'まいあさ',
  '�?べま�?�?': 'たべますか',
  '�??�?�': 'パン',
  '�?ま�?�??': 'たまごを',
  '�?��?��??�?��??': 'コーヒーも',
  '飲�?ま�?': 'のみます',
  '�?は�??': 'ごはん',
  'みそ�?�??': 'みそしる',
  '�??�?': 'もう',
  'ひ�??�?は�??': 'ひるごはん',
  '�?べま�?�?�?': 'たべましたか',
  '�?�?�?': 'いいえ',
  'まだで�?': 'まだです',
  '�?っ�?�??に': 'いっしょに',
  '�?�??くど�?': 'しょくどう',
  '�?�?で�?ね': 'いいですね',
  '�?きま�?�??�?': 'いきましょう',
  
  // Hiragana fixes
  '�??�?��?��?�??は ま�?�?�? なに�?? �?べま�?�?�??': 'ミラーさんは まいあさ なにを たべますか',
  '�??�?�と �?ま�?�?? �?べま�?�??�?��?��??�?��?? のみま�?�??�??まだ�?�??は�?': 'パンと たまごを たべます。コーヒーも のみます。やまださんは？',
  '�?��?�?は �?は�??と みそ�?�??�?? �?べま�?�??': 'わたしは ごはんと みそしるを たべます',
  
  // More specific patterns
  '木': 'き',
  '来': 'き',
  '好': 'す',
  '�?�': 'あ',
  '�?�': 'い',
  '�?�': 'う',
  '�?�': 'え',
  '�?�': 'お',
  '�?�': 'か',
  '�?�': 'が',
  '�?�': 'き',
  '�?�': 'ぎ',
  '�?�': 'く',
  '�?�': 'ぐ',
  '�?�': 'け',
  '�?�': 'げ',
  '�?�': 'こ',
  '�?�': 'ご',
  '�?�': 'さ',
  '�?�': 'ざ',
  '�?�': 'し',
  '�?�': 'じ',
  '�?�': 'す',
  '�?�': 'ず',
  '�?�': 'せ',
  '�?�': 'ぜ',
  '�?�': 'そ',
  '�?�': 'ぞ',
  '�?�': 'た',
  '�?�': 'だ',
  '�?�': 'ち',
  '�?�': 'ぢ',
  '�?�': 'つ',
  '�?�': 'づ',
  '�?�': 'て',
  '�?�': 'で',
  '�?�': 'と',
  '�?�': 'ど',
  '�?�': 'な',
  '�?�': 'に',
  '�?�': 'ぬ',
  '�?�': 'ね',
  '�?�': 'の',
  '�?�': 'は',
  '�?�': 'ば',
  '�?�': 'ぱ',
  '�?�': 'ひ',
  '�?�': 'び',
  '�?�': 'ぴ',
  '�?�': 'ふ',
  '�?�': 'ぶ',
  '�?�': 'ぷ',
  '�?�': 'へ',
  '�?�': 'べ',
  '�?�': 'ぺ',
  '�?�': 'ほ',
  '�?�': 'ぼ',
  '�?�': 'ぽ',
  '�?�': 'ま',
  '�?�': 'み',
  '�?�': 'む',
  '�?�': 'め',
  '�?�': 'も',
  '�?�': 'や',
  '�?�': 'ゆ',
  '�?�': 'よ',
  '�?�': 'ら',
  '�?�': 'り',
  '�?�': 'る',
  '�?�': 'れ',
  '�?�': 'ろ',
  '�?�': 'わ',
  '�?�': 'ゐ',
  '�?�': 'ゑ',
  '�?�': 'を',
  '�?�': 'ん'
};

// Function to reconstruct Japanese text from romaji when corruption is too severe
function reconstructFromRomaji(romaji, context = '') {
  const commonPhrases = {
    'Miraa-san wa maiasa nani o tabemasu ka': 'ミラーさんは まいあさ なにを たべますか',
    'Pan to tamago o tabemasu': 'パンと たまごを たべます',
    'Koohii mo nomimasu': 'コーヒーも のみます',
    'Yamada-san wa': 'やまださんは',
    'Watashi wa gohan to misoshiru o tabemasu': 'わたしは ごはんと みそしるを たべます',
    'Mou hirugohan o tabemashita ka': 'もう ひるごはんを たべましたか',
    'Iie, mada desu': 'いいえ、まだです',
    'Karina-san wa': 'カリナさんは',
    'Watashi mo mada desu': 'わたしも まだです',
    'Issho ni shokudou e ikimasen ka': 'いっしょに しょくどうへ いきませんか',
    'Ii desu ne': 'いいですね',
    'Ikimashou': 'いきましょう',
    'Tanjoubi wa itsu desu ka': 'たんじょうびは いつですか',
    'Juunigatsu nijuugonichi desu': '12がつ 25にちです',
    'Watashi wa hachigatsu juushichinichi desu': 'わたしは 8がつ 17にちです',
    'Sou desu ka': 'そうですか',
    'Indoneshia no dokuritsu kinenbi to onaji desu ne': 'インドネシアの どくりつきねんびと おなじですね'
  };
  
  // Try exact match first
  if (commonPhrases[romaji]) {
    return commonPhrases[romaji];
  }
  
  // Try partial matches
  for (const [romajiPhrase, japanese] of Object.entries(commonPhrases)) {
    if (romaji.includes(romajiPhrase) || romajiPhrase.includes(romaji)) {
      return japanese;
    }
  }
  
  return romaji; // Return original if no match found
}

function fixJapaneseText(text, romaji = '') {
  let fixed = text;
  
  // Apply specific fixes in order of longest to shortest to avoid partial replacements
  const sortedFixes = Object.entries(specificFixes).sort((a, b) => b[0].length - a[0].length);
  
  for (const [corrupted, correct] of sortedFixes) {
    if (fixed.includes(corrupted)) {
      fixed = fixed.replace(new RegExp(corrupted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correct);
    }
  }
  
  // If still heavily corrupted and we have romaji, try reconstruction
  if (romaji && fixed.includes('�')) {
    const reconstructed = reconstructFromRomaji(romaji);
    if (reconstructed !== romaji) {
      fixed = reconstructed;
    }
  }
  
  return fixed;
}

function fixChapterFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    let changesMade = false;
    
    // Fix chapter title
    if (data.chapter && data.chapter.title && data.chapter.title.includes('�')) {
      const originalTitle = data.chapter.title;
      data.chapter.title = fixJapaneseText(data.chapter.title, data.chapter.titleRomaji);
      if (data.chapter.title !== originalTitle) {
        console.log(`Fixed chapter title: ${originalTitle} -> ${data.chapter.title}`);
        changesMade = true;
      }
    }
    
    // Fix conversations
    if (data.conversations) {
      data.conversations.forEach((conv, convIndex) => {
        if (conv.turns) {
          conv.turns.forEach((turn, turnIndex) => {
            // Fix speaker names
            if (turn.speaker && turn.speaker.includes('�')) {
              const originalSpeaker = turn.speaker;
              turn.speaker = fixJapaneseText(turn.speaker);
              if (turn.speaker !== originalSpeaker) {
                console.log(`Fixed speaker: ${originalSpeaker} -> ${turn.speaker}`);
                changesMade = true;
              }
            }
            
            // Fix Japanese text
            if (turn.japanese && turn.japanese.includes('�')) {
              const originalJapanese = turn.japanese;
              turn.japanese = fixJapaneseText(turn.japanese, turn.romaji);
              if (turn.japanese !== originalJapanese) {
                console.log(`Fixed Japanese: ${originalJapanese} -> ${turn.japanese}`);
                changesMade = true;
              }
            }
            
            // Fix hiragana text
            if (turn.hiragana && turn.hiragana.includes('�')) {
              const originalHiragana = turn.hiragana;
              turn.hiragana = fixJapaneseText(turn.hiragana, turn.romaji);
              if (turn.hiragana !== originalHiragana) {
                console.log(`Fixed hiragana: ${originalHiragana} -> ${turn.hiragana}`);
                changesMade = true;
              }
            }
          });
        }
      });
    }
    
    // Fix vocabulary
    if (data.vocabulary) {
      data.vocabulary.forEach((vocab, index) => {
        if (vocab.kanji && vocab.kanji.includes('�')) {
          const originalKanji = vocab.kanji;
          vocab.kanji = fixJapaneseText(vocab.kanji, vocab.romaji);
          if (vocab.kanji !== originalKanji) {
            console.log(`Fixed vocab kanji: ${originalKanji} -> ${vocab.kanji}`);
            changesMade = true;
          }
        }
        
        if (vocab.kana && vocab.kana.includes('�')) {
          const originalKana = vocab.kana;
          vocab.kana = fixJapaneseText(vocab.kana, vocab.romaji);
          if (vocab.kana !== originalKana) {
            console.log(`Fixed vocab kana: ${originalKana} -> ${vocab.kana}`);
            changesMade = true;
          }
        }
      });
    }
    
    // Fix grammar examples
    if (data.grammar) {
      data.grammar.forEach(grammar => {
        if (grammar.examples) {
          grammar.examples.forEach(example => {
            if (example.japanese && example.japanese.includes('�')) {
              const originalJapanese = example.japanese;
              example.japanese = fixJapaneseText(example.japanese, example.romaji);
              if (example.japanese !== originalJapanese) {
                console.log(`Fixed grammar example: ${originalJapanese} -> ${example.japanese}`);
                changesMade = true;
              }
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
            if (example.japanese && example.japanese.includes('�')) {
              const originalJapanese = example.japanese;
              example.japanese = fixJapaneseText(example.japanese, example.romaji);
              if (example.japanese !== originalJapanese) {
                console.log(`Fixed pattern example: ${originalJapanese} -> ${example.japanese}`);
                changesMade = true;
              }
            }
          });
        }
      });
    }
    
    if (changesMade) {
      // Write the fixed content back
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Successfully fixed ${filePath}`);
    } else {
      console.log(`No changes needed for ${filePath}`);
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process the affected chapters
const chaptersToFix = ['ch05.json', 'ch06.json', 'ch09.json', 'ch10.json'];

console.log('Starting Japanese encoding fix...');
chaptersToFix.forEach(chapter => {
  const filePath = `data/${chapter}`;
  if (fs.existsSync(filePath)) {
    fixChapterFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Japanese encoding fix completed!');