const fs = require('fs');

console.log('=== ANALYZING CHAPTER 6 VOCABULARY USAGE ===\n');

const ch06 = JSON.parse(fs.readFileSync('data/ch06.json', 'utf8'));

// Extract all vocabulary kanji and kana from Chapter 6
const ch06Vocab = new Set();
ch06.vocabulary.forEach(v => {
  ch06Vocab.add(v.kanji);
  ch06Vocab.add(v.kana);
  ch06Vocab.add(v.romaji);
});

console.log(`📚 Chapter 6 has ${ch06.vocabulary.length} vocabulary entries\n`);

// Also load vocabulary from previous chapters (1-5) for progressive learning
const previousVocab = new Set();
for (let i = 1; i <= 5; i++) {
  try {
    const chData = JSON.parse(fs.readFileSync(`data/ch0${i}.json`, 'utf8'));
    chData.vocabulary.forEach(v => {
      previousVocab.add(v.kanji);
      previousVocab.add(v.kana);
    });
  } catch (e) {
    console.log(`⚠️  Could not load chapter ${i}`);
  }
}

console.log(`📚 Previous chapters (1-5) have ${previousVocab.size} vocabulary entries\n`);

// Combine all allowed vocabulary
const allowedVocab = new Set([...ch06Vocab, ...previousVocab]);

// Common particles and grammar words that are always allowed
const grammarWords = new Set([
  'は', 'が', 'を', 'に', 'で', 'と', 'の', 'へ', 'から', 'まで', 'も', 'か',
  'です', 'ます', 'ました', 'ません', 'ませんでした',
  'この', 'その', 'あの', 'どの', 'ここ', 'そこ', 'あそこ', 'どこ',
  'これ', 'それ', 'あれ', 'どれ',
  'だれ', 'なに', 'なん', 'いつ', 'どう', 'なぜ',
  'はい', 'いいえ', 'ええ',
  'まいあさ', 'まいばん', 'まいにち', 'けさ', 'きのう', 'きょう', 'あした',
  'よく', 'ときどき', 'あまり', 'ぜんぜん', 'たくさん',
  'もう', 'まだ',
  'ちょっと', 'すこし', 'とても', 'たいへん',
  'いっしょに', 'それから', 'じゃ',
  'わかりました', 'いいですね',
  'さん', 'くん', 'ちゃん', 'せんせい'
]);

// Check conversations
console.log('🗣️  CHECKING CONVERSATIONS:\n');
let convIssues = [];

ch06.conversations.forEach(conv => {
  conv.turns.forEach((turn, idx) => {
    const words = turn.japanese.split(/[\s　、。！？]/);
    words.forEach(word => {
      if (word && !allowedVocab.has(word) && !grammarWords.has(word)) {
        // Check if it's a name (katakana or contains さん)
        const isName = /^[ァ-ヴー]+$/.test(word) || word.includes('さん');
        if (!isName) {
          convIssues.push({
            id: conv.id,
            title: conv.title,
            turn: idx + 1,
            word: word,
            sentence: turn.japanese
          });
        }
      }
    });
  });
});

if (convIssues.length > 0) {
  console.log(`❌ Found ${convIssues.length} potential vocabulary issues in conversations:\n`);
  convIssues.forEach(issue => {
    console.log(`   ${issue.id} (${issue.title})`);
    console.log(`   Turn ${issue.turn}: "${issue.word}" in "${issue.sentence}"`);
    console.log('');
  });
} else {
  console.log('✅ All conversations use appropriate vocabulary!\n');
}

// Check grammar examples
console.log('📖 CHECKING GRAMMAR EXAMPLES:\n');
let grammarIssues = [];

ch06.grammar.forEach(g => {
  g.examples.forEach((ex, idx) => {
    const words = ex.japanese.split(/[\s　、。！？]/);
    words.forEach(word => {
      if (word && !allowedVocab.has(word) && !grammarWords.has(word)) {
        const isName = /^[ァ-ヴー]+$/.test(word) || word.includes('さん');
        if (!isName) {
          grammarIssues.push({
            id: g.id,
            title: g.title,
            example: idx + 1,
            word: word,
            sentence: ex.japanese
          });
        }
      }
    });
  });
});

if (grammarIssues.length > 0) {
  console.log(`❌ Found ${grammarIssues.length} potential vocabulary issues in grammar:\n`);
  grammarIssues.forEach(issue => {
    console.log(`   ${issue.id} (${issue.title})`);
    console.log(`   Example ${issue.example}: "${issue.word}" in "${issue.sentence}"`);
    console.log('');
  });
} else {
  console.log('✅ All grammar examples use appropriate vocabulary!\n');
}

// Check pattern examples
console.log('🔤 CHECKING PATTERN EXAMPLES:\n');
let patternIssues = [];

ch06.patterns.forEach(p => {
  p.examples.forEach((ex, idx) => {
    const words = ex.japanese.split(/[\s　、。！？]/);
    words.forEach(word => {
      if (word && !allowedVocab.has(word) && !grammarWords.has(word)) {
        const isName = /^[ァ-ヴー]+$/.test(word) || word.includes('さん');
        if (!isName) {
          patternIssues.push({
            id: p.id,
            pattern: p.pattern,
            example: idx + 1,
            word: word,
            sentence: ex.japanese
          });
        }
      }
    });
  });
});

if (patternIssues.length > 0) {
  console.log(`❌ Found ${patternIssues.length} potential vocabulary issues in patterns:\n`);
  patternIssues.forEach(issue => {
    console.log(`   ${issue.id} (${issue.pattern})`);
    console.log(`   Example ${issue.example}: "${issue.word}" in "${issue.sentence}"`);
    console.log('');
  });
} else {
  console.log('✅ All pattern examples use appropriate vocabulary!\n');
}

// Summary
console.log('=== SUMMARY ===');
console.log(`Conversations: ${convIssues.length} issues`);
console.log(`Grammar: ${grammarIssues.length} issues`);
console.log(`Patterns: ${patternIssues.length} issues`);
console.log(`Total: ${convIssues.length + grammarIssues.length + patternIssues.length} issues`);

if (convIssues.length + grammarIssues.length + patternIssues.length === 0) {
  console.log('\n✅ ALL CONTENT USES APPROPRIATE VOCABULARY!');
} else {
  console.log('\n⚠️  SOME CONTENT NEEDS REVIEW');
}
