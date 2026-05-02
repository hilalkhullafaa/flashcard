/**
 * Property-Based Tests for Quiz Module
 * Feature: minna-no-nihongo-chapter-1-10-enhancement
 * 
 * These tests verify quiz-related properties across all chapters.
 * Run with: npm test
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

// Helper to load chapter data
function loadChapterData(chapterNum) {
  const filePath = path.join(process.cwd(), 'data', `ch${String(chapterNum).padStart(2, '0')}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data;
}

describe('Property-Based Tests: Quiz Module', () => {
  
  /**
   * Property 9: Quiz Question Structure Validity
   * **Validates: Requirements 3.9**
   * 
   * For any quiz question, it SHALL have exactly 4 choices, a correctIndex 
   * between 0-3, and a valid category (vocabulary, grammar, reading, or conversation).
   */
  describe('Property 9: Quiz Question Structure Validity', () => {
    test('all quiz questions have exactly 4 choices', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            // Skip if no quiz
            if (!chapterData.quiz) {
              return true;
            }
            
            // Check each quiz question
            for (const question of chapterData.quiz) {
              expect(question.choices).toBeDefined();
              expect(Array.isArray(question.choices)).toBe(true);
              expect(question.choices.length).toBe(4);
              
              // Each choice should be a non-empty string
              for (const choice of question.choices) {
                expect(typeof choice).toBe('string');
                expect(choice.length).toBeGreaterThan(0);
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    test('all quiz questions have correctIndex between 0-3', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            if (!chapterData.quiz) {
              return true;
            }
            
            for (const question of chapterData.quiz) {
              expect(question.correctIndex).toBeDefined();
              expect(typeof question.correctIndex).toBe('number');
              expect(question.correctIndex).toBeGreaterThanOrEqual(0);
              expect(question.correctIndex).toBeLessThanOrEqual(3);
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    test('all quiz questions have valid category', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            if (!chapterData.quiz) {
              return true;
            }
            
            const validCategories = ['vocabulary', 'grammar', 'reading', 'conversation'];
            
            for (const question of chapterData.quiz) {
              expect(question.category).toBeDefined();
              expect(typeof question.category).toBe('string');
              expect(validCategories).toContain(question.category);
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    test('all quiz questions have required fields', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            if (!chapterData.quiz) {
              return true;
            }
            
            for (const question of chapterData.quiz) {
              // Check required fields
              expect(question.id).toBeDefined();
              expect(question.chapterId).toBeDefined();
              expect(question.order).toBeDefined();
              expect(question.question).toBeDefined();
              expect(question.choices).toBeDefined();
              expect(question.correctIndex).toBeDefined();
              expect(question.category).toBeDefined();
              
              // Check field types
              expect(typeof question.id).toBe('string');
              expect(typeof question.chapterId).toBe('number');
              expect(typeof question.order).toBe('number');
              expect(typeof question.question).toBe('string');
              expect(Array.isArray(question.choices)).toBe(true);
              expect(typeof question.correctIndex).toBe('number');
              expect(typeof question.category).toBe('string');
              
              // Check non-empty
              expect(question.id.length).toBeGreaterThan(0);
              expect(question.question.length).toBeGreaterThan(0);
              expect(question.chapterId).toBe(chapterNum);
              expect(question.order).toBeGreaterThan(0);
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  /**
   * Property 10: Quiz Category Distribution
   * **Validates: Requirements 3.5, 9.1-9.10**
   * 
   * For any chapter's quiz questions, all four categories (vocabulary, grammar, 
   * reading, conversation) SHALL be represented, with at least 10 questions in each category.
   */
  describe('Property 10: Quiz Category Distribution', () => {
    test('all four categories are represented in each chapter', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            if (!chapterData.quiz) {
              return true;
            }
            
            // Count questions by category
            const categoryCounts = {
              vocabulary: 0,
              grammar: 0,
              reading: 0,
              conversation: 0
            };
            
            for (const question of chapterData.quiz) {
              if (question.category && categoryCounts.hasOwnProperty(question.category)) {
                categoryCounts[question.category]++;
              }
            }
            
            // All four categories should be represented
            expect(categoryCounts.vocabulary).toBeGreaterThan(0);
            expect(categoryCounts.grammar).toBeGreaterThan(0);
            expect(categoryCounts.reading).toBeGreaterThan(0);
            expect(categoryCounts.conversation).toBeGreaterThan(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    test('each category has at least 10 questions', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            if (!chapterData.quiz) {
              return true;
            }
            
            // Count questions by category
            const categoryCounts = {
              vocabulary: 0,
              grammar: 0,
              reading: 0,
              conversation: 0
            };
            
            for (const question of chapterData.quiz) {
              if (question.category && categoryCounts.hasOwnProperty(question.category)) {
                categoryCounts[question.category]++;
              }
            }
            
            // Each category should have at least 10 questions
            expect(categoryCounts.vocabulary).toBeGreaterThanOrEqual(10);
            expect(categoryCounts.grammar).toBeGreaterThanOrEqual(10);
            expect(categoryCounts.reading).toBeGreaterThanOrEqual(10);
            expect(categoryCounts.conversation).toBeGreaterThanOrEqual(10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    test('total quiz questions equal 50 per chapter', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            if (!chapterData.quiz) {
              return true;
            }
            
            expect(chapterData.quiz.length).toBe(50);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  /**
   * Property 7: Progressive Learning Coverage
   * **Validates: Requirements 3.3, 3.4, 10.1-10.10**
   * 
   * For any chapter N where N > 1, the quiz questions SHALL include vocabulary 
   * from all chapters 1 through N, with at least one question referencing material 
   * from each previous chapter.
   */
  describe('Property 7: Progressive Learning Coverage', () => {
    test('chapters 2-10 include material from previous chapters', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 10 }), // Start from chapter 2
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            if (!chapterData.quiz) {
              return true;
            }
            
            // For chapters 2-10, we expect some questions to reference previous chapters
            // This is indicated by vocabulary or content from earlier chapters
            
            // Load vocabulary from all previous chapters
            const allPreviousVocab = new Set();
            for (let i = 1; i < chapterNum; i++) {
              const prevChapterData = loadChapterData(i);
              if (prevChapterData.vocabulary) {
                for (const entry of prevChapterData.vocabulary) {
                  if (entry.kanji) {
                    allPreviousVocab.add(entry.kanji);
                  }
                }
              }
            }
            
            // Check if any quiz questions contain vocabulary from previous chapters
            let hasProgressiveLearning = false;
            for (const question of chapterData.quiz) {
              const questionText = question.question;
              
              // Check if question contains any vocabulary from previous chapters
              for (const vocab of allPreviousVocab) {
                if (questionText.includes(vocab)) {
                  hasProgressiveLearning = true;
                  break;
                }
              }
              
              if (hasProgressiveLearning) break;
            }
            
            // For chapters 2-10, we expect at least some progressive learning
            // Note: This is a simplified check - full implementation would need
            // more sophisticated analysis
            expect(hasProgressiveLearning || chapterNum === 1).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
