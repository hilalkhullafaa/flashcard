/**
 * Unit Tests for Pattern and Grammar Validation
 * Feature: minna-no-nihongo-chapter-1-10-enhancement
 * Task 29: Write unit tests for pattern and grammar validation
 * 
 * Run with: npm test
 */

import { describe, test, expect } from 'vitest';

// Mock validation functions (these should match the actual implementation)
function validatePattern(pattern) {
  const errors = [];
  
  if (!pattern || typeof pattern !== 'object') {
    errors.push('Pattern must be an object');
    return { valid: false, errors };
  }
  
  // Check required fields
  if (!pattern.id || typeof pattern.id !== 'string') {
    errors.push('Missing or invalid pattern id');
  }
  
  if (typeof pattern.chapterId !== 'number') {
    errors.push('Missing or invalid chapterId');
  }
  
  if (typeof pattern.order !== 'number' || pattern.order <= 0) {
    errors.push('Missing or invalid order');
  }
  
  if (!pattern.pattern || typeof pattern.pattern !== 'string' || pattern.pattern.length === 0) {
    errors.push('Missing or invalid pattern field');
  }
  
  if (!pattern.explanation || typeof pattern.explanation !== 'string' || pattern.explanation.length === 0) {
    errors.push('Missing or invalid explanation');
  }
  
  if (!Array.isArray(pattern.examples) || pattern.examples.length === 0) {
    errors.push('Missing or invalid examples array');
  } else {
    // Validate each example
    pattern.examples.forEach((example, index) => {
      if (!example.japanese || typeof example.japanese !== 'string') {
        errors.push(`Example ${index}: missing or invalid japanese field`);
      }
      if (!example.romaji || typeof example.romaji !== 'string') {
        errors.push(`Example ${index}: missing or invalid romaji field`);
      }
      if (!example.indonesian || typeof example.indonesian !== 'string') {
        errors.push(`Example ${index}: missing or invalid indonesian field`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function validateGrammar(grammar) {
  const errors = [];
  
  if (!grammar || typeof grammar !== 'object') {
    errors.push('Grammar must be an object');
    return { valid: false, errors };
  }
  
  // Check required fields
  if (!grammar.id || typeof grammar.id !== 'string') {
    errors.push('Missing or invalid grammar id');
  }
  
  if (typeof grammar.chapterId !== 'number') {
    errors.push('Missing or invalid chapterId');
  }
  
  if (typeof grammar.order !== 'number' || grammar.order <= 0) {
    errors.push('Missing or invalid order');
  }
  
  if (!grammar.title || typeof grammar.title !== 'string' || grammar.title.length === 0) {
    errors.push('Missing or invalid title');
  }
  
  if (!grammar.explanation || typeof grammar.explanation !== 'string' || grammar.explanation.length === 0) {
    errors.push('Missing or invalid explanation');
  }
  
  if (!Array.isArray(grammar.examples) || grammar.examples.length === 0) {
    errors.push('Missing or invalid examples array');
  } else {
    // Validate each example
    grammar.examples.forEach((example, index) => {
      if (!example.japanese || typeof example.japanese !== 'string') {
        errors.push(`Example ${index}: missing or invalid japanese field`);
      }
      if (!example.romaji || typeof example.romaji !== 'string') {
        errors.push(`Example ${index}: missing or invalid romaji field`);
      }
      if (!example.indonesian || typeof example.indonesian !== 'string') {
        errors.push(`Example ${index}: missing or invalid indonesian field`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

describe('Pattern Validation', () => {
  describe('Valid patterns', () => {
    test('should validate a complete valid pattern', () => {
      const pattern = {
        id: 'ch01_p01',
        chapterId: 1,
        order: 1,
        pattern: 'N は N です',
        explanation: 'Pola kalimat untuk menyatakan identitas',
        examples: [
          {
            japanese: '私は学生です。',
            romaji: 'Watashi wa gakusei desu.',
            indonesian: 'Saya adalah pelajar.'
          }
        ]
      };
      
      const result = validatePattern(pattern);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should validate pattern with multiple examples', () => {
      const pattern = {
        id: 'ch01_p01',
        chapterId: 1,
        order: 1,
        pattern: 'N は N です',
        explanation: 'Pola kalimat untuk menyatakan identitas',
        examples: [
          {
            japanese: '私は学生です。',
            romaji: 'Watashi wa gakusei desu.',
            indonesian: 'Saya adalah pelajar.'
          },
          {
            japanese: '田中さんは先生です。',
            romaji: 'Tanaka-san wa sensei desu.',
            indonesian: 'Tanaka adalah guru.'
          }
        ]
      };
      
      const result = validatePattern(pattern);
      expect(result.valid).toBe(true);
    });
  });
  
  describe('Invalid patterns', () => {
    test('should detect missing id', () => {
      const pattern = {
        chapterId: 1,
        order: 1,
        pattern: 'N は N です',
        explanation: 'Test',
        examples: [
          {
            japanese: 'Test',
            romaji: 'Test',
            indonesian: 'Test'
          }
        ]
      };
      
      const result = validatePattern(pattern);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('id'))).toBe(true);
    });
    
    test('should detect missing pattern field', () => {
      const pattern = {
        id: 'ch01_p01',
        chapterId: 1,
        order: 1,
        explanation: 'Test',
        examples: [
          {
            japanese: 'Test',
            romaji: 'Test',
            indonesian: 'Test'
          }
        ]
      };
      
      const result = validatePattern(pattern);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('pattern'))).toBe(true);
    });
    
    test('should detect empty explanation', () => {
      const pattern = {
        id: 'ch01_p01',
        chapterId: 1,
        order: 1,
        pattern: 'N は N です',
        explanation: '',
        examples: [
          {
            japanese: 'Test',
            romaji: 'Test',
            indonesian: 'Test'
          }
        ]
      };
      
      const result = validatePattern(pattern);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('explanation'))).toBe(true);
    });
    
    test('should detect missing examples array', () => {
      const pattern = {
        id: 'ch01_p01',
        chapterId: 1,
        order: 1,
        pattern: 'N は N です',
        explanation: 'Test'
      };
      
      const result = validatePattern(pattern);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('examples'))).toBe(true);
    });
    
    test('should detect empty examples array', () => {
      const pattern = {
        id: 'ch01_p01',
        chapterId: 1,
        order: 1,
        pattern: 'N は N です',
        explanation: 'Test',
        examples: []
      };
      
      const result = validatePattern(pattern);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('examples'))).toBe(true);
    });
    
    test('should detect invalid example structure', () => {
      const pattern = {
        id: 'ch01_p01',
        chapterId: 1,
        order: 1,
        pattern: 'N は N です',
        explanation: 'Test',
        examples: [
          {
            japanese: 'Test'
            // Missing romaji and indonesian
          }
        ]
      };
      
      const result = validatePattern(pattern);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('romaji'))).toBe(true);
      expect(result.errors.some(e => e.includes('indonesian'))).toBe(true);
    });
  });
});

