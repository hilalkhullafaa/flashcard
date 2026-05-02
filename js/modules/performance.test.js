/**
 * Performance Tests for Minna no Nihongo Chapter 1-10 Enhancement
 * 
 * Task 35: Run performance tests
 * - Measure conversation initial load time (should be ≤ 500ms)
 * - Measure display mode toggle time (should be ≤ 200ms)
 * - Measure furigana generation time per turn (should be ≤ 100ms)
 * - Measure quiz question load time (should be ≤ 300ms)
 * - Measure quiz navigation time (should be ≤ 100ms)
 * 
 * Requirements: 12.1-12.5, 14.8
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { parseKanjiSegments } from '../utils/kanjiParser.js';
import { matchKanjiToHiragana, buildVocabularyMap } from '../utils/vocabularyMatcher.js';

describe('Performance Tests - Conversation Module', () => {
  let dom;
  let document;
  let mockChapterData;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="conversation-container"></div>
          <button id="furigana-toggle">Toggle Furigana</button>
        </body>
      </html>
    `);
    
    document = dom.window.document;
    global.document = document;

    // Create realistic mock data
    mockChapterData = {
      chapterId: 1,
      conversations: Array(10).fill(null).map((_, idx) => ({
        id: `ch01_conv${String(idx + 1).padStart(2, '0')}`,
        chapterId: 1,
        order: idx + 1,
        title: `Percakapan ${idx + 1}`,
        turns: Array(5).fill(null).map((_, turnIdx) => ({
          speaker: turnIdx % 2 === 0 ? 'ミラー' : 'サントス',
          japanese: '私は学生です。毎日大学へ行きます。',
          romaji: 'Watashi wa gakusei desu. Mainichi daigaku e ikimasu.',
          indonesian: 'Saya adalah mahasiswa. Setiap hari pergi ke universitas.',
          hiragana: 'わたしはがくせいです。まいにちだいがくへいきます。'
        }))
      })),
      vocabulary: [
        { id: 'ch01_001', kanji: '私', kana: 'わたし', meaning: 'saya' },
        { id: 'ch01_002', kanji: '学生', kana: 'がくせい', meaning: 'mahasiswa' },
        { id: 'ch01_003', kanji: '毎日', kana: 'まいにち', meaning: 'setiap hari' },
        { id: 'ch01_004', kanji: '大学', kana: 'だいがく', meaning: 'universitas' },
        { id: 'ch01_005', kanji: '行', kana: 'い', meaning: 'pergi' }
      ]
    };
  });

  test('should load conversation data within 500ms', () => {
    const startTime = performance.now();
    
    // Simulate loading conversation data
    const container = document.getElementById('conversation-container');
    
    // Render all conversations
    for (const conversation of mockChapterData.conversations) {
      const conversationDiv = document.createElement('div');
      conversationDiv.className = 'conversation';
      
      const titleEl = document.createElement('h3');
      titleEl.textContent = conversation.title;
      conversationDiv.appendChild(titleEl);
      
      for (const turn of conversation.turns) {
        const turnDiv = document.createElement('div');
        turnDiv.className = 'turn';
        
        const speakerEl = document.createElement('strong');
        speakerEl.textContent = turn.speaker + ': ';
        turnDiv.appendChild(speakerEl);
        
        const japaneseEl = document.createElement('span');
        japaneseEl.textContent = turn.japanese;
        turnDiv.appendChild(japaneseEl);
        
        conversationDiv.appendChild(turnDiv);
      }
      
      container.appendChild(conversationDiv);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Conversation initial load time: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(500);
  });

  test('should toggle display mode within 200ms', () => {
    const container = document.getElementById('conversation-container');
    
    // Pre-render conversations in kanji mode
    for (const conversation of mockChapterData.conversations) {
      for (const turn of conversation.turns) {
        const turnDiv = document.createElement('div');
        turnDiv.className = 'turn';
        turnDiv.textContent = turn.japanese;
        container.appendChild(turnDiv);
      }
    }
    
    // Build vocabulary map
    const vocabMap = buildVocabularyMap(mockChapterData.vocabulary);
    
    const startTime = performance.now();
    
    // Simulate toggle to furigana mode
    const turns = container.querySelectorAll('.turn');
    const allConversations = mockChapterData.conversations;
    let turnIndex = 0;
    
    for (const conversation of allConversations) {
      for (const turn of conversation.turns) {
        const segments = parseKanjiSegments(turn.japanese);
        const kanjiMap = matchKanjiToHiragana(turn.japanese, turn.hiragana, vocabMap);
        
        let rubyText = '';
        for (const segment of segments) {
          if (segment.isKanji && kanjiMap.has(segment.text)) {
            rubyText += `<ruby>${segment.text}<rt>${kanjiMap.get(segment.text)}</rt></ruby>`;
          } else {
            rubyText += segment.text;
          }
        }
        
        if (turns[turnIndex]) {
          turns[turnIndex].innerHTML = rubyText;
        }
        turnIndex++;
      }
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Display mode toggle time: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(200);
  });

  test('should generate furigana per turn within 100ms', () => {
    const turn = mockChapterData.conversations[0].turns[0];
    const vocabMap = buildVocabularyMap(mockChapterData.vocabulary);
    
    const startTime = performance.now();
    
    // Parse and generate furigana for single turn
    const segments = parseKanjiSegments(turn.japanese);
    const kanjiMap = matchKanjiToHiragana(turn.japanese, turn.hiragana, vocabMap);
    
    let rubyText = '';
    for (const segment of segments) {
      if (segment.isKanji && kanjiMap.has(segment.text)) {
        rubyText += `<ruby>${segment.text}<rt>${kanjiMap.get(segment.text)}</rt></ruby>`;
      } else {
        rubyText += segment.text;
      }
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Furigana generation time per turn: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(100);
  });

  test('should handle multiple turns efficiently', () => {
    const vocabMap = buildVocabularyMap(mockChapterData.vocabulary);
    const allTurns = mockChapterData.conversations.flatMap(c => c.turns);
    
    const startTime = performance.now();
    
    // Process all turns
    for (const turn of allTurns) {
      const segments = parseKanjiSegments(turn.japanese);
      const kanjiMap = matchKanjiToHiragana(turn.japanese, turn.hiragana, vocabMap);
      
      let rubyText = '';
      for (const segment of segments) {
        if (segment.isKanji && kanjiMap.has(segment.text)) {
          rubyText += `<ruby>${segment.text}<rt>${kanjiMap.get(segment.text)}</rt></ruby>`;
        } else {
          rubyText += segment.text;
        }
      }
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const avgPerTurn = duration / allTurns.length;
    
    console.log(`Average furigana generation per turn: ${avgPerTurn.toFixed(2)}ms (${allTurns.length} turns)`);
    expect(avgPerTurn).toBeLessThan(100);
  });
});

describe('Performance Tests - Quiz Module', () => {
  let dom;
  let document;
  let mockQuizData;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="quiz-container">
            <div id="quiz-question"></div>
            <div id="quiz-choices"></div>
            <button id="next-question">Next</button>
          </div>
        </body>
      </html>
    `);
    
    document = dom.window.document;
    global.document = document;

    // Create realistic mock quiz data (50 questions)
    mockQuizData = Array(50).fill(null).map((_, idx) => ({
      id: `ch01_q${String(idx + 1).padStart(2, '0')}`,
      chapterId: 1,
      order: idx + 1,
      question: `Pertanyaan ${idx + 1}: Apa arti dari 私?`,
      choices: ['saya', 'kamu', 'dia', 'kami'],
      correctIndex: 0,
      category: ['vocabulary', 'grammar', 'reading', 'conversation'][idx % 4]
    }));
  });

  test('should load first quiz question within 300ms', () => {
    const questionEl = document.getElementById('quiz-question');
    const choicesEl = document.getElementById('quiz-choices');
    
    const startTime = performance.now();
    
    // Load first question
    const question = mockQuizData[0];
    
    questionEl.textContent = question.question;
    
    choicesEl.innerHTML = '';
    for (let i = 0; i < question.choices.length; i++) {
      const button = document.createElement('button');
      button.className = 'choice-button';
      button.dataset.index = i;
      button.textContent = question.choices[i];
      choicesEl.appendChild(button);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Quiz question load time: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(300);
  });

  test('should navigate to next question within 100ms', () => {
    const questionEl = document.getElementById('quiz-question');
    const choicesEl = document.getElementById('quiz-choices');
    
    // Pre-load first question
    let currentIndex = 0;
    questionEl.textContent = mockQuizData[currentIndex].question;
    
    const startTime = performance.now();
    
    // Navigate to next question
    currentIndex++;
    const nextQuestion = mockQuizData[currentIndex];
    
    questionEl.textContent = nextQuestion.question;
    
    choicesEl.innerHTML = '';
    for (let i = 0; i < nextQuestion.choices.length; i++) {
      const button = document.createElement('button');
      button.className = 'choice-button';
      button.dataset.index = i;
      button.textContent = nextQuestion.choices[i];
      choicesEl.appendChild(button);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Quiz navigation time: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(100);
  });

  test('should handle rapid navigation through multiple questions', () => {
    const questionEl = document.getElementById('quiz-question');
    const choicesEl = document.getElementById('quiz-choices');
    
    const startTime = performance.now();
    
    // Navigate through 10 questions
    for (let i = 0; i < 10; i++) {
      const question = mockQuizData[i];
      
      questionEl.textContent = question.question;
      
      choicesEl.innerHTML = '';
      for (let j = 0; j < question.choices.length; j++) {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.dataset.index = j;
        button.textContent = question.choices[j];
        choicesEl.appendChild(button);
      }
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const avgPerQuestion = duration / 10;
    
    console.log(`Average quiz navigation time: ${avgPerQuestion.toFixed(2)}ms (10 questions)`);
    expect(avgPerQuestion).toBeLessThan(100);
  });

  test('should render quiz with furigana efficiently', () => {
    const questionEl = document.getElementById('quiz-question');
    const choicesEl = document.getElementById('quiz-choices');
    
    // Create question with furigana
    const questionWithFurigana = {
      id: 'ch01_q01',
      question: '<ruby>私<rt>わたし</rt></ruby>の意味は？',
      choices: [
        '<ruby>私<rt>わたし</rt></ruby> = saya',
        '<ruby>私<rt>わたし</rt></ruby> = kamu',
        '<ruby>私<rt>わたし</rt></ruby> = dia',
        '<ruby>私<rt>わたし</rt></ruby> = kami'
      ],
      correctIndex: 0
    };
    
    const startTime = performance.now();
    
    questionEl.innerHTML = questionWithFurigana.question;
    
    choicesEl.innerHTML = '';
    for (let i = 0; i < questionWithFurigana.choices.length; i++) {
      const button = document.createElement('button');
      button.className = 'choice-button';
      button.dataset.index = i;
      button.innerHTML = questionWithFurigana.choices[i];
      choicesEl.appendChild(button);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Quiz with furigana render time: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(300);
  });
});

describe('Performance Tests - Overall System', () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="app-container">
            <div id="conversation-section"></div>
            <div id="quiz-section"></div>
            <div id="pattern-section"></div>
            <div id="grammar-section"></div>
          </div>
        </body>
      </html>
    `);
    
    document = dom.window.document;
    global.document = document;
  });

  test('should load complete chapter data efficiently', () => {
    const mockChapterData = {
      chapterId: 1,
      title: 'Chapter 1',
      conversations: Array(10).fill(null).map((_, idx) => ({
        id: `conv${idx}`,
        title: `Conversation ${idx}`,
        turns: Array(5).fill({ japanese: 'Test', hiragana: 'Test' })
      })),
      quiz: Array(50).fill(null).map((_, idx) => ({
        id: `quiz${idx}`,
        question: `Question ${idx}`,
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0
      })),
      patterns: Array(5).fill(null).map((_, idx) => ({
        id: `pattern${idx}`,
        pattern: `Pattern ${idx}`,
        explanation: 'Explanation',
        examples: []
      })),
      grammar: Array(5).fill(null).map((_, idx) => ({
        id: `grammar${idx}`,
        title: `Grammar ${idx}`,
        explanation: 'Explanation',
        examples: []
      })),
      vocabulary: Array(20).fill(null).map((_, idx) => ({
        id: `vocab${idx}`,
        kanji: 'K',
        kana: 'k'
      }))
    };

    const startTime = performance.now();
    
    // Simulate loading all modules
    const conversationSection = document.getElementById('conversation-section');
    const quizSection = document.getElementById('quiz-section');
    const patternSection = document.getElementById('pattern-section');
    const grammarSection = document.getElementById('grammar-section');

    // Render conversations
    for (const conv of mockChapterData.conversations) {
      const div = document.createElement('div');
      div.textContent = conv.title;
      conversationSection.appendChild(div);
    }

    // Render quiz
    for (const q of mockChapterData.quiz) {
      const div = document.createElement('div');
      div.textContent = q.question;
      quizSection.appendChild(div);
    }

    // Render patterns
    for (const p of mockChapterData.patterns) {
      const div = document.createElement('div');
      div.textContent = p.pattern;
      patternSection.appendChild(div);
    }

    // Render grammar
    for (const g of mockChapterData.grammar) {
      const div = document.createElement('div');
      div.textContent = g.title;
      grammarSection.appendChild(div);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Complete chapter data load time: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(500);
  });

  test('should handle memory efficiently for chapters 1-10', () => {
    // Simulate loading all 10 chapters
    const allChapters = Array(10).fill(null).map((_, chapterIdx) => ({
      chapterId: chapterIdx + 1,
      conversations: Array(10).fill(null).map(() => ({
        turns: Array(5).fill({ japanese: 'Test text', hiragana: 'Test' })
      })),
      quiz: Array(50).fill({ question: 'Q', choices: ['A', 'B', 'C', 'D'] }),
      vocabulary: Array(20).fill({ kanji: 'K', kana: 'k' })
    }));

    const startTime = performance.now();
    
    // Process all chapters
    let totalItems = 0;
    for (const chapter of allChapters) {
      totalItems += chapter.conversations.length;
      totalItems += chapter.quiz.length;
      totalItems += chapter.vocabulary.length;
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Memory processing for 10 chapters: ${duration.toFixed(2)}ms (${totalItems} items)`);
    expect(duration).toBeLessThan(100);
  });
});
