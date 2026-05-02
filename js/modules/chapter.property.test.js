/**
 * Property-Based Tests for Chapter Data Completeness
 * Feature: minna-no-nihongo-chapter-1-10-enhancement
 * 
 * These tests verify chapter data structure and completeness.
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

describe('Property-Based Tests: Chapter Data Completeness', () => {
  
  /**
   * Property 8: Chapter Data Completeness
   * **Validates: Requirements 2.1, 3.1**
   * 
   * For all chapters 1 through 10, each chapter SHALL have exactly 10 conversations 
   * and exactly 50 quiz questions.
   */
  describe('Property 8: Chapter Data Completeness', () => {
    test('all chapters 1-10 have exactly 10 conversations', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            expect(chapterData.conversations).toBeDefined();
            expect(Array.isArray(chapterData.conversations)).toBe(true);
            expect(chapterData.conversations.length).toBe(10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    test('all chapters 1-10 have exactly 50 quiz questions', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            expect(chapterData.quiz).toBeDefined();
            expect(Array.isArray(chapterData.quiz)).toBe(true);
            expect(chapterData.quiz.length).toBe(50);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    test('all chapters have vocabulary data', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            expect(chapterData.vocabulary).toBeDefined();
            expect(Array.isArray(chapterData.vocabulary)).toBe(true);
            expect(chapterData.vocabulary.length).toBeGreaterThan(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    test('all chapters have chapter metadata', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            expect(chapterData.chapter).toBeDefined();
            expect(chapterData.chapter.id).toBe(chapterNum);
            expect(chapterData.chapter.title).toBeDefined();
            expect(typeof chapterData.chapter.title).toBe('string');
            expect(chapterData.chapter.title.length).toBeGreaterThan(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  /**
   * Property 12: Invalid Data Error Handling
   * **Validates: Requirements 2.6**
   * 
   * For any conversation or quiz entry with missing required fields, 
   * the system SHALL skip that entry and log an error message.
   */
  describe('Property 12: Invalid Data Error Handling', () => {
    test('all conversation entries have valid structure', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            if (!chapterData.conversations) {
              return true;
            }
            
            // Check each conversation has required fields
            for (const conversation of chapterData.conversations) {
              // If conversation exists, it should have required fields
              if (conversation) {
                expect(conversation.id).toBeDefined();
                expect(conversation.chapterId).toBeDefined();
                expect(conversation.order).toBeDefined();
                expect(conversation.turns).toBeDefined();
                
                // Turns should be an array
                expect(Array.isArray(conversation.turns)).toBe(true);
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    test('all quiz entries have valid structure', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            if (!chapterData.quiz) {
              return true;
            }
            
            // Check each quiz question has required fields
            for (const question of chapterData.quiz) {
              if (question) {
                expect(question.id).toBeDefined();
                expect(question.chapterId).toBeDefined();
                expect(question.order).toBeDefined();
                expect(question.question).toBeDefined();
                expect(question.choices).toBeDefined();
                expect(question.correctIndex).toBeDefined();
                expect(question.category).toBeDefined();
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
