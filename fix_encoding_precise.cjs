const fs = require('fs');

// More precise mapping based on romaji analysis
function reconstructJapaneseFromRomaji(romaji, context = '') {
  // Common phrase mappings
  const phraseMap = {
    // Chapter 5
    'Miraa-san, kinou doko ka e ikimashita ka': 'ミラーさん、きのう どこか へ いきましたか。',
    'Hai, tomodachi to Kyouto e ikimashita': 'はい、ともだちと きょうと へ いきました。',
    'Nan de ikimashita ka': 'なんで いきましたか。',
    'Shinkansen de ikimashita': 'しんかんせんで いきました。',
    'Natsuyasumi ni doko ka e ikimasu ka': 'なつやすみに どこか へ いきますか。',
    'Hai, kazoku to Hokkaidou e ikimasu': 'はい、かぞくと ほっかいどう へ いきます。',
    'Watashi wa kuni e kaerimasu': 'わたしは くに へ かえります。',
    'Indoneshia e hikouki de kaerimasu': 'インドネシア へ ひこうきで かえります。',
    
    // Chapter 6
    'Miraa-san wa maiasa nani o tabemasu ka': 'ミラーさんは まいあさ なにを たべますか。',
    'Pan to tamago o tabemasu': 'パンと たまごを たべます。',
    'Koohii mo nomimasu': 'コーヒーも のみます。',
    'Yamada-san wa': 'やまださんは？',
    'Watashi wa gohan to misoshiru o tabemasu': 'わたしは ごはんと みそしるを たべます。',
    'Mou hirugohan o tabemashita ka': 'もう ひるごはんを たべましたか。',
    'Iie, mada desu': 'いいえ、まだです。',
    'Karina-san wa': 'カリナさんは？',
    'Watashi mo mada desu': 'わたしも まだです。',
    'Issho ni shokudou e ikimasen ka': 'いっしょに しょくどう へ いきませんか。',
    'Ii desu ne': 'いいですね。',
    'Ikimashou': 'いきましょう。',
    
    // Chapter 9
    'Miraa-san, tanjoubi wa itsu desu ka': 'ミラーさん、たんじょうびは いつですか。',
    'Juunigatsu nijuugonichi desu': '12がつ 25にちです。',
    'Watashi wa hachigatsu juushichinichi desu': 'わたしは 8がつ 17にちです。',
    'Sou desu ka': 'そうですか。',
    'Indoneshia no dokuritsu kinenbi to onaji desu ne': 'インドネシアの どくりつきねんびと おなじですね。',
    
    // Chapter 10
    'Miraa-san wa nihongo ga jouzu desu ne': 'ミラーさんは にほんごが じょうずですね。',
    'Iie, madamada desu': 'いいえ、まだまだです。',
    'Sukoshi hanasemasu ga, kanji wa amari wakarimasen': 'すこし はなせますが、かんじは あまり わかりません。',
    'Hiragana to katakana wa yomemasu ka': 'ひらがなと かたかなは よめますか。',
    'Hai, yomemasu': 'はい、よめます。',
    'Demo kaku no wa muzukashii desu': 'でも かくのは むずかしいです。'
  };
  
  // Try exact match first
  if (phraseMap[romaji]) {
    return phraseMap[romaji];
  }
  
  // Try partial matches for shorter phrases
  for (const [romajiKey, japanese] of Object.entries(phraseMap)) {
    if (romajiKey.includes(romaji) || romaji.includes(romajiKey)) {
      return japanese;
    }
  }
  
  return null; // Return null if no match found
}

function fixSpecificCorruptions(text, romaji = '') {
  let fixed = text;
  
  // First try to reconstruct from romaji if available
  if (romaji) {
    const reconstructed = reconstructJapaneseFromRomaji(romaji);
    if (reconstructed) {
      return reconstructed;
    }
  }
  
  // Specific title fixes
  const titleFixes = {
    '�?�便�?は ど�?で�?�?': '郵便局は どこですか',
    '�?�?� 6�??に 起きま�?': 'まいあさ 6じに おきます',
    '�?�??�?�は �?つで�?�?': 'たんじょうびは いつですか',
    '�?��?��?�? �?�? 話�?ま�?': 'にほんごが すこし はなせます'
  };
  
  // Apply title fixes
  for (const [corrupted, correct] of Object.entries(titleFixes)) {
    if (fixed === corrupted) {
      return correct;
    }
  }
  
  // Speaker name fixes
  const speakerFixes = {
    '�??まだ': 'やまだ',
    'ãƒŸãƒ©ãƒ¼': 'ミラー',
    'ã‚«ãƒªãƒŠ': 'カリナ'
  };
  
  for (const [corrupted, correct] of Object.entries(speakerFixes)) {
    if (fixed === corrupted) {
      return correct;
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
      const fixedTitle = fixSpecificCorruptions(data.chapter.title, data.chapter.titleRomaji);
      if (fixedTitle !== originalTitle) {
        data.chapter.title = fixedTitle;
        console.log(`Fixed chapter title: ${originalTitle} -> ${fixedTitle}`);
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
              const fixedSpeaker = fixSpecificCorruptions(turn.speaker);
              if (fixedSpeaker !== originalSpeaker) {
                turn.speaker = fixedSpeaker;
                console.log(`Fixed speaker: ${originalSpeaker} -> ${fixedSpeaker}`);
                changesMade = true;
              }
            }
            
            // Fix Japanese text using romaji
            if (turn.japanese && turn.japanese.includes('�') && turn.romaji) {
              const originalJapanese = turn.japanese;
              const fixedJapanese = fixSpecificCorruptions(turn.japanese, turn.romaji);
              if (fixedJapanese !== originalJapanese) {
                turn.japanese = fixedJapanese;
                console.log(`Fixed Japanese: ${originalJapanese} -> ${fixedJapanese}`);
                changesMade = true;
              }
            }
            
            // Fix hiragana text using romaji
            if (turn.hiragana && turn.hiragana.includes('�') && turn.romaji) {
              const originalHiragana = turn.hiragana;
              const fixedHiragana = fixSpecificCorruptions(turn.hiragana, turn.romaji);
              if (fixedHiragana !== originalHiragana) {
                turn.hiragana = fixedHiragana;
                console.log(`Fixed hiragana: ${originalHiragana} -> ${fixedHiragana}`);
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

console.log('Starting precise Japanese encoding fix...');
chaptersToFix.forEach(chapter => {
  const filePath = `data/${chapter}`;
  if (fs.existsSync(filePath)) {
    fixChapterFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Precise Japanese encoding fix completed!');