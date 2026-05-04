/**
 * Progress Tracker Module
 * Tracks vocabulary and kanji memorization progress across all chapters
 * Persists state to localStorage
 */

import { hasKanji } from '../utils.js';

class ProgressTracker {
  constructor() {
    this.vocabMemorized = new Set();
    this.kanjiMemorized = new Set();
    this.storageAvailable = true;
    this.storageWarningShown = false;
    // Cache for total counts to avoid recalculation
    this.cachedTotals = null;
    // Batch localStorage updates
    this.saveTimeout = null;
    // Reference to all chapters data for kanji text lookup
    this.allChaptersData = null;
    this.load();
  }

  /**
   * Set reference to all chapters data for kanji text lookup
   * @param {import('../data.js').ChapterData[]} allChaptersData - All chapter data
   */
  setChaptersData(allChaptersData) {
    if (!Array.isArray(allChaptersData)) {
      console.error('Invalid allChaptersData: not an array', allChaptersData);
      this.allChaptersData = null;
      return;
    }
    this.allChaptersData = allChaptersData;
    // Clear cached totals to force recalculation with new data
    this.cachedTotals = null;
    console.log('[ProgressTracker] Cache cleared, will recalculate totals on next getStats() call');
  }

  /**
   * Generate unique key for vocabulary item based on kanji+kana combination
   * @private
   * @param {Object} vocab - Vocabulary item with kanji and kana properties
   * @returns {string} Unique key in format "kanji|kana"
   */
  _getVocabUniqueKey(vocab) {
    if (!vocab) {
      return '|';
    }
    // Normalize strings by trimming whitespace
    const kanji = (vocab.kanji || '').trim();
    const kana = (vocab.kana || '').trim();
    return `${kanji}|${kana}`;
  }

  /**
   * Get vocabulary item by ID from all chapters data
   * @private
   * @param {string} vocabId - Vocabulary ID (e.g., "ch01_001")
   * @returns {Object|null} Vocabulary item or null if not found
   */
  _getVocabById(vocabId) {
    if (!this.allChaptersData || !Array.isArray(this.allChaptersData)) {
      return null;
    }

    for (const chapterData of this.allChaptersData) {
      if (chapterData && Array.isArray(chapterData.vocabulary)) {
        const vocab = chapterData.vocabulary.find(v => v && v.id === vocabId);
        if (vocab) {
          return vocab;
        }
      }
    }
    return null;
  }

  /**
   * Extract kanji text from vocabulary item
   * @private
   * @param {Object} vocab - Vocabulary item
   * @returns {string} Kanji text or empty string
   */
  _extractKanjiText(vocab) {
    if (!vocab || !vocab.kanji || typeof vocab.kanji !== 'string') {
      return '';
    }
    return vocab.kanji;
  }

  /**
   * Migrate old format vocabulary data to new format
   * For each vocabulary ID in vocabMemorized, find all vocabulary with same unique key
   * and add all matching vocabulary IDs to vocabMemorized
   * @private
   */
  _migrateVocabData() {
    // Skip migration if no chapters data available
    if (!this.allChaptersData || !Array.isArray(this.allChaptersData)) {
      return;
    }

    // Skip migration if no vocabulary data to migrate
    if (this.vocabMemorized.size === 0) {
      return;
    }

    // Track if migration is needed
    let migrationNeeded = false;
    const originalSize = this.vocabMemorized.size;
    
    // Create a copy of current IDs to iterate over
    const currentIds = Array.from(this.vocabMemorized);
    
    // For each vocabulary ID, find all vocabulary with same unique key
    for (const vocabId of currentIds) {
      const vocab = this._getVocabById(vocabId);
      if (!vocab) {
        continue;
      }

      // Generate unique key for this vocabulary
      const uniqueKey = this._getVocabUniqueKey(vocab);

      // Find all vocabulary items with the same unique key across all chapters
      for (const chapterData of this.allChaptersData) {
        if (chapterData && Array.isArray(chapterData.vocabulary)) {
          for (const v of chapterData.vocabulary) {
            if (v && this._getVocabUniqueKey(v) === uniqueKey) {
              // If this ID is not already in the set, migration is needed
              if (!this.vocabMemorized.has(v.id)) {
                this.vocabMemorized.add(v.id);
                migrationNeeded = true;
              }
            }
          }
        }
      }
    }

    // If migration was performed, save the migrated data and log
    if (migrationNeeded) {
      const newSize = this.vocabMemorized.size;
      console.log(`[Migration] Vocabulary progress migrated: ${originalSize} → ${newSize} IDs`);
      this.save();
    }
  }

