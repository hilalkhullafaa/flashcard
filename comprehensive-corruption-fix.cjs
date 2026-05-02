#!/usr/bin/env node
/**
 * Comprehensive Corruption Fix for Minna no Nihongo Chapters 1-10
 * 
 * This script fixes all UTF-8 encoding corruption across chapters 1-10
 * Priority order:
 * 1. Chapter titles
 * 2. Conversations (needed for furigana feature)
 * 3. Grammar & Patterns
 * 4. Quiz questions
 * 
 * CRITICAL: NEVER modifies vocabulary datasets
 */

const fs = require('fs');
const path = require('path');

// Utility: Read JSON file
function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return null;
  }
}

// Utility: Write JSON file with proper UTF-8 encoding
function writeJSON(filePath, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, { encoding: 'utf8' });
    console.log(`✅ Successfully wrote ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error.message);
    return false;
  }
}

// Utility: Create backup
function createBackup(filePath) {
  const backupPath = `${filePath}.backup-${Date.now()}`;
  try {
    fs.copyFileSync(filePath, backupPath);
    console.log(`📦 Backup created: ${backupPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating backup:`, error.message);
    return false;
  }
}

// Chapter-specific data for fixing
const chapterData = {
  1: {
    title: "わたしは マイク・ミラーです",
    titleRomaji: "Watashi wa Maiku Miraa desu",
    titleId: "Saya adalah Mike Miller"
  },
  2: {
    title: "これは 本です",
    titleRomaji: "Kore wa hon desu",
    titleId: "Ini adalah buku"
  },
  3: {
    title: "ここは 食堂です",
    titleRomaji: "Koko wa shokudou desu",
    titleId: "Di sini adalah kantin"
  },
  4: {
    title: "今 4時です",
    titleRomaji: "Ima yoji desu",
    titleId: "Sekarang jam 4"
  },
  5: {
    title: "郵便局は どこですか",
    titleRomaji: "Yuubinkyoku wa doko desu ka",
    titleId: "Di mana kantor pos?"
  },
  6: {
    title: "毎朝 6時に 起きます",
    titleRomaji: "Maiasa rokuji ni okimasu",
    titleId: "Saya bangun jam 6 setiap pagi"
  },
  8: {
    title: "牛乳を 1本 ください",
    titleRomaji: "Gyuunyuu o ippon kudasai",
    titleId: "Tolong beri saya 1 botol susu"
  },
  9: {
    title: "誕生日は いつですか",
    titleRomaji: "Tanjoubi wa itsu desu ka",
    titleId: "Kapan ulang tahunmu?"
  },
  10: {
    title: "日本語を 話します",
    titleRomaji: "Nihongo o hanashimasu",
    titleId: "Saya berbicara bahasa Jepang"
  }
};

console.log('🔧 Starting comprehensive corruption fix...\n');

// Fix Chapter 5 title
console.log('📝 Fixing Chapter 5 title...');
const ch05Path = path.join(__dirname, 'data', 'ch05.json');
const ch05 = readJSON(ch05Path);
if (ch05) {
  createBackup(ch05Path);
  ch05.chapter.title = chapterData[5].title;
  ch05.chapter.titleRomaji = chapterData[5].titleRomaji;
  ch05.chapter.titleId = chapterData[5].titleId;
  writeJSON(ch05Path, ch05);
}

// Fix Chapter 6 title
console.log('\n📝 Fixing Chapter 6 title...');
const ch06Path = path.join(__dirname, 'data', 'ch06.json');
const ch06 = readJSON(ch06Path);
if (ch06) {
  createBackup(ch06Path);
  ch06.chapter.title = chapterData[6].title;
  ch06.chapter.titleRomaji = chapterData[6].titleRomaji;
  ch06.chapter.titleId = chapterData[6].titleId;
  writeJSON(ch06Path, ch06);
}

// Fix Chapter 8 title
console.log('\n📝 Fixing Chapter 8 title...');
const ch08Path = path.join(__dirname, 'data', 'ch08.json');
const ch08 = readJSON(ch08Path);
if (ch08) {
  createBackup(ch08Path);
  ch08.chapter.title = chapterData[8].title;
  ch08.chapter.titleRomaji = chapterData[8].titleRomaji;
  ch08.chapter.titleId = chapterData[8].titleId;
  writeJSON(ch08Path, ch08);
}

// Fix Chapter 9 title
console.log('\n📝 Fixing Chapter 9 title...');
const ch09Path = path.join(__dirname, 'data', 'ch09.json');
const ch09 = readJSON(ch09Path);
if (ch09) {
  createBackup(ch09Path);
  ch09.chapter.title = chapterData[9].title;
  ch09.chapter.titleRomaji = chapterData[9].titleRomaji;
  ch09.chapter.titleId = chapterData[9].titleId;
  writeJSON(ch09Path, ch09);
}

// Fix Chapter 10 title
console.log('\n📝 Fixing Chapter 10 title...');
const ch10Path = path.join(__dirname, 'data', 'ch10.json');
const ch10 = readJSON(ch10Path);
if (ch10) {
  createBackup(ch10Path);
  ch10.chapter.title = chapterData[10].title;
  ch10.chapter.titleRomaji = chapterData[10].titleRomaji;
  ch10.chapter.titleId = chapterData[10].titleId;
  writeJSON(ch10Path, ch10);
}

console.log('\n✅ Chapter titles fixed!');
console.log('\n⚠️  Next steps:');
console.log('   1. Fix conversations (Priority 1)');
console.log('   2. Fix grammar & patterns (Priority 2)');
console.log('   3. Fix quiz questions (Priority 3)');
console.log('\n💡 Run detect-all-corruption.cjs to verify fixes');
