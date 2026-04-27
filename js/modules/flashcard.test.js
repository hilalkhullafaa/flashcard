/**
 * Bug Condition Exploration Test for Flashcard Kanji Filter
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2, 2.3**
 * 
 * This test explores the bug condition where mode "Kanji Saja" incorrectly
 * displays vocabulary with hiragana/katakana in the kanji field.
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
 * When the test passes after implementing the fix, it confirms the expected behavior.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderFlashcard } from './flashcard.js';

describe('Flashcard Kanji Filter - Bug Condition Exploration', () => {
  let container;
  
  beforeEach(() => {
    // Create a fresh container for each test
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up container after each test
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  /**
   * Property 1: Bug Condition - Kanji Filter Validation
   * 
   * This property tests the bug condition where vocabulary with only hiragana
   * or katakana in the kanji field are incorrectly displayed in "Kanji Saja" mode.
   * 
   * Expected behavior (after fix):
   * - Vocabulary with only hiragana should NOT be displayed
   * - Vocabulary with only katakana should NOT be displayed
   * - Vocabulary with actual kanji should be displayed
   */
  
  it('should NOT display vocabulary with only hiragana in kanji field when mode is "Kanji Saja"', () => {
    // Test data with hiragana-only kanji field
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: 'あなた',  // Hiragana only - should NOT be displayed
          kana: 'あなた', 
          romaji: 'anata', 
          wordClass: 'nomina', 
          meaning: 'Anda/kamu' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: 'これ',  // Hiragana only - should NOT be displayed
          kana: 'これ', 
          romaji: 'kore', 
          wordClass: 'nomina', 
          meaning: 'ini' 
        },
        { 
          id: 'test_003', 
          chapterId: 1, 
          order: 3, 
          kanji: 'それ',  // Hiragana only - should NOT be displayed
          kana: 'それ', 
          romaji: 'sore', 
          wordClass: 'nomina', 
          meaning: 'itu' 
        }
      ]
    };

    // Render in Kanji mode
    renderFlashcard(container, chapterData, { mode: 'kanji' });

    // Check if empty state is shown (no kanji vocabulary available)
    const emptyStateMessage = container.querySelector('p');
    expect(emptyStateMessage).toBeTruthy();
    expect(emptyStateMessage.textContent).toContain('Tidak ada kosakata kanji');
    
    // Verify that the card element is NOT present (no vocabulary to display)
    const cardElement = container.querySelector('[role="button"]');
    expect(cardElement).toBeNull();
  });

  it('should NOT display vocabulary with only katakana in kanji field when mode is "Kanji Saja"', () => {
    // Test data with katakana-only kanji field
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: 'エンジニア',  // Katakana only - should NOT be displayed
          kana: 'エンジニア', 
          romaji: 'enjinia', 
          wordClass: 'nomina', 
          meaning: 'insinyur' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: 'ノート',  // Katakana only - should NOT be displayed
          kana: 'ノート', 
          romaji: 'nooto', 
          wordClass: 'nomina', 
          meaning: 'buku catatan' 
        },
        { 
          id: 'test_003', 
          chapterId: 1, 
          order: 3, 
          kanji: 'テレビ',  // Katakana only - should NOT be displayed
          kana: 'テレビ', 
          romaji: 'terebi', 
          wordClass: 'nomina', 
          meaning: 'televisi' 
        }
      ]
    };

    // Render in Kanji mode
    renderFlashcard(container, chapterData, { mode: 'kanji' });

    // Check if empty state is shown (no kanji vocabulary available)
    const emptyStateMessage = container.querySelector('p');
    expect(emptyStateMessage).toBeTruthy();
    expect(emptyStateMessage.textContent).toContain('Tidak ada kosakata kanji');
    
    // Verify that the card element is NOT present (no vocabulary to display)
    const cardElement = container.querySelector('[role="button"]');
    expect(cardElement).toBeNull();
  });

  it('should display vocabulary with actual kanji characters when mode is "Kanji Saja"', () => {
    // Test data with actual kanji
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私',  // Actual kanji - SHOULD be displayed
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: '会社員',  // Actual kanji - SHOULD be displayed
          kana: 'かいしゃいん', 
          romaji: 'kaishain', 
          wordClass: 'nomina', 
          meaning: 'karyawan perusahaan' 
        }
      ]
    };

    // Render in Kanji mode
    renderFlashcard(container, chapterData, { mode: 'kanji' });

    // Verify that the card element IS present (vocabulary with kanji should be displayed)
    const cardElement = container.querySelector('[role="button"]');
    expect(cardElement).toBeTruthy();
    
    // Verify that the indicator shows the correct count
    const indicator = container.querySelector('p.text-xs.text-slate-500');
    expect(indicator).toBeTruthy();
    expect(indicator.textContent).toContain('2'); // Should show "1 / 2"
  });

  it('should correctly filter mixed vocabulary (hiragana, katakana, and kanji) in "Kanji Saja" mode', () => {
    // Test data with mixed content
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: 'あなた',  // Hiragana only - should NOT be displayed
          kana: 'あなた', 
          romaji: 'anata', 
          wordClass: 'nomina', 
          meaning: 'Anda' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: '私',  // Actual kanji - SHOULD be displayed
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        },
        { 
          id: 'test_003', 
          chapterId: 1, 
          order: 3, 
          kanji: 'エンジニア',  // Katakana only - should NOT be displayed
          kana: 'エンジニア', 
          romaji: 'enjinia', 
          wordClass: 'nomina', 
          meaning: 'insinyur' 
        },
        { 
          id: 'test_004', 
          chapterId: 1, 
          order: 4, 
          kanji: '先生',  // Actual kanji - SHOULD be displayed
          kana: 'せんせい', 
          romaji: 'sensei', 
          wordClass: 'nomina', 
          meaning: 'guru' 
        },
        { 
          id: 'test_005', 
          chapterId: 1, 
          order: 5, 
          kanji: 'これ',  // Hiragana only - should NOT be displayed
          kana: 'これ', 
          romaji: 'kore', 
          wordClass: 'nomina', 
          meaning: 'ini' 
        }
      ]
    };

    // Render in Kanji mode
    renderFlashcard(container, chapterData, { mode: 'kanji' });

    // Verify that the card element IS present
    const cardElement = container.querySelector('[role="button"]');
    expect(cardElement).toBeTruthy();
    
    // Verify that only 2 vocabulary items are shown (the ones with actual kanji)
    const indicator = container.querySelector('p.text-xs.text-slate-500');
    expect(indicator).toBeTruthy();
    expect(indicator.textContent).toContain('2'); // Should show "1 / 2"
  });
});