  /**
   * Mark vocabulary as memorized
   * Synchronizes status across all chapters for vocabulary with same kanji+kana
   * @param {string} vocabId - Vocabulary ID (e.g., "ch01_001")
   */
  markVocabMemorized(vocabId) {
    // Look up the vocabulary item to get its unique key
    const vocab = this._getVocabById(vocabId);
    if (!vocab) {
      console.warn(`Vocabulary item not found: ${vocabId}`);
      // Still add the ID to maintain backward compatibility
      this.vocabMemorized.add(vocabId);
      this.save();
      return;
    }

    // Generate unique key for this vocabulary
    const uniqueKey = this._getVocabUniqueKey(vocab);

    // Find all vocabulary items with the same unique key across all chapters
    if (this.allChaptersData && Array.isArray(this.allChaptersData)) {
      for (const chapterData of this.allChaptersData) {
        if (chapterData && Array.isArray(chapterData.vocabulary)) {
          for (const v of chapterData.vocabulary) {
            if (v && this._getVocabUniqueKey(v) === uniqueKey) {
              // Add all matching vocabulary IDs to the memorized set
              this.vocabMemorized.add(v.id);
            }
          }
        }
      }
    } else {
      // Fallback: if no chapters data available, just add the single ID
      this.vocabMemorized.add(vocabId);
    }

    this.save();
  }

  /**
   * Mark vocabulary as forgotten
   * Synchronizes status removal across all chapters for vocabulary with same kanji+kana
   * @param {string} vocabId - Vocabulary ID
   */
  markVocabForgotten(vocabId) {
    // Look up the vocabulary item to get its unique key
    const vocab = this._getVocabById(vocabId);
    if (!vocab) {
      console.warn(`Vocabulary item not found: ${vocabId}`);
      // Still remove the ID to maintain backward compatibility
      this.vocabMemorized.delete(vocabId);
      this.save();
      return;
    }

    // Generate unique key for this vocabulary
    const uniqueKey = this._getVocabUniqueKey(vocab);

    // Find all vocabulary items with the same unique key across all chapters
    if (this.allChaptersData && Array.isArray(this.allChaptersData)) {
      for (const chapterData of this.allChaptersData) {
        if (chapterData && Array.isArray(chapterData.vocabulary)) {
          for (const v of chapterData.vocabulary) {
            if (v && this._getVocabUniqueKey(v) === uniqueKey) {
              // Remove all matching vocabulary IDs from the memorized set
              this.vocabMemorized.delete(v.id);
            }
          }
        }
      }
    } else {
      // Fallback: if no chapters data available, just remove the single ID
      this.vocabMemorized.delete(vocabId);
    }

    this.save();
  }

  /**
   * Mark kanji vocabulary as memorized
   * @param {string} vocabId - Vocabulary ID
   */
  markKanjiMemorized(vocabId) {
    // Look up vocabulary item by ID
    const vocab = this._getVocabById(vocabId);
    if (!vocab) {
      console.warn(`Vocabulary item not found: ${vocabId}`);
      return;
    }

    // Extract kanji text
    const kanjiText = this._extractKanjiText(vocab);
    
    // If no kanji or no actual kanji characters, return early
    if (!kanjiText || !hasKanji(kanjiText)) {
      return;
    }

    // Add kanji text to memorized set
    this.kanjiMemorized.add(kanjiText);
    this.save();
  }

  /**
   * Mark kanji vocabulary as forgotten
   * @param {string} vocabId - Vocabulary ID
   */
  markKanjiForgotten(vocabId) {
    // Look up vocabulary item by ID
    const vocab = this._getVocabById(vocabId);
    if (!vocab) {
      console.warn(`Vocabulary item not found: ${vocabId}`);
      return;
    }

    // Extract kanji text
    const kanjiText = this._extractKanjiText(vocab);
    
    // If no kanji or no actual kanji characters, return early
    if (!kanjiText || !hasKanji(kanjiText)) {
      return;
    }

    // Remove kanji text from memorized set
    this.kanjiMemorized.delete(kanjiText);
    this.save();
  }

  /**
   * Check if vocabulary is memorized
   * @param {string} vocabId - Vocabulary ID
   * @returns {boolean}
   */
  isVocabMemorized(vocabId) {
    return this.vocabMemorized.has(vocabId);
  }

