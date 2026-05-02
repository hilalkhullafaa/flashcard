const fs = require('fs');
const path = require('path');

console.log('🔄 Restoring Chapter 6, 8, 10 from backup...\n');

// Function to try reading from multiple backup sources
function getBestBackup(chapterNum) {
  const ch = `ch${String(chapterNum).padStart(2, '0')}`;
  const backupPaths = [
    `data/${ch}.json.backup-1777738117582`,  // For ch06
    `data/${ch}.json.backup-1777738117944`,  // For ch08
    `data/${ch}.json.backup-1777738118313`,  // For ch10
    `data/${ch}.json.backup`,
    `backups/deployment_20260502_205220/${ch}.json`
  ];
  
  for (const backupPath of backupPaths) {
    if (fs.existsSync(backupPath)) {
      try {
        const content = fs.readFileSync(backupPath, 'utf8');
        const data = JSON.parse(content);
        
        // Check if it has data
        if (data.vocabulary && data.vocabulary.length > 0) {
          console.log(`✓ Found good backup for ${ch} at: ${backupPath}`);
          console.log(`  - Vocabulary: ${data.vocabulary.length} items`);
          console.log(`  - Conversations: ${data.conversations ? data.conversations.length : 0} items`);
          console.log(`  - Patterns: ${data.patterns ? data.patterns.length : 0} items`);
          console.log(`  - Grammar: ${data.grammar ? data.grammar.length : 0} items`);
          console.log(`  - Quiz: ${data.quiz ? data.quiz.length : 0} items`);
          return data;
        }
      } catch (e) {
        console.log(`  ⚠️  Backup at ${backupPath} is corrupted or invalid`);
      }
    }
  }
  
  return null;
}

// Restore Chapter 6
console.log('=== Chapter 6 ===');
const ch06Data = getBestBackup(6);
if (ch06Data) {
  // Fix chapter ID if needed
  if (ch06Data.chapter.id !== 6) {
    ch06Data.chapter.id = 6;
  }
  
  // Fix vocabulary chapter IDs
  if (ch06Data.vocabulary) {
    ch06Data.vocabulary = ch06Data.vocabulary.map(item => ({
      ...item,
      chapterId: 6,
      id: item.id.replace(/ch\d+_/, 'ch06_')
    }));
  }
  
  // Fix conversations chapter IDs
  if (ch06Data.conversations) {
    ch06Data.conversations = ch06Data.conversations.map(item => ({
      ...item,
      chapterId: 6,
      id: item.id.replace(/ch\d+_/, 'ch06_')
    }));
  }
  
  // Fix patterns chapter IDs
  if (ch06Data.patterns) {
    ch06Data.patterns = ch06Data.patterns.map(item => ({
      ...item,
      chapterId: 6,
      id: item.id.replace(/ch\d+_/, 'ch06_')
    }));
  }
  
  // Fix grammar chapter IDs
  if (ch06Data.grammar) {
    ch06Data.grammar = ch06Data.grammar.map(item => ({
      ...item,
      chapterId: 6,
      id: item.id.replace(/ch\d+_/, 'ch06_')
    }));
  }
  
  // Fix quiz chapter IDs
  if (ch06Data.quiz) {
    ch06Data.quiz = ch06Data.quiz.map(item => ({
      ...item,
      chapterId: 6,
      id: item.id.replace(/ch\d+_/, 'ch06_')
    }));
  }
  
  fs.writeFileSync('data/ch06.json', JSON.stringify(ch06Data, null, 2), 'utf8');
  console.log('✅ Chapter 6 restored\n');
} else {
  console.log('❌ No valid backup found for Chapter 6\n');
}

// Restore Chapter 8
console.log('=== Chapter 8 ===');
const ch08Data = getBestBackup(8);
if (ch08Data) {
  // Fix chapter ID if needed
  if (ch08Data.chapter.id !== 8) {
    ch08Data.chapter.id = 8;
  }
  
  // Fix vocabulary chapter IDs
  if (ch08Data.vocabulary) {
    ch08Data.vocabulary = ch08Data.vocabulary.map(item => ({
      ...item,
      chapterId: 8,
      id: item.id.replace(/ch\d+_/, 'ch08_')
    }));
  }
  
  // Fix conversations chapter IDs
  if (ch08Data.conversations) {
    ch08Data.conversations = ch08Data.conversations.map(item => ({
      ...item,
      chapterId: 8,
      id: item.id.replace(/ch\d+_/, 'ch08_')
    }));
  }
  
  // Fix patterns chapter IDs
  if (ch08Data.patterns) {
    ch08Data.patterns = ch08Data.patterns.map(item => ({
      ...item,
      chapterId: 8,
      id: item.id.replace(/ch\d+_/, 'ch08_')
    }));
  }
  
  // Fix grammar chapter IDs
  if (ch08Data.grammar) {
    ch08Data.grammar = ch08Data.grammar.map(item => ({
      ...item,
      chapterId: 8,
      id: item.id.replace(/ch\d+_/, 'ch08_')
    }));
  }
  
  // Fix quiz chapter IDs
  if (ch08Data.quiz) {
    ch08Data.quiz = ch08Data.quiz.map(item => ({
      ...item,
      chapterId: 8,
      id: item.id.replace(/ch\d+_/, 'ch08_')
    }));
  }
  
  fs.writeFileSync('data/ch08.json', JSON.stringify(ch08Data, null, 2), 'utf8');
  console.log('✅ Chapter 8 restored\n');
} else {
  console.log('❌ No valid backup found for Chapter 8\n');
}

// Restore Chapter 10
console.log('=== Chapter 10 ===');
const ch10Data = getBestBackup(10);
if (ch10Data) {
  // Fix chapter ID if needed
  if (ch10Data.chapter.id !== 10) {
    ch10Data.chapter.id = 10;
  }
  
  // Fix vocabulary chapter IDs
  if (ch10Data.vocabulary) {
    ch10Data.vocabulary = ch10Data.vocabulary.map(item => ({
      ...item,
      chapterId: 10,
      id: item.id.replace(/ch\d+_/, 'ch10_')
    }));
  }
  
  // Fix conversations chapter IDs
  if (ch10Data.conversations) {
    ch10Data.conversations = ch10Data.conversations.map(item => ({
      ...item,
      chapterId: 10,
      id: item.id.replace(/ch\d+_/, 'ch10_')
    }));
  }
  
  // Fix patterns chapter IDs
  if (ch10Data.patterns) {
    ch10Data.patterns = ch10Data.patterns.map(item => ({
      ...item,
      chapterId: 10,
      id: item.id.replace(/ch\d+_/, 'ch10_')
    }));
  }
  
  // Fix grammar chapter IDs
  if (ch10Data.grammar) {
    ch10Data.grammar = ch10Data.grammar.map(item => ({
      ...item,
      chapterId: 10,
      id: item.id.replace(/ch\d+_/, 'ch10_')
    }));
  }
  
  // Fix quiz chapter IDs
  if (ch10Data.quiz) {
    ch10Data.quiz = ch10Data.quiz.map(item => ({
      ...item,
      chapterId: 10,
      id: item.id.replace(/ch\d+_/, 'ch10_')
    }));
  }
  
  fs.writeFileSync('data/ch10.json', JSON.stringify(ch10Data, null, 2), 'utf8');
  console.log('✅ Chapter 10 restored\n');
} else {
  console.log('❌ No valid backup found for Chapter 10\n');
}

console.log('=== Restoration Complete ===');
console.log('Now running corruption fix...');
