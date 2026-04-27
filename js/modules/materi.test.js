/**
 * Manual test runner for Materi module
 * Run with: node js/modules/materi.test.js
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
    console.log('\n🧪 Running Materi Module Tests\n');
    
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
import { renderMateri } from './materi.js';

// Test suite
const runner = new TestRunner();

// Tests
runner.test('should display empty state when no patterns or grammar', () => {
  const container = new MockElement();
  const chapterData = { patterns: [], grammar: [] };
  
  renderMateri(container, chapterData);
  
  assert(container.innerHTML.includes('belum tersedia'), 'Should show empty state message');
});

runner.test('should display empty state when patterns and grammar are undefined', () => {
  const container = new MockElement();
  const chapterData = {};
  
  renderMateri(container, chapterData);
  
  assert(container.innerHTML.includes('belum tersedia'), 'Should show empty state message');
});

runner.test('should merge patterns and grammar arrays', () => {
  const container = new MockElement();
  const chapterData = {
    patterns: [
      { id: 'p1', order: 1, pattern: 'Pattern 1', explanation: 'Exp 1', examples: [] }
    ],
    grammar: [
      { id: 'g1', order: 2, title: 'Grammar 1', explanation: 'Exp 2', examples: [] }
    ]
  };
  
  renderMateri(container, chapterData);
  
  assertEqual(container.children.length, 1, 'Should have one list container');
  assertEqual(container.children[0].children.length, 2, 'Should have 2 merged entries');
});

runner.test('should sort merged entries by order property', () => {
  const container = new MockElement();
  const chapterData = {
    patterns: [
      { id: 'p1', order: 3, pattern: 'Pattern 3', explanation: 'Exp 3', examples: [] },
      { id: 'p2', order: 1, pattern: 'Pattern 1', explanation: 'Exp 1', examples: [] }
    ],
    grammar: [
      { id: 'g1', order: 2, title: 'Grammar 2', explanation: 'Exp 2', examples: [] },
      { id: 'g2', order: 4, title: 'Grammar 4', explanation: 'Exp 4', examples: [] }
    ]
  };
  
  renderMateri(container, chapterData);
  
  const list = container.children[0];
  assertEqual(list.children.length, 4, 'Should have 4 entries');
  
  // Check order by examining textContent of title elements
  const firstCard = list.children[0];
  const secondCard = list.children[1];
  const thirdCard = list.children[2];
  const fourthCard = list.children[3];
  
  assert(firstCard.children[1].textContent === 'Pattern 1', 'First should be Pattern 1 (order 1)');
  assert(secondCard.children[1].textContent === 'Grammar 2', 'Second should be Grammar 2 (order 2)');
  assert(thirdCard.children[1].textContent === 'Pattern 3', 'Third should be Pattern 3 (order 3)');
  assert(fourthCard.children[1].textContent === 'Grammar 4', 'Fourth should be Grammar 4 (order 4)');
});

runner.test('should display pattern entries with pattern field', () => {
  const container = new MockElement();
  const chapterData = {
    patterns: [
      { id: 'p1', order: 1, pattern: 'N は N です', explanation: 'Identity pattern', examples: [] }
    ],
    grammar: []
  };
  
  renderMateri(container, chapterData);
  
  const card = container.children[0].children[0];
  const badge = card.children[0];
  const title = card.children[1];
  
  assert(badge.textContent === 'POLA', 'Badge should say POLA');
  assert(title.textContent === 'N は N です', 'Title should show pattern');
});

runner.test('should display grammar entries with title field', () => {
  const container = new MockElement();
  const chapterData = {
    patterns: [],
    grammar: [
      { id: 'g1', order: 1, title: 'Partikel は', explanation: 'Topic marker', examples: [] }
    ]
  };
  
  renderMateri(container, chapterData);
  
  const card = container.children[0].children[0];
  const badge = card.children[0];
  const title = card.children[1];
  
  assert(badge.textContent === 'TATA BAHASA', 'Badge should say TATA BAHASA');
  assert(title.textContent === 'Partikel は', 'Title should show grammar title');
});

runner.test('should display examples for entries', () => {
  const container = new MockElement();
  const chapterData = {
    patterns: [
      {
        id: 'p1',
        order: 1,
        pattern: 'N は N です',
        explanation: 'Identity',
        examples: [
          { japanese: 'わたしは がくせいです', romaji: 'Watashi wa gakusei desu', indonesian: 'Saya adalah pelajar' }
        ]
      }
    ],
    grammar: []
  };
  
  renderMateri(container, chapterData);
  
  const card = container.children[0].children[0];
  const examplesList = card.children[3]; // badge, title, explanation, examples
  
  assertEqual(examplesList.children.length, 1, 'Should have 1 example');
  assert(examplesList.children[0].innerHTML.includes('わたしは がくせいです'), 'Should show Japanese text');
});

runner.test('should handle entries without examples', () => {
  const container = new MockElement();
  const chapterData = {
    patterns: [
      { id: 'p1', order: 1, pattern: 'Pattern', explanation: 'Explanation', examples: [] }
    ],
    grammar: []
  };
  
  renderMateri(container, chapterData);
  
  const card = container.children[0].children[0];
  // Should have badge, title, explanation only (no examples list)
  assertEqual(card.children.length, 3, 'Should have 3 children (badge, title, explanation)');
});

runner.test('should handle missing patterns array gracefully', () => {
  const container = new MockElement();
  const chapterData = {
    grammar: [
      { id: 'g1', order: 1, title: 'Grammar', explanation: 'Exp', examples: [] }
    ]
  };
  
  renderMateri(container, chapterData);
  
  assertEqual(container.children[0].children.length, 1, 'Should have 1 grammar entry');
});

runner.test('should handle missing grammar array gracefully', () => {
  const container = new MockElement();
  const chapterData = {
    patterns: [
      { id: 'p1', order: 1, pattern: 'Pattern', explanation: 'Exp', examples: [] }
    ]
  };
  
  renderMateri(container, chapterData);
  
  assertEqual(container.children[0].children.length, 1, 'Should have 1 pattern entry');
});

runner.test('should apply correct styling classes', () => {
  const container = new MockElement();
  const chapterData = {
    patterns: [
      { id: 'p1', order: 1, pattern: 'Pattern', explanation: 'Exp', examples: [] }
    ],
    grammar: []
  };
  
  renderMateri(container, chapterData);
  
  const list = container.children[0];
  assert(list.className.includes('flex flex-col gap-4'), 'List should have correct classes');
  
  const card = list.children[0];
  assert(card.className.includes('bg-slate-800'), 'Card should have dark theme classes');
});

// Run all tests
runner.run();
