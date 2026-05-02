/**
 * Property-Based Tests for Conversation Module
 * Feature: minna-no-nihongo-chapter-1-10-enhancement
 * 
 * These tests verify universal properties that should hold true across all valid inputs.
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

describe('Property-Based Tests: Conversation Module', () => {
  
  /**
   * Property 4: Conversation Data Completeness
   * **Validates: Requirements 2.4, 2.5**
   * 
   * For any conversation turn in chapters 1-10, all required fields 
   * (speaker, japanese, romaji, indonesian, hiragana) SHALL be present 
   * and non-empty strings.
   */
  describe('Property 4: Conversation Data Completeness', () => {
    test('all conversation turns have required fields (speaker, japanese, romaji, indonesian, hiragana)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }), // Chapter number 1-10
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            // Skip if no conversations
            if (!chapterData.conversations || chapterData.conversations.length === 0) {
              return true;
            }
            
            // Check each conversation
            for (const conversation of chapterData.conversations) {
              // Check conversation has turns
              expect(conversation.turns).toBeDefined();
              expect(Array.isArray(conversation.turns)).toBe(true);
              expect(conversation.turns.length).toBeGreaterThan(0);
              
              // Check each turn has all required fields
              for (const turn of conversation.turns) {
                // Required fields must be present
                expect(turn.speaker).toBeDefined();
                expect(turn.japanese).toBeDefined();
                expect(turn.romaji).toBeDefined();
                expect(turn.indonesian).toBeDefined();
                expect(turn.hiragana).toBeDefined();
                
                // Required fields must be non-empty strings
                expect(typeof turn.speaker).toBe('string');
                expect(typeof turn.japanese).toBe('string');
                expect(typeof turn.romaji).toBe('string');
                expect(typeof turn.indonesian).toBe('string');
                expect(typeof turn.hiragana).toBe('string');
                
                expect(turn.speaker.length).toBeGreaterThan(0);
                expect(turn.japanese.length).toBeGreaterThan(0);
                expect(turn.romaji.length).toBeGreaterThan(0);
                expect(turn.indonesian.length).toBeGreaterThan(0);
                expect(turn.hiragana.length).toBeGreaterThan(0);
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    test('all conversations have valid structure (id, chapterId, order, turns)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (chapterNum) => {
            const chapterData = loadChapterData(chapterNum);
            
            if (!chapterData.conversations || chapterData.conversations.length === 0) {
              return true;
            }
            
            for (const conversation of chapterData.conversations) {
              // Check conversation structure
              expect(conversation.id).toBeDefined();
              expect(conversation.chapterId).toBeDefined();
              expect(conversation.order).toBeDefined();
              expect(conversation.turns).toBeDefined();
              
              expect(typeof conversation.id).toBe('string');
              expect(typeof conversation.chapterId).toBe('number');
              expect(typeof conversation.order).toBe('number');
              expect(Array.isArray(conversation.turns)).toBe(true);
              
              expect(conversation.chapterId).toBe(chapterNum);
              expect(conversation.order).toBeGreaterThan(0);
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