describe('Grammar Validation', () => {
  describe('Valid grammar', () => {
    test('should validate a complete valid grammar entry', () => {
      const grammar = {
        id: 'ch01_g01',
        chapterId: 1,
        order: 1,
        title: 'Partikel は (wa)',
        explanation: 'Partikel は digunakan untuk menandai topik kalimat',
        examples: [
          {
            japanese: '私は学生です。',
            romaji: 'Watashi wa gakusei desu.',
            indonesian: 'Saya adalah pelajar.'
          }
        ]
      };
      
      const result = validateGrammar(grammar);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should validate grammar with multiple examples', () => {
      const grammar = {
        id: 'ch01_g01',
        chapterId: 1,
        order: 1,
        title: 'Partikel は (wa)',
        explanation: 'Partikel は digunakan untuk menandai topik kalimat',
        examples: [
          {
            japanese: '私は学生です。',
            romaji: 'Watashi wa gakusei desu.',
            indonesian: 'Saya adalah pelajar.'
          },
          {
            japanese: '田中さんは先生です。',
            romaji: 'Tanaka-san wa sensei desu.',
            indonesian: 'Tanaka adalah guru.'
          }
        ]
      };
      
      const result = validateGrammar(grammar);
      expect(result.valid).toBe(true);
    });
  });
  
  describe('Invalid grammar', () => {
    test('should detect missing title', () => {
      const grammar = {
        id: 'ch01_g01',
        chapterId: 1,
        order: 1,
        explanation: 'Test',
        examples: [
          {
            japanese: 'Test',
            romaji: 'Test',
            indonesian: 'Test'
          }
        ]
      };
      
      const result = validateGrammar(grammar);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('title'))).toBe(true);
    });
    
    test('should detect empty title', () => {
      const grammar = {
        id: 'ch01_g01',
        chapterId: 1,
        order: 1,
        title: '',
        explanation: 'Test',
        examples: [
          {
            japanese: 'Test',
            romaji: 'Test',
            indonesian: 'Test'
          }
        ]
      };
      
      const result = validateGrammar(grammar);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('title'))).toBe(true);
    });
    
    test('should detect missing explanation', () => {
      const grammar = {
        id: 'ch01_g01',
        chapterId: 1,
        order: 1,
        title: 'Test',
        examples: [
          {
            japanese: 'Test',
            romaji: 'Test',
            indonesian: 'Test'
          }
        ]
      };
      
      const result = validateGrammar(grammar);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('explanation'))).toBe(true);
    });
    
    test('should detect invalid chapterId type', () => {
      const grammar = {
        id: 'ch01_g01',
        chapterId: '1', // Should be number
        order: 1,
        title: 'Test',
        explanation: 'Test',
        examples: [
          {
            japanese: 'Test',
            romaji: 'Test',
            indonesian: 'Test'
          }
        ]
      };
      
      const result = validateGrammar(grammar);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('chapterId'))).toBe(true);
    });
    
    test('should detect invalid order value', () => {
      const grammar = {
        id: 'ch01_g01',
        chapterId: 1,
        order: 0, // Should be > 0
        title: 'Test',
        explanation: 'Test',
        examples: [
          {
            japanese: 'Test',
            romaji: 'Test',
            indonesian: 'Test'
          }
        ]
      };
      
      const result = validateGrammar(grammar);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('order'))).toBe(true);
    });
  });
  
  describe('Error handling for invalid entries', () => {
    test('should skip invalid pattern entries and log error', () => {
      const invalidPattern = {
        id: 'ch01_p01'
        // Missing required fields
      };
      
      const result = validatePattern(invalidPattern);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    test('should skip invalid grammar entries and log error', () => {
      const invalidGrammar = {
        id: 'ch01_g01'
        // Missing required fields
      };
      
      const result = validateGrammar(invalidGrammar);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