  /**
   * Check if kanji is memorized
   * @param {string} vocabId - Vocabulary ID
   * @returns {boolean}
   */
  isKanjiMemorized(vocabId) {
    // Look up vocabulary item by ID
    const vocab = this._getVocabById(vocabId);
    if (!vocab) {
      return false;
    }

    // Extract kanji text
    const kanjiText = this._extractKanjiText(vocab);
    
    // If no kanji or no actual kanji characters, return false
    if (!kanjiText || !hasKanji(kanjiText)) {
      return false;
    }

    // Check if kanji text exists in memorized set
    return this.kanjiMemorized.has(kanjiText);
  }

  /**
   * Get all memorized vocabulary items with full details
   * @returns {Array<{id: string, kanji: string, kana: string, romaji: string, meaning: string, chapterId: number}>}
   */
  getMemorizedVocabList() {
    const result = [];
    
    if (!this.allChaptersData || !Array.isArray(this.allChaptersData)) {
      return result;
    }

    // Iterate through memorized vocab IDs
    for (const vocabId of this.vocabMemorized) {
      const vocab = this._getVocabById(vocabId);
      if (vocab) {
        // Extract chapter ID from vocab ID (e.g., "ch01_001" -> 1)
        const chapterIdMatch = vocabId.match(/ch(\d+)_/);
        const chapterId = chapterIdMatch ? parseInt(chapterIdMatch[1], 10) : 0;
        
        result.push({
          id: vocab.id,
          kanji: vocab.kanji || '',
          kana: vocab.kana || '',
          romaji: vocab.romaji || '',
          meaning: vocab.meaning || '',
          chapterId
        });
      }
    }

    // Sort by chapter ID for consistent ordering
    result.sort((a, b) => a.chapterId - b.chapterId);
    
    return result;
  }

  /**
   * Get all memorized kanji items with full details
   * @returns {Array<{kanjiText: string, vocab: {id: string, kanji: string, kana: string, romaji: string, meaning: string}, chapterId: number}>}
   */
  getMemorizedKanjiList() {
    const result = [];
    
    if (!this.allChaptersData || !Array.isArray(this.allChaptersData)) {
      return result;
    }

    // Iterate through memorized kanji texts
    for (const kanjiText of this.kanjiMemorized) {
      // Find the first vocabulary item with this kanji text
      let foundVocab = null;
      let chapterId = 0;
      
      for (const chapterData of this.allChaptersData) {
        if (chapterData && Array.isArray(chapterData.vocabulary)) {
          const vocab = chapterData.vocabulary.find(v => 
            v && v.kanji === kanjiText
          );
          
          if (vocab) {
            foundVocab = vocab;
            // Extract chapter ID from vocab ID
            const chapterIdMatch = vocab.id.match(/ch(\d+)_/);
            chapterId = chapterIdMatch ? parseInt(chapterIdMatch[1], 10) : 0;
            break;
          }
        }
      }
      
      if (foundVocab) {
        result.push({
          kanjiText,
          vocab: {
            id: foundVocab.id,
            kanji: foundVocab.kanji || '',
            kana: foundVocab.kana || '',
            romaji: foundVocab.romaji || '',
            meaning: foundVocab.meaning || ''
          },
          chapterId
        });
      }
    }

    // Sort by chapter ID for consistent ordering
    result.sort((a, b) => a.chapterId - b.chapterId);
    
    return result;
  }

  /**
   * Delete vocabulary from memorized list
   * @param {string} vocabId - Vocabulary ID to delete
   * @returns {boolean} Success status
   */
  deleteMemorizedVocab(vocabId) {
    if (!this.vocabMemorized.has(vocabId)) {
      return false;
    }
    
    this.vocabMemorized.delete(vocabId);
    this.save();
    return true;
  }

  /**
   * Delete kanji from memorized list
   * @param {string} kanjiText - Kanji text to delete
   * @returns {boolean} Success status
   */
  deleteMemorizedKanji(kanjiText) {
    if (!this.kanjiMemorized.has(kanjiText)) {
      return false;
    }
    
    this.kanjiMemorized.delete(kanjiText);
    this.save();
    return true;
  }

