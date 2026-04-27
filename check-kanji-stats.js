import fs from 'fs';

function hasKanji(text) {
  if (!text) return false;
  for (let i = 0; i < text.length; i++) {
    const code = text.codePointAt(i);
    if ((code >= 0x4E00 && code <= 0x9FAF) || (code >= 0x3400 && code <= 0x4DBF)) {
      return true;
    }
  }
  return false;
}

console.log('Checking vocabulary statistics for chapters 1-7:\n');

for (let i = 1; i <= 7; i++) {
  try {
    const data = JSON.parse(fs.readFileSync(`data/ch0${i}.json`, 'utf8'));
    const kanjiCount = data.vocabulary.filter(v => v.kanji && hasKanji(v.kanji)).length;
    const hiraganaOnly = data.vocabulary.filter(v => {
      if (!v.kanji) return false;
      for (let j = 0; j < v.kanji.length; j++) {
        const code = v.kanji.codePointAt(j);
        if (code < 0x3040 || code > 0x309F) return false;
      }
      return true;
    }).length;
    const katakanaOnly = data.vocabulary.filter(v => {
      if (!v.kanji) return false;
      for (let j = 0; j < v.kanji.length; j++) {
        const code = v.kanji.codePointAt(j);
        if (code < 0x30A0 || code > 0x30FF) return false;
      }
      return true;
    }).length;
    
    console.log(`Chapter ${i}: ${data.vocabulary.length} total, ${kanjiCount} with kanji, ${hiraganaOnly} hiragana-only, ${katakanaOnly} katakana-only`);
  } catch (e) {
    console.log(`Chapter ${i}: Error - ${e.message}`);
  }
}
