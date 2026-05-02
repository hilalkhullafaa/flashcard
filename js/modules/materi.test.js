/**
 * Vitest tests for Materi module
 * Run with: npm test
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { renderMateri } from './materi.js';

// Mock DOM element for testing
class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName;
    this.innerHTML = '';
    this.className = '';
    this.textContent = '';
    this.children = [];
    this.style = {};
  }

  appendChild(child) {
    this.children.push(child);
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  getAttribute(name) {
    return this[name];
  }
}

describe('Materi Module', () => {
  let container;

  beforeEach(() => {
    container = new MockElement();
    // Mock document.createElement for each test
    global.document = {
      createElement: (tagName) => new MockElement(tagName)
    };
  });

  test('should display empty state when no patterns or grammar', () => {
    const chapterData = { patterns: [], grammar: [] };
    
    renderMateri(container, chapterData);
    
    expect(container.innerHTML).toContain('belum tersedia');
  });

  test('should display empty state when patterns and grammar are undefined', () => {
    const chapterData = {};
    
    renderMateri(container, chapterData);
    
    expect(container.innerHTML).toContain('belum tersedia');
  });

  test('should merge patterns and grammar arrays', () => {
    const chapterData = {
      patterns: [
        { id: 'p1', order: 1, pattern: 'Pattern 1', explanation: 'Exp 1', examples: [] }
      ],
      grammar: [
        { id: 'g1', order: 2, title: 'Grammar 1', explanation: 'Exp 2', examples: [] }
      ]
    };
    
    renderMateri(container, chapterData);
    
    expect(container.children.length).toBe(1);
    expect(container.children[0].children.length).toBe(2);
  });

  test('should sort merged entries by order property', () => {
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
    expect(list.children.length).toBe(4);
    
    // Check order by examining textContent of title elements
    const firstCard = list.children[0];
    const secondCard = list.children[1];
    const thirdCard = list.children[2];
    const fourthCard = list.children[3];
    
    expect(firstCard.children[1].textContent).toBe('Pattern 1');
    expect(secondCard.children[1].textContent).toBe('Grammar 2');
    expect(thirdCard.children[1].textContent).toBe('Pattern 3');
    expect(fourthCard.children[1].textContent).toBe('Grammar 4');
  });

  test('should display pattern entries with pattern field', () => {
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
    
    expect(badge.textContent).toBe('POLA');
    expect(title.textContent).toBe('N は N です');
  });

  test('should display grammar entries with title field', () => {
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
    
    expect(badge.textContent).toBe('TATA BAHASA');
    expect(title.textContent).toBe('Partikel は');
  });

  test('should display examples for entries', () => {
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
    
    expect(examplesList.children.length).toBe(1);
    expect(examplesList.children[0].innerHTML).toContain('わたしは がくせいです');
  });

  test('should handle entries without examples', () => {
    const chapterData = {
      patterns: [
        { id: 'p1', order: 1, pattern: 'Pattern', explanation: 'Explanation', examples: [] }
      ],
      grammar: []
    };
    
    renderMateri(container, chapterData);
    
    const card = container.children[0].children[0];
    // Should have badge, title, explanation only (no examples list)
    expect(card.children.length).toBe(3);
  });

  test('should handle missing patterns array gracefully', () => {
    const chapterData = {
      grammar: [
        { id: 'g1', order: 1, title: 'Grammar', explanation: 'Exp', examples: [] }
      ]
    };
    
    renderMateri(container, chapterData);
    
    expect(container.children[0].children.length).toBe(1);
  });

  test('should handle missing grammar array gracefully', () => {
    const chapterData = {
      patterns: [
        { id: 'p1', order: 1, pattern: 'Pattern', explanation: 'Exp', examples: [] }
      ]
    };
    
    renderMateri(container, chapterData);
    
    expect(container.children[0].children.length).toBe(1);
  });

  test('should apply correct styling classes', () => {
    const chapterData = {
      patterns: [
        { id: 'p1', order: 1, pattern: 'Pattern', explanation: 'Exp', examples: [] }
      ],
      grammar: []
    };
    
    renderMateri(container, chapterData);
    
    const list = container.children[0];
    expect(list.className).toContain('flex flex-col gap-4');
    
    const card = list.children[0];
    expect(card.className).toContain('bg-slate-800');
  });
});