  /**
   * Get overall statistics with unique counting
   * @param {import('../data.js').ChapterData[]} allChaptersData - All chapter data
   * @returns {{
   *   vocab: { memorized: number, total: number, percentage: number },
   *   kanji: { memorized: number, total: number, percentage: number }
   * }}
   */
  getStats(allChaptersData) {
    let totalVocab = 0;
    let totalKanji = 0;

    // Validate input
    if (!Array.isArray(allChaptersData)) {
      console.error('Invalid allChaptersData: not an array', allChaptersData);
      return {
        vocab: { memorized: 0, total: 0, percentage: 0 },
        kanji: { memorized: 0, total: 0, percentage: 0 }
      };
    }

    try {
      // Use cached totals if available
      if (this.cachedTotals) {
        totalVocab = this.cachedTotals.vocab;
        totalKanji = this.cachedTotals.kanji;
      } else {
        // Calculate unique counts and cache totals
        // Use Map to track unique vocabulary by kanji|kana combination
        const uniqueVocabMap = new Map();
        // Use Set to track unique kanji texts
        const uniqueKanjiSet = new Set();
        
        console.log(`[ProgressTracker] Processing ${allChaptersData.length} chapters for deduplication`);
        
        let totalItems = 0;
        let duplicateCount = 0;
        
        for (const chapterData of allChaptersData) {
          if (chapterData && Array.isArray(chapterData.vocabulary)) {
            console.log(`[ProgressTracker] Chapter has ${chapterData.vocabulary.length} vocabulary items`);
            totalItems += chapterData.vocabulary.length;
            
            for (const vocab of chapterData.vocabulary) {
              if (!vocab) continue;
              
              // Normalize strings by trimming whitespace and converting to lowercase for kana
              const normalizedKanji = (vocab.kanji || '').trim();
              const normalizedKana = (vocab.kana || '').trim();
              
              // Track unique vocabulary by kanji|kana combination
              const vocabKey = `${normalizedKanji}|${normalizedKana}`;
              if (!uniqueVocabMap.has(vocabKey)) {
                uniqueVocabMap.set(vocabKey, vocab);
              } else {
                duplicateCount++;
              }
              
              // Track unique kanji texts (only actual kanji characters)
              if (normalizedKanji && normalizedKanji !== '' && hasKanji(normalizedKanji)) {
                uniqueKanjiSet.add(normalizedKanji);
              }
            }
          } else {
            console.warn('[ProgressTracker] Chapter data missing vocabulary array:', chapterData);
          }
        }
        
        console.log(`[ProgressTracker] Total items: ${totalItems}, Duplicates found: ${duplicateCount}`);
        
        console.log(`[ProgressTracker] Deduplication complete: ${uniqueVocabMap.size} unique vocab, ${uniqueKanjiSet.size} unique kanji`);
        
        totalVocab = uniqueVocabMap.size;
        totalKanji = uniqueKanjiSet.size;
        this.cachedTotals = { vocab: totalVocab, kanji: totalKanji };
        console.log(`[ProgressTracker] Calculated totals: vocab=${totalVocab}, kanji=${totalKanji} (cached for future calls)`);
      }

      // Count unique memorized vocabulary (deduplicate by kanji+kana)
      const uniqueMemorizedVocab = new Set();
      for (const vocabId of this.vocabMemorized) {
        const vocab = this._getVocabById(vocabId);
        if (vocab) {
          const uniqueKey = this._getVocabUniqueKey(vocab);
          uniqueMemorizedVocab.add(uniqueKey);
        }
      }
      const vocabMemorizedCount = uniqueMemorizedVocab.size;
      
      const kanjiMemorizedCount = this.kanjiMemorized.size;

      return {
        vocab: {
          memorized: vocabMemorizedCount,
          total: totalVocab,
          percentage: totalVocab === 0 ? 0 : Math.round((vocabMemorizedCount / totalVocab) * 100)
        },
        kanji: {
          memorized: kanjiMemorizedCount,
          total: totalKanji,
          percentage: totalKanji === 0 ? 0 : Math.round((kanjiMemorizedCount / totalKanji) * 100)
        }
      };
    } catch (error) {
      console.error('Error calculating progress stats:', error);
      return {
        vocab: { memorized: 0, total: 0, percentage: 0 },
        kanji: { memorized: 0, total: 0, percentage: 0 }
      };
    }
  }

