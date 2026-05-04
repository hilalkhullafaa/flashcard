// Script untuk memeriksa duplikasi vocabulary dan kanji
import { readFileSync } from 'fs';
import { hasKanji } from './js/utils.js';

// Load all chapter data
const chapters = [];
for (let i = 1; i <= 25; i++) {
  const chNum = String(i).padStart(2, '0');
  try {
    const data = readFileSync(`./data/ch${chNum}.json`, 'utf-8');
    chapters.push(JSON.parse(data));
  } catch (e) {
    console.log(`Chapter ${chNum} not found, skipping...`);
  }
}

console.log(`Loaded ${chapters.length} chapters\n`);

// Count total vocabulary (with duplicates)
let totalVocabWithDuplicates = 0;
for (const chapter of chapters) {
  if (chapter.vocabulary && Array.isArray(chapter.vocabulary)) {
    totalVocabWithDuplicates += chapter.vocabulary.length;
  }
}

// Count unique vocabulary by kanji+kana
const uniqueVocabMap = new Map();
const vocabDuplicates = new Map(); // Track duplicates

for (const chapter of chapters) {
  if (chapter.vocabulary && Array.isArray(chapter.vocabulary)) {
    for (const vocab of chapter.vocabulary) {
      if (!vocab) continue;
      
      const key = `${vocab.kanji || ''}|${vocab.kana || ''}`;
      
      if (uniqueVocabMap.has(key)) {
        // This is a duplicate
        if (!vocabDuplicates.has(key)) {
          vocabDuplicates.set(key, [uniqueVocabMap.get(key)]);
        }
        vocabDuplicates.get(key).push({
          id: vocab.id,
          kanji: vocab.kanji,
          kana: vocab.kana,
          meaning: vocab.meaning
        });
      } else {
        uniqueVocabMap.set(key, {
          id: vocab.id,
          kanji: vocab.kanji,
          kana: vocab.kana,
          meaning: vocab.meaning
        });
      }
    }
  }
}

// Count unique kanji
const uniqueKanjiSet = new Set();
const kanjiDuplicates = new Map(); // Track which vocab items have the same kanji

for (const chapter of chapters) {
  if (chapter.vocabulary && Array.isArray(chapter.vocabulary)) {
    for (const vocab of chapter.vocabulary) {
      if (!vocab) continue;
      
      if (vocab.kanji && vocab.kanji !== '' && hasKanji(vocab.kanji)) {
        if (uniqueKanjiSet.has(vocab.kanji)) {
          // This kanji appears in multiple vocab items
          if (!kanjiDuplicates.has(vocab.kanji)) {
            kanjiDuplicates.set(vocab.kanji, []);
          }
          kanjiDuplicates.get(vocab.kanji).push({
            id: vocab.id,
            kanji: vocab.kanji,
            kana: vocab.kana,
            meaning: vocab.meaning
          });
        } else {
          uniqueKanjiSet.add(vocab.kanji);
        }
      }
    }
  }
}

console.log('=== VOCABULARY ANALYSIS ===');
console.log(`Total vocabulary items (with duplicates): ${totalVocabWithDuplicates}`);
console.log(`Unique vocabulary (by kanji+kana): ${uniqueVocabMap.size}`);
console.log(`Duplicate vocabulary items: ${vocabDuplicates.size}`);
console.log();

if (vocabDuplicates.size > 0) {
  console.log('=== DUPLICATE VOCABULARY (First 10) ===');
  let count = 0;
  for (const [key, items] of vocabDuplicates) {
    if (count >= 10) break;
    const [kanji, kana] = key.split('|');
    console.log(`\n${count + 1}. ${kanji || '(no kanji)'} (${kana})`);
    console.log(`   Appears ${items.length + 1} times:`);
    // Show first occurrence
    const first = uniqueVocabMap.get(key);
    console.log(`   - ${first.id}: ${first.meaning}`);
    // Show duplicates
    for (const item of items) {
      console.log(`   - ${item.id}: ${item.meaning}`);
    }
    count++;
  }
  console.log();
}

console.log('=== KANJI ANALYSIS ===');
console.log(`Unique kanji: ${uniqueKanjiSet.size}`);
console.log(`Kanji that appear in multiple vocabulary items: ${kanjiDuplicates.size}`);
console.log();

if (kanjiDuplicates.size > 0) {
  console.log('=== KANJI IN MULTIPLE VOCAB (First 10) ===');
  let count = 0;
  for (const [kanji, items] of kanjiDuplicates) {
    if (count >= 10) break;
    console.log(`\n${count + 1}. ${kanji} - appears in ${items.length + 1} vocabulary items:`);
    for (const item of items.slice(0, 5)) { // Show max 5 examples
      console.log(`   - ${item.id}: ${item.kanji} (${item.kana}) = ${item.meaning}`);
    }
    if (items.length > 5) {
      console.log(`   ... and ${items.length - 5} more`);
    }
    count++;
  }
}

console.log('\n=== SUMMARY ===');
console.log(`Expected total vocabulary: 863`);
console.log(`Actual unique vocabulary: ${uniqueVocabMap.size}`);
console.log(`Difference: ${863 - uniqueVocabMap.size}`);
console.log();
console.log(`Expected total kanji: 569`);
console.log(`Actual unique kanji: ${uniqueKanjiSet.size}`);
console.log(`Difference: ${569 - uniqueKanjiSet.size}`);
