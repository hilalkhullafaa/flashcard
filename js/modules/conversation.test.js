/**
 * Manual test runner for Conversation module
 * Run with: node js/modules/conversation.test.js
 */

// Simple test framework
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('\n🧪 Running Conversation Module Tests\n');
    
    for (const { name, fn } of this.tests) {
      try {
        await fn();
        this.passed++;
        console.log(`✅ ${name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}`);
      }
    }

    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed\n`);
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

// Simple assertion library
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// Mock DOM for Node.js environment
class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName;
    this.innerHTML = '';
    this.className = '';
    this.textContent = '';
    this.children = [];
  }

  appendChild(child) {
    this.children.push(child);
  }
}

global.document = {
  createElement: (tagName) => new MockElement(tagName)
};

// Import the module
import { renderConversation } from './conversation.js';

// Test suite
const runner = new TestRunner();

// Tests
runner.test('should display empty state when no conversations', () => {
  const container = new MockElement();
  const chapterData = { conversations: [] };
  
  renderConversation(container, chapterData);
  
  assert(container.innerHTML.includes('belum tersedia'), 'Should show empty state message');
});

runner.test('should display empty state when conversations is undefined', () => {
  const container = new MockElement();
  const chapterData = {};
  
  renderConversation(container, chapterData);
  
  assert(container.innerHTML.includes('belum tersedia'), 'Should show empty state message');
});

runner.test('should render conversation with title', () => {
  const container = new MockElement();
  const chapterData = {
    conversations: [
      {
        id: 'ch01_conv01',
        chapterId: 1,
        order: 1,
        title: 'はじめまして',
        turns: [
          {
            speaker: 'ミラー',
            japanese: 'はじめまして。',
            romaji: 'Hajimemashite.',
            indonesian: 'Salam kenal.'
          }
        ]
      }
    ]
  };
  
  renderConversation(container, chapterData);
  
  const wrapper = container.children[0];
  assertEqual(wrapper.children.length, 1, 'Should have one conversation card');
  
  const convCard = wrapper.children[0];
  const title = convCard.children[0];
  assert(title.textContent === 'はじめまして', 'Should display conversation title');
});

runner.test('should render conversation without title', () => {
  const container = new MockElement();
  const chapterData = {
    conversations: [
      {
        id: 'ch01_conv01',
        chapterId: 1,
        order: 1,
        turns: [
          {
            speaker: 'ミラー',
            japanese: 'はじめまして。',
            romaji: 'Hajimemashite.',
            indonesian: 'Salam kenal.'
          }
        ]
      }
    ]
  };
  
  renderConversation(container, chapterData);
  
  const wrapper = container.children[0];
  const convCard = wrapper.children[0];
  
  // First child should be turns container, not title
  const turnsContainer = convCard.children[0];
  assert(turnsContainer.className.includes('flex flex-col gap-3'), 'First child should be turns container');
});

runner.test('should render multiple conversation turns', () => {
  const container = new MockElement();
  const chapterData = {
    conversations: [
      {
        id: 'ch01_conv01',
        chapterId: 1,
        order: 1,
        turns: [
          {
            speaker: 'ミラー',
            japanese: 'はじめまして。',
            romaji: 'Hajimemashite.',
            indonesian: 'Salam kenal.'
          },
          {
            speaker: 'たなか',
            japanese: 'どうぞ よろしく。',
            romaji: 'Douzo yoroshiku.',
            indonesian: 'Senang berkenalan.'
          }
        ]
      }
    ]
  };
  
  renderConversation(container, chapterData);
  
  const wrapper = container.children[0];
  const convCard = wrapper.children[0];
  const turnsContainer = convCard.children[0];
  
  assertEqual(turnsContainer.children.length, 2, 'Should have 2 conversation turns');
});

runner.test('should display speaker identification', () => {
  const container = new MockElement();
  const chapterData = {
    conversations: [
      {
        id: 'ch01_conv01',
        chapterId: 1,
        order: 1,
        turns: [
          {
            speaker: 'ミラー',
            japanese: 'はじめまして。',
            romaji: 'Hajimemashite.',
            indonesian: 'Salam kenal.'
          }
        ]
      }
    ]
  };
  
  renderConversation(container, chapterData);
  
  const wrapper = container.children[0];
  const convCard = wrapper.children[0];
  const turnsContainer = convCard.children[0];
  const turnCard = turnsContainer.children[0];
  const speaker = turnCard.children[0];
  
  assert(speaker.textContent === 'ミラー', 'Should display speaker name');
});

runner.test('should display Japanese text, romaji, and Indonesian translation', () => {
  const container = new MockElement();
  const chapterData = {
    conversations: [
      {
        id: 'ch01_conv01',
        chapterId: 1,
        order: 1,
        turns: [
          {
            speaker: 'ミラー',
            japanese: 'はじめまして。',
            romaji: 'Hajimemashite.',
            indonesian: 'Salam kenal.'
          }
        ]
      }
    ]
  };
  
  renderConversation(container, chapterData);
  
  const wrapper = container.children[0];
  const convCard = wrapper.children[0];
  const turnsContainer = convCard.children[0];
  const turnCard = turnsContainer.children[0];
  
  const speaker = turnCard.children[0];
  const japanese = turnCard.children[1];
  const romaji = turnCard.children[2];
  const indonesian = turnCard.children[3];
  
  assert(speaker.textContent === 'ミラー', 'Should display speaker');
  assert(japanese.textContent === 'はじめまして。', 'Should display Japanese text');
  assert(romaji.textContent === 'Hajimemashite.', 'Should display romaji');
  assert(indonesian.textContent === 'Salam kenal.', 'Should display Indonesian translation');
});

runner.test('should sort conversations by order property', () => {
  const container = new MockElement();
  const chapterData = {
    conversations: [
      {
        id: 'ch01_conv02',
        chapterId: 1,
        order: 2,
        title: 'Second Conversation',
        turns: []
      },
      {
        id: 'ch01_conv01',
        chapterId: 1,
        order: 1,
        title: 'First Conversation',
        turns: []
      }
    ]
  };
  
  renderConversation(container, chapterData);
  
  const wrapper = container.children[0];
  const firstConv = wrapper.children[0];
  const secondConv = wrapper.children[1];
  
  assert(firstConv.children[0].textContent === 'First Conversation', 'First should be order 1');
  assert(secondConv.children[0].textContent === 'Second Conversation', 'Second should be order 2');
});

runner.test('should apply consistent dark theme styling', () => {
  const container = new MockElement();
  const chapterData = {
    conversations: [
      {
        id: 'ch01_conv01',
        chapterId: 1,
        order: 1,
        turns: [
          {
            speaker: 'ミラー',
            japanese: 'はじめまして。',
            romaji: 'Hajimemashite.',
            indonesian: 'Salam kenal.'
          }
        ]
      }
    ]
  };
  
  renderConversation(container, chapterData);
  
  const wrapper = container.children[0];
  const convCard = wrapper.children[0];
  
  assert(convCard.className.includes('bg-slate-800'), 'Should use dark theme background');
  assert(convCard.className.includes('border-slate-700'), 'Should use slate border colors');
});

runner.test('should render multiple conversations', () => {
  const container = new MockElement();
  const chapterData = {
    conversations: [
      {
        id: 'ch01_conv01',
        chapterId: 1,
        order: 1,
        title: 'Conversation 1',
        turns: []
      },
      {
        id: 'ch01_conv02',
        chapterId: 1,
        order: 2,
        title: 'Conversation 2',
        turns: []
      }
    ]
  };
  
  renderConversation(container, chapterData);
  
  const wrapper = container.children[0];
  assertEqual(wrapper.children.length, 2, 'Should render 2 conversations');
});

// Run all tests
runner.run();