  /**
   * Show warning message when localStorage is unavailable
   */
  showStorageWarning() {
    if (this.storageWarningShown) return;
    
    console.warn('⚠️ localStorage tidak tersedia. Progress tidak akan tersimpan setelah browser ditutup.');
    this.storageWarningShown = true;
    
    // Only show UI warning in browser environment
    if (typeof document === 'undefined') return;
    
    // Try to display a user-visible warning if possible
    const warningEl = document.createElement('div');
    warningEl.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-900/90 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg shadow-lg max-w-md text-sm';
    warningEl.innerHTML = `
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <div class="flex-1">
          <p class="font-semibold mb-1">Progress tidak dapat disimpan</p>
          <p class="text-xs">Penyimpanan browser tidak tersedia. Progress Anda akan hilang setelah menutup halaman.</p>
        </div>
        <button class="shrink-0 text-yellow-200 hover:text-white" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(warningEl);
    
    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      if (warningEl.parentElement) {
        warningEl.remove();
      }
    }, 8000);
  }

  /**
   * Load state from localStorage
   */
  load() {
    try {
      const vocabData = localStorage.getItem('mnn_vocab_progress');
      if (vocabData) {
        const parsed = JSON.parse(vocabData);
        if (Array.isArray(parsed)) {
          this.vocabMemorized = new Set(parsed);
          
          // Perform backward compatibility migration
          this._migrateVocabData();
        } else {
          console.warn('Invalid vocab progress data format, resetting');
          this.vocabMemorized = new Set();
        }
      }
    } catch (e) {
      console.warn('Failed to load vocab progress from localStorage:', e);
      this.vocabMemorized = new Set();
      if (e.name === 'SecurityError' || e.message.includes('localStorage')) {
        this.storageAvailable = false;
        this.showStorageWarning();
      }
    }

    try {
      const kanjiData = localStorage.getItem('mnn_kanji_progress');
      if (kanjiData) {
        const parsed = JSON.parse(kanjiData);
        if (Array.isArray(parsed)) {
          // Filter out invalid entries (vocab IDs instead of kanji text)
          // Valid kanji text should not contain underscore (vocab ID format: ch01_001)
          const validKanjiTexts = parsed.filter(item => {
            // Check if item is a string and doesn't look like a vocab ID
            if (typeof item !== 'string') return false;
            // Vocab IDs have format: ch##_###
            if (/^ch\d+_\d+$/.test(item)) {
              console.warn(`Removing invalid kanji entry (vocab ID): ${item}`);
              return false;
            }
            // Valid kanji text should have actual kanji characters
            if (!hasKanji(item)) {
              console.warn(`Removing invalid kanji entry (no kanji): ${item}`);
              return false;
            }
            return true;
          });
          
          this.kanjiMemorized = new Set(validKanjiTexts);
          
          // If we filtered out invalid entries, save the cleaned data
          if (validKanjiTexts.length !== parsed.length) {
            console.log(`Cleaned kanji progress: ${parsed.length} -> ${validKanjiTexts.length} entries`);
            this.save();
          }
        } else {
          console.warn('Invalid kanji progress data format, resetting');
          this.kanjiMemorized = new Set();
        }
      }
    } catch (e) {
      console.warn('Failed to load kanji progress from localStorage:', e);
      this.kanjiMemorized = new Set();
      if (e.name === 'SecurityError' || e.message.includes('localStorage')) {
        this.storageAvailable = false;
        this.showStorageWarning();
      }
    }
  }

  /**
   * Save state to localStorage (batched with debounce)
   */
  save() {
    if (!this.storageAvailable) {
      return; // Skip save if storage is unavailable
    }

    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Batch updates with 100ms debounce
    this.saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('mnn_vocab_progress', JSON.stringify([...this.vocabMemorized]));
      } catch (e) {
        console.warn('Failed to save vocab progress to localStorage:', e);
        if (e.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded, progress will not persist');
          this.storageAvailable = false;
          this.showStorageWarning();
        } else if (e.name === 'SecurityError' || e.message.includes('localStorage')) {
          this.storageAvailable = false;
          this.showStorageWarning();
        }
      }

      try {
        localStorage.setItem('mnn_kanji_progress', JSON.stringify([...this.kanjiMemorized]));
      } catch (e) {
        console.warn('Failed to save kanji progress to localStorage:', e);
        if (e.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded, progress will not persist');
          this.storageAvailable = false;
          this.showStorageWarning();
        } else if (e.name === 'SecurityError' || e.message.includes('localStorage')) {
          this.storageAvailable = false;
          this.showStorageWarning();
        }
      }
    }, 100);
  }
}

// Singleton instance
export const progressTracker = new ProgressTracker();
