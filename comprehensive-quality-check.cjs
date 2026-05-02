const fs = require('fs');

console.log('=== COMPREHENSIVE QUALITY CHECK: CHAPTERS 1-10 ===\n');

const issues = [];

function checkForIssues(chapterId) {
  const filePath = `data/ch${String(chapterId).padStart(2, '0')}.json`;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    console.log(`\n📖 CHAPTER ${chapterId}: ${data.chapter.title}`);
    console.log('='.repeat(60));
    
    let chapterIssues = [];
    
    // Check chapter title
    if (data.chapter.title.includes('?') || data.chapter.title.includes('�')) {
      chapterIssues.push({
        type: 'Chapter Title',
        field: 'title',
        issue: 'Contains suspicious characters',
        value: data.chapter.title
      });
    }
    
    // Check conversations
    console.log('\n🗣️  CONVERSATIONS:');
    if (data.conversations && data.conversations.length > 0) {
      data.conversations.forEach((conv, idx) => {
        // Check conversation title
        if (conv.title && (conv.title.includes('â€"') || conv.title.includes('?') || conv.title.includes('�'))) {
          chapterIssues.push({
            type: 'Conversation Title',
            id: conv.id,
            issue: 'Suspicious characters in title',
            value: conv.title
          });
        }
        
        // Check turns
        conv.turns.forEach((turn, turnIdx) => {
          // Check speaker name
          if (turn.speaker && (turn.speaker.includes('?') || turn.speaker.includes('�') || turn.speaker.includes('ã'))) {
            chapterIssues.push({
              type: 'Speaker Name',
              id: conv.id,
              turn: turnIdx + 1,
              issue: 'Corrupted speaker name',
              value: turn.speaker
            });
          }
          
          // Check japanese text
          if (turn.japanese && (turn.japanese.includes('?') || turn.japanese.includes('�') || turn.japanese.includes('ã'))) {
            chapterIssues.push({
              type: 'Japanese Text',
              id: conv.id,
              turn: turnIdx + 1,
              issue: 'Corrupted Japanese text',
              value: turn.japanese.substring(0, 50) + '...'
            });
          }
          
          // Check for wrong vocabulary usage (hiragana where kanji should be)
          const suspiciousPatterns = [
            { pattern: /ぎんこう/g, correct: '銀行', word: 'bank' },
            { pattern: /がっこう/g, correct: '学校', word: 'school' },
            { pattern: /びょういん/g, correct: '病院', word: 'hospital' },
            { pattern: /としょかん/g, correct: '図書館', word: 'library' },
            { pattern: /でんしゃ/g, correct: '電車', word: 'train' },
            { pattern: /ひこうき/g, correct: '飛行機', word: 'airplane' },
            { pattern: /しんぶん/g, correct: '新聞', word: 'newspaper' },
            { pattern: /ざっし/g, correct: '雑誌', word: 'magazine' }
          ];
          
          suspiciousPatterns.forEach(({ pattern, correct, word }) => {
            if (pattern.test(turn.japanese)) {
              chapterIssues.push({
                type: 'Vocabulary Usage',
                id: conv.id,
                turn: turnIdx + 1,
                issue: `Should use kanji ${correct} instead of hiragana for ${word}`,
                value: turn.japanese.substring(0, 50) + '...'
              });
            }
          });
        });
      });
      
      console.log(`   ✓ ${data.conversations.length} conversations checked`);
    } else {
      console.log('   ⚠️  No conversations found');
    }
    
    // Check grammar
    console.log('\n📚 GRAMMAR:');
    if (data.grammar && data.grammar.length > 0) {
      data.grammar.forEach((gram, idx) => {
        // Check title
        if (gram.title && (gram.title.includes('?') || gram.title.includes('�') || gram.title.includes('ã'))) {
          chapterIssues.push({
            type: 'Grammar Title',
            id: gram.id,
            issue: 'Corrupted title',
            value: gram.title
          });
        }
        
        // Check explanation
        if (gram.explanation && (gram.explanation.includes('�') || gram.explanation.includes('ã‚') || gram.explanation.includes('ãƒ'))) {
          chapterIssues.push({
            type: 'Grammar Explanation',
            id: gram.id,
            issue: 'Corrupted explanation text',
            value: gram.explanation.substring(0, 100) + '...'
          });
        }
        
        // Check examples
        if (gram.examples) {
          gram.examples.forEach((ex, exIdx) => {
            if (ex.japanese && (ex.japanese.includes('?') || ex.japanese.includes('�') || ex.japanese.includes('ã'))) {
              chapterIssues.push({
                type: 'Grammar Example',
                id: gram.id,
                example: exIdx + 1,
                issue: 'Corrupted example text',
                value: ex.japanese
              });
            }
          });
        }
      });
      
      console.log(`   ✓ ${data.grammar.length} grammar entries checked`);
    } else {
      console.log('   ⚠️  No grammar entries found');
    }
    
    // Check patterns
    console.log('\n🔤 PATTERNS:');
    if (data.patterns && data.patterns.length > 0) {
      data.patterns.forEach((pat, idx) => {
        // Check pattern text
        if (pat.pattern && (pat.pattern.includes('?') || pat.pattern.includes('�') || pat.pattern.includes('ã'))) {
          chapterIssues.push({
            type: 'Pattern Text',
            id: pat.id,
            issue: 'Corrupted pattern',
            value: pat.pattern
          });
        }
        
        // Check explanation
        if (pat.explanation && (pat.explanation.includes('�') || pat.explanation.includes('ã‚') || pat.explanation.includes('ãƒ'))) {
          chapterIssues.push({
            type: 'Pattern Explanation',
            id: pat.id,
            issue: 'Corrupted explanation',
            value: pat.explanation.substring(0, 100) + '...'
          });
        }
        
        // Check examples
        if (pat.examples) {
          pat.examples.forEach((ex, exIdx) => {
            if (ex.japanese && (ex.japanese.includes('?') || ex.japanese.includes('�') || ex.japanese.includes('ã'))) {
              chapterIssues.push({
                type: 'Pattern Example',
                id: pat.id,
                example: exIdx + 1,
                issue: 'Corrupted example text',
                value: ex.japanese
              });
            }
          });
        }
      });
      
      console.log(`   ✓ ${data.patterns.length} patterns checked`);
    } else {
      console.log('   ⚠️  No patterns found');
    }
    
    // Check quiz
    console.log('\n❓ QUIZ:');
    if (data.quiz && data.quiz.length > 0) {
      data.quiz.forEach((q, idx) => {
        // Check question text
        if (q.question && (q.question.includes('�') || q.question.includes('ã‚') || q.question.includes('ãƒ'))) {
          chapterIssues.push({
            type: 'Quiz Question',
            id: q.id,
            issue: 'Corrupted question text',
            value: q.question.substring(0, 100) + '...'
          });
        }
        
        // Check choices
        if (q.choices) {
          q.choices.forEach((choice, choiceIdx) => {
            if (choice && (choice.includes('�') || choice.includes('ã‚') || choice.includes('ãƒ'))) {
              chapterIssues.push({
                type: 'Quiz Choice',
                id: q.id,
                choice: choiceIdx + 1,
                issue: 'Corrupted choice text',
                value: choice
              });
            }
          });
        }
      });
      
      console.log(`   ✓ ${data.quiz.length} quiz questions checked`);
    } else {
      console.log('   ⚠️  No quiz questions found');
    }
    
    // Summary for this chapter
    if (chapterIssues.length > 0) {
      console.log(`\n❌ FOUND ${chapterIssues.length} ISSUES:`);
      chapterIssues.forEach((issue, idx) => {
        console.log(`\n   ${idx + 1}. ${issue.type}${issue.id ? ` (${issue.id})` : ''}`);
        console.log(`      Issue: ${issue.issue}`);
        console.log(`      Value: ${issue.value}`);
      });
      issues.push(...chapterIssues.map(i => ({ chapter: chapterId, ...i })));
    } else {
      console.log('\n✅ NO ISSUES FOUND - Chapter is clean!');
    }
    
  } catch (error) {
    console.log(`\n❌ ERROR reading chapter ${chapterId}: ${error.message}`);
  }
}

// Check all chapters 1-10
for (let i = 1; i <= 10; i++) {
  checkForIssues(i);
}

// Final summary
console.log('\n\n' + '='.repeat(60));
console.log('📊 FINAL SUMMARY');
console.log('='.repeat(60));

if (issues.length === 0) {
  console.log('\n✅ ALL CHAPTERS ARE CLEAN!');
  console.log('   No suspicious characters or vocabulary issues found.');
} else {
  console.log(`\n❌ TOTAL ISSUES FOUND: ${issues.length}`);
  console.log('\nIssues by chapter:');
  
  for (let i = 1; i <= 10; i++) {
    const chapterIssues = issues.filter(issue => issue.chapter === i);
    if (chapterIssues.length > 0) {
      console.log(`   Chapter ${i}: ${chapterIssues.length} issues`);
    }
  }
  
  console.log('\nIssues by type:');
  const issueTypes = {};
  issues.forEach(issue => {
    issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1;
  });
  
  Object.entries(issueTypes).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`);
  });
  
  // Save detailed report
  fs.writeFileSync('quality-check-report.json', JSON.stringify(issues, null, 2));
  console.log('\n📄 Detailed report saved to: quality-check-report.json');
}

console.log('\n' + '='.repeat(60));