/**
 * Preservation Property Tests for Flashcard
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**
 * 
 * These tests verify that mode "Semua Kosakata" and other functionality
 * remain unchanged after the fix. They establish baseline behavior that
 * must be preserved.
 * 
 * IMPORTANT: These tests should PASS on the current unfixed code to
 * establish baseline behavior that must be preserved.
 */

describe('Flashcard Preservation - All Vocabulary Mode Behavior', () => {
  let container;
  
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear();
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  /**
   * Property 2.1: Preservation - Mode "Semua Kosakata" displays all vocabulary
   * 
   * This property verifies that mode "Semua Kosakata" displays ALL vocabulary
   * entries regardless of whether they contain kanji, hiragana, or katakana.
   * 
   * **Validates: Requirement 3.1**
   */
  
  it('should display all vocabulary (including hiragana-only) in "Semua Kosakata" mode', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: 'あなた',  // Hiragana only
          kana: 'あなた', 
          romaji: 'anata', 
          wordClass: 'nomina', 
          meaning: 'Anda' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: 'これ',  // Hiragana only
          kana: 'これ', 
          romaji: 'kore', 
          wordClass: 'nomina', 
          meaning: 'ini' 
        },
        { 
          id: 'test_003', 
          chapterId: 1, 
          order: 3, 
          kanji: 'それ',  // Hiragana only
          kana: 'それ', 
          romaji: 'sore', 
          wordClass: 'nomina', 
          meaning: 'itu' 
        }
      ]
    };

    // Render in All mode (default)
    renderFlashcard(container, chapterData, { mode: 'all' });

    // Verify that the card element IS present (vocabulary should be displayed)
    const cardElement = container.querySelector('[role="button"]');
    expect(cardElement).toBeTruthy();
    
    // Verify that the indicator shows the correct count (all 3 vocabulary items)
    const indicator = container.querySelector('p.text-xs.text-slate-500');
    expect(indicator).toBeTruthy();
    expect(indicator.textContent).toContain('3'); // Should show "1 / 3"
  });

  it('should display all vocabulary (including katakana-only) in "Semua Kosakata" mode', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: 'エンジニア',  // Katakana only
          kana: 'エンジニア', 
          romaji: 'enjinia', 
          wordClass: 'nomina', 
          meaning: 'insinyur' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: 'ノート',  // Katakana only
          kana: 'ノート', 
          romaji: 'nooto', 
          wordClass: 'nomina', 
          meaning: 'buku catatan' 
        }
      ]
    };

    // Render in All mode
    renderFlashcard(container, chapterData, { mode: 'all' });

    // Verify that the card element IS present
    const cardElement = container.querySelector('[role="button"]');
    expect(cardElement).toBeTruthy();
    
    // Verify that the indicator shows the correct count (all 2 vocabulary items)
    const indicator = container.querySelector('p.text-xs.text-slate-500');
    expect(indicator).toBeTruthy();
    expect(indicator.textContent).toContain('2'); // Should show "1 / 2"
  });

  it('should display all vocabulary (mixed kanji, hiragana, katakana) in "Semua Kosakata" mode', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: 'あなた',  // Hiragana only
          kana: 'あなた', 
          romaji: 'anata', 
          wordClass: 'nomina', 
          meaning: 'Anda' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: '私',  // Actual kanji
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        },
        { 
          id: 'test_003', 
          chapterId: 1, 
          order: 3, 
          kanji: 'エンジニア',  // Katakana only
          kana: 'エンジニア', 
          romaji: 'enjinia', 
          wordClass: 'nomina', 
          meaning: 'insinyur' 
        },
        { 
          id: 'test_004', 
          chapterId: 1, 
          order: 4, 
          kanji: '先生',  // Actual kanji
          kana: 'せんせい', 
          romaji: 'sensei', 
          wordClass: 'nomina', 
          meaning: 'guru' 
        }
      ]
    };

    // Render in All mode
    renderFlashcard(container, chapterData, { mode: 'all' });

    // Verify that the card element IS present
    const cardElement = container.querySelector('[role="button"]');
    expect(cardElement).toBeTruthy();
    
    // Verify that the indicator shows the correct count (all 4 vocabulary items)
    const indicator = container.querySelector('p.text-xs.text-slate-500');
    expect(indicator).toBeTruthy();
    expect(indicator.textContent).toContain('4'); // Should show "1 / 4"
  });

  /**
   * Property 2.2: Preservation - Card display (front/back) works correctly
   * 
   * This property verifies that card flip functionality and display format
   * remain unchanged for both modes.
   * 
   * **Validates: Requirements 3.2, 3.3**
   */
  
  it('should display kanji and kana on front side in "Semua Kosakata" mode', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私', 
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        }
      ]
    };

    renderFlashcard(container, chapterData, { mode: 'all' });

    const cardElement = container.querySelector('[role="button"]');
    expect(cardElement).toBeTruthy();
    
    // Front side should show kanji and kana
    expect(cardElement.textContent).toContain('私');
    expect(cardElement.textContent).toContain('わたし');
    expect(cardElement.textContent).toContain('Ketuk untuk melihat arti');
  });

  it('should display romaji, meaning, and word class on back side when flipped', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私', 
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        }
      ]
    };

    renderFlashcard(container, chapterData, { mode: 'all' });

    const cardElement = container.querySelector('[role="button"]');
    
    // Flip the card
    cardElement.click();

    // Back side should show romaji, meaning, and word class
    expect(cardElement.textContent).toContain('watashi');
    expect(cardElement.textContent).toContain('saya');
    expect(cardElement.textContent).toContain('nomina');
  });

  it('should display kana on back side in "Kanji Saja" mode when flipped', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私', 
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        }
      ]
    };

    renderFlashcard(container, chapterData, { mode: 'kanji' });

    const cardElement = container.querySelector('[role="button"]');
    
    // Front side should only show kanji (not kana)
    expect(cardElement.textContent).toContain('私');
    expect(cardElement.textContent).not.toContain('わたし');
    
    // Flip the card
    cardElement.click();

    // Back side should show kana, romaji, meaning, and word class
    expect(cardElement.textContent).toContain('わたし');
    expect(cardElement.textContent).toContain('watashi');
    expect(cardElement.textContent).toContain('saya');
    expect(cardElement.textContent).toContain('nomina');
  });

  /**
   * Property 2.3: Preservation - Navigation buttons work correctly
   * 
   * This property verifies that navigation buttons (Previous, Next, Shuffle)
   * function correctly in both modes.
   * 
   * **Validates: Requirement 3.5**
   */
  
  it('should navigate to next card when "Berikutnya" button is clicked', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私', 
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: '先生', 
          kana: 'せんせい', 
          romaji: 'sensei', 
          wordClass: 'nomina', 
          meaning: 'guru' 
        }
      ]
    };

    renderFlashcard(container, chapterData, { mode: 'all' });

    const indicator = container.querySelector('p.text-xs.text-slate-500');
    expect(indicator.textContent).toContain('1 / 2');

    // Click next button
    const btnNext = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Berikutnya'));
    btnNext.click();

    // Should now show card 2
    expect(indicator.textContent).toContain('2 / 2');
  });

  it('should navigate to previous card when "Sebelumnya" button is clicked', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私', 
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: '先生', 
          kana: 'せんせい', 
          romaji: 'sensei', 
          wordClass: 'nomina', 
          meaning: 'guru' 
        }
      ]
    };

    renderFlashcard(container, chapterData, { mode: 'all' });

    // Navigate to card 2 first
    const btnNext = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Berikutnya'));
    btnNext.click();

    const indicator = container.querySelector('p.text-xs.text-slate-500');
    expect(indicator.textContent).toContain('2 / 2');

    // Click previous button
    const btnPrev = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Sebelumnya'));
    btnPrev.click();

    // Should now show card 1
    expect(indicator.textContent).toContain('1 / 2');
  });

  it('should shuffle cards when shuffle button is clicked', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私', 
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: '先生', 
          kana: 'せんせい', 
          romaji: 'sensei', 
          wordClass: 'nomina', 
          meaning: 'guru' 
        },
        { 
          id: 'test_003', 
          chapterId: 1, 
          order: 3, 
          kanji: '学生', 
          kana: 'がくせい', 
          romaji: 'gakusei', 
          wordClass: 'nomina', 
          meaning: 'pelajar' 
        }
      ]
    };

    renderFlashcard(container, chapterData, { mode: 'all' });

    const cardElement = container.querySelector('[role="button"]');
    const firstCardText = cardElement.textContent;

    // Click shuffle button
    const btnShuffle = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('🔀'));
    btnShuffle.click();

    // Card should reset to index 0 (but order may be different due to shuffle)
    const indicator = container.querySelector('p.text-xs.text-slate-500');
    expect(indicator.textContent).toContain('1 / 3');
    
    // Note: We can't reliably test if order changed due to randomness,
    // but we can verify the functionality doesn't crash
    expect(cardElement).toBeTruthy();
  });

  /**
   * Property 2.4: Preservation - Progress tracking works correctly
   * 
   * This property verifies that progress tracking (Sudah Ingat, Belum Ingat)
   * functions correctly and persists data properly.
   * 
   * **Validates: Requirement 3.6**
   */
  
  it('should update progress when "Sudah Ingat" button is clicked', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私', 
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        },
        { 
          id: 'test_002', 
          chapterId: 1, 
          order: 2, 
          kanji: '先生', 
          kana: 'せんせい', 
          romaji: 'sensei', 
          wordClass: 'nomina', 
          meaning: 'guru' 
        }
      ]
    };

    renderFlashcard(container, chapterData, { mode: 'all' });

    // Initial progress should be 0 / 2
    const progressArea = container.querySelector('[role="status"]');
    expect(progressArea.textContent).toContain('0 / 2');

    // Click "Sudah Ingat" button
    const btnRemember = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Sudah Ingat'));
    btnRemember.click();

    // Progress should update to 1 / 2
    expect(progressArea.textContent).toContain('1 / 2');
  });

  it('should update progress when "Belum Ingat" button is clicked after marking as remembered', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私', 
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        }
      ]
    };

    renderFlashcard(container, chapterData, { mode: 'all' });

    const progressArea = container.querySelector('[role="status"]');
    
    // Mark as remembered
    const btnRemember = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Sudah Ingat'));
    btnRemember.click();
    
    expect(progressArea.textContent).toContain('1 / 1');

    // Navigate back to the same card
    const btnPrev = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Sebelumnya'));
    btnPrev.click();

    // Mark as forgotten
    const btnForget = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Belum Ingat'));
    btnForget.click();

    // Progress should update back to 0 / 1
    expect(progressArea.textContent).toContain('0 / 1');
  });

  /**
   * Property 2.5: Preservation - localStorage persistence works correctly
   * 
   * This property verifies that mode selection is persisted to localStorage
   * and restored correctly.
   * 
   * **Validates: Requirement 3.7**
   */
  
  it('should persist mode selection to localStorage when switching modes', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私', 
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        }
      ]
    };

    // Render in All mode
    renderFlashcard(container, chapterData, { mode: 'all' });

    // Switch to Kanji mode
    const btnKanjiMode = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent === 'Kanji Saja');
    btnKanjiMode.click();

    // Verify localStorage was updated
    const savedMode = localStorage.getItem('mnn_flashcard_mode_ch1');
    expect(savedMode).toBe('kanji');
  });

  it('should restore mode selection from localStorage on render', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: '私', 
          kana: 'わたし', 
          romaji: 'watashi', 
          wordClass: 'nomina', 
          meaning: 'saya' 
        }
      ]
    };

    // Set mode in localStorage
    localStorage.setItem('mnn_flashcard_mode_ch1', 'kanji');

    // Render without specifying mode (should load from localStorage)
    renderFlashcard(container, chapterData);

    // Verify Kanji mode button is active
    const btnKanjiMode = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent === 'Kanji Saja');
    expect(btnKanjiMode.className).toContain('bg-indigo-600');
  });

  /**
   * Property 2.6: Preservation - Empty state handling works correctly
   * 
   * This property verifies that empty state messages are displayed correctly
   * when no vocabulary is available.
   * 
   * **Validates: Requirement 3.4**
   */
  
  it('should display empty state message when no vocabulary is available', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: []
    };

    renderFlashcard(container, chapterData, { mode: 'all' });

    // Should show empty state message
    expect(container.textContent).toContain('Kosakata untuk bab ini belum tersedia');
  });

  it('should display switch button when no kanji vocabulary in "Kanji Saja" mode', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: 'あなた',  // Hiragana only - no kanji
          kana: 'あなた', 
          romaji: 'anata', 
          wordClass: 'nomina', 
          meaning: 'Anda' 
        }
      ]
    };

    renderFlashcard(container, chapterData, { mode: 'kanji' });

    // Should show empty state with switch button
    expect(container.textContent).toContain('Tidak ada kosakata kanji di bab ini');
    
    const switchBtn = container.querySelector('#switchToAllMode');
    expect(switchBtn).toBeTruthy();
    expect(switchBtn.textContent).toContain('Lihat Semua Kosakata');
  });

  it('should switch to "Semua Kosakata" mode when switch button is clicked', () => {
    const chapterData = {
      chapter: { id: 1, title: 'Test Chapter' },
      vocabulary: [
        { 
          id: 'test_001', 
          chapterId: 1, 
          order: 1, 
          kanji: 'あなた',  // Hiragana only
          kana: 'あなた', 
          romaji: 'anata', 
          wordClass: 'nomina', 
          meaning: 'Anda' 
        }
      ]
    };

    renderFlashcard(container, chapterData, { mode: 'kanji' });

    // Click switch button
    const switchBtn = container.querySelector('#switchToAllMode');
    switchBtn.click();

    // Should now show the vocabulary card
    const cardElement = container.querySelector('[role="button"]');
    expect(cardElement).toBeTruthy();
    
    // Verify All mode button is active
    const btnAllMode = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent === 'Semua Kosakata');
    expect(btnAllMode.className).toContain('bg-indigo-600');
  });
});
