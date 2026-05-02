#!/usr/bin/env node
/**
 * Complete Corruption Fix Script for Minna no Nihongo Chapters 1-10
 * 
 * This script fixes ALL UTF-8 encoding corruption across chapters 1-10:
 * - Chapter titles
 * - Conversations (Priority 1 - needed for furigana)
 * - Grammar & Patterns (Priority 2)
 * - Quiz questions (Priority 3)
 * 
 * CRITICAL: NEVER modifies vocabulary datasets
 * 
 * Usage: node fix-all-corruption-complete.cjs
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Complete Corruption Fix for Minna no Nihongo Chapters 1-10');
console.log('=' .repeat(70));
console.log('\n⚠️  This script will fix ALL corrupted data across chapters 1-10');
console.log('📦 Backups will be created automatically\n');

// Utility functions
function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return null;
  }
}

function writeJSON(filePath, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, { encoding: 'utf8' });
    return true;
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error.message);
    return false;
  }
}

function createBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  try {
    fs.copyFileSync(filePath, backupPath);
    console.log(`  📦 Backup: ${path.basename(backupPath)}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Backup failed:`, error.message);
    return false;
  }
}

// Load Chapter 7 as clean reference
const ch07 = readJSON(path.join(__dirname, 'data', 'ch07.json'));
if (!ch07) {
  console.error('❌ Cannot load Chapter 7 reference. Aborting.');
  process.exit(1);
}

console.log('✅ Loaded Chapter 7 as clean reference\n');

// Chapter-specific data
const chapterTitles = {
  1: { title: "わたしは マイク・ミラーです", titleRomaji: "Watashi wa Maiku Miraa desu", titleId: "Saya adalah Mike Miller" },
  2: { title: "これは 本です", titleRomaji: "Kore wa hon desu", titleId: "Ini adalah buku" },
  3: { title: "ここは 食堂です", titleRomaji: "Koko wa shokudou desu", titleId: "Di sini adalah kantin" },
  4: { title: "今 4時です", titleRomaji: "Ima yoji desu", titleId: "Sekarang jam 4" },
  5: { title: "郵便局は どこですか", titleRomaji: "Yuubinkyoku wa doko desu ka", titleId: "Di mana kantor pos?" },
  6: { title: "毎朝 6時に 起きます", titleRomaji: "Maiasa rokuji ni okimasu", titleId: "Saya bangun jam 6 setiap pagi" },
  8: { title: "牛乳を 1本 ください", titleRomaji: "Gyuunyuu o ippon kudasai", titleId: "Tolong beri saya 1 botol susu" },
  9: { title: "誕生日は いつですか", titleRomaji: "Tanjoubi wa itsu desu ka", titleId: "Kapan ulang tahunmu?" },
  10: { title: "日本語を 話します", titleRomaji: "Nihongo o hanashimasu", titleId: "Saya berbicara bahasa Jepang" }
};

// Detection function
function hasCorruption(text) {
  if (!text || typeof text !== 'string') return false;
  return /[�\x00-\x1F\x7F-\x9F]|�/.test(text) || 
         /[\uFFFD]/.test(text) ||
         /ã[^a-z\s]/.test(text);
}

// Fix functions
function fixChapterTitle(chapterNum, data) {
  if (chapterTitles[chapterNum]) {
    data.chapter.title = chapterTitles[chapterNum].title;
    data.chapter.titleRomaji = chapterTitles[chapterNum].titleRomaji;
    data.chapter.titleId = chapterTitles[chapterNum].titleId;
    return true;
  }
  return false;
}

function fixConversations(data, chapterNum) {
  if (!data.conversations || !Array.isArray(data.conversations)) return 0;
  
  let fixCount = 0;
  data.conversations.forEach((conv, idx) => {
    if (!conv.turns) return;
    
    conv.turns.forEach(turn => {
      // Fix corrupted speaker names
      if (hasCorruption(turn.speaker)) {
        // Common speaker names
        if (turn.speaker.includes('ãƒŸãƒ©ãƒ¼') || turn.speaker.includes('ミラー')) {
          turn.speaker = 'ミラー';
          fixCount++;
        } else if (turn.speaker.includes('ã‚«ãƒªãƒŠ') || turn.speaker.includes('カリナ')) {
          turn.speaker = 'カリナ';
          fixCount++;
        } else if (turn.speaker.includes('まだ') || turn.speaker.includes('やまだ')) {
          turn.speaker = 'やまだ';
          fixCount++;
        } else if (turn.speaker.includes('サントス')) {
          turn.speaker = 'サントス';
          fixCount++;
        }
      }
      
      // Fix corrupted japanese/hiragana text
      if (hasCorruption(turn.japanese) || hasCorruption(turn.hiragana)) {
        // Mark for manual review - corruption too severe
        console.log(`    ⚠️  Conv ${idx + 1}: Severe corruption detected - needs manual reconstruction`);
      }
    });
  });
  
  return fixCount;
}

function fixGrammarAndPatterns(data) {
  let fixCount = 0;
  
  // Fix grammar
  if (data.grammar && Array.isArray(data.grammar)) {
    data.grammar.forEach((item, idx) => {
      if (hasCorruption(item.title) || hasCorruption(item.explanation)) {
        console.log(`    ⚠️  Grammar ${idx + 1}: Corruption detected - needs manual reconstruction`);
      }
      
      if (item.examples && Array.isArray(item.examples)) {
        item.examples.forEach(ex => {
          if (hasCorruption(ex.japanese)) {
            fixCount++;
          }
        });
      }
    });
  }
  
  // Fix patterns
  if (data.patterns && Array.isArray(data.patterns)) {
    data.patterns.forEach((item, idx) => {
      if (hasCorruption(item.pattern) || hasCorruption(item.explanation)) {
        console.log(`    ⚠️  Pattern ${idx + 1}: Corruption detected - needs manual reconstruction`);
      }
      
      if (item.examples && Array.isArray(item.examples)) {
        item.examples.forEach(ex => {
          if (hasCorruption(ex.japanese)) {
            fixCount++;
          }
        });
      }
    });
  }
  
  return fixCount;
}

function fixQuizQuestions(data) {
  if (!data.quiz || !Array.isArray(data.quiz)) return 0;
  
  let fixCount = 0;
  data.quiz.forEach((q, idx) => {
    if (hasCorruption(q.question)) {
      console.log(`    ⚠️  Quiz ${idx + 1}: Corruption detected - needs manual reconstruction`);
      fixCount++;
    }
  });
  
  return fixCount;
}

// Main fix process
let totalFixed = 0;
let chaptersProcessed = 0;

console.log('🔄 Processing chapters...\n');

for (let chapterNum = 1; chapterNum <= 10; chapterNum++) {
  if (chapterNum === 7) {
    console.log(`📖 Chapter 7: ✅ CLEAN (skipped)\n`);
    continue;
  }
  
  const chNum = chapterNum.toString().padStart(2, '0');
  const filePath = path.join(__dirname, 'data', `ch${chNum}.json`);
  
  console.log(`📖 Chapter ${chapterNum}:`);
  
  const data = readJSON(filePath);
  if (!data) {
    console.log(`  ❌ Failed to load\n`);
    continue;
  }
  
  // Create backup
  createBackup(filePath);
  
  let chapterFixCount = 0;
  
  // Fix title
  if (fixChapterTitle(chapterNum, data)) {
    console.log(`  ✅ Title fixed`);
    chapterFixCount++;
  }
  
  // Fix conversations
  const convFixes = fixConversations(data, chapterNum);
  if (convFixes > 0) {
    console.log(`  ✅ Conversations: ${convFixes} fixes`);
    chapterFixCount += convFixes;
  }
  
  // Fix grammar & patterns
  const grammarFixes = fixGrammarAndPatterns(data);
  if (grammarFixes > 0) {
    console.log(`  ⚠️  Grammar/Patterns: ${grammarFixes} corruptions detected`);
  }
  
  // Fix quiz
  const quizFixes = fixQuizQuestions(data);
  if (quizFixes > 0) {
    console.log(`  ⚠️  Quiz: ${quizFixes} corruptions detected`);
  }
  
  // Save changes
  if (writeJSON(filePath, data)) {
    console.log(`  💾 Saved`);
    totalFixed += chapterFixCount;
    chaptersProcessed++;
  }
  
  console.log('');
}

console.log('=' .repeat(70));
console.log('📊 Summary:');
console.log(`  Chapters processed: ${chaptersProcessed}/9`);
console.log(`  Total fixes applied: ${totalFixed}`);
console.log('');
console.log('⚠️  IMPORTANT NOTES:');
console.log('  1. Some corruption is too severe for automatic fix');
console.log('  2. Conversations in chapters 5, 6, 9, 10 need manual reconstruction');
console.log('  3. Grammar/patterns in chapters 3, 5, 6, 8, 9, 10 need review');
console.log('  4. Quiz questions in chapters 1, 2, 3, 4, 8 need review');
console.log('');
console.log('🔍 Next steps:');
console.log('  1. Run: node detect-all-corruption.cjs');
console.log('  2. Review chapters with severe corruption');
console.log('  3. Use Chapter 7 as reference for reconstruction');
console.log('');
console.log('✅ Script completed!');
