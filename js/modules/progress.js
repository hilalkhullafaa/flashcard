/**
 * Progress Tracker Module
 * Tracks vocabulary and kanji memorization progress across all chapters
 * Persists state to localStorage
 */

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
    this.load();
  }

  /**
   * Mark vocabulary as memorized
   * @param {string} vocabId - Vocabulary ID (e.g., "ch01_001")
   */
  markVocabMemorized(vocabId) {
    this.vocabMemorized.add(vocabId);
    this.save();
  }

  /**
   * Mark vocabulary as forgotten
   * @param {string} vocabId - Vocabulary ID
   */
  markVocabForgotten(vocabId) {
    this.vocabMemorized.delete(vocabId);
    this.save();
  }

  /**
   * Mark kanji vocabulary as memorized
   * @param {string} vocabId - Vocabulary ID
   */
  markKanjiMemorized(vocabId) {
    this.kanjiMemorized.add(vocabId);
    this.save();
  }

  /**
   * Mark kanji vocabulary as forgotten
   * @param {string} vocabId - Vocabulary ID
   */
  markKanjiForgotten(vocabId) {
    this.kanjiMemorized.delete(vocabId);
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
    return this.kanjiMemorized.has(vocabId);
  }

  /**
   * Get overall statistics
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
        // Calculate and cache totals
        for (const chapterData of allChaptersData) {
          if (chapterData && Array.isArray(chapterData.vocabulary)) {
            totalVocab += chapterData.vocabulary.length;
            totalKanji += chapterData.vocabulary.filter(v => v && v.kanji && v.kanji !== '').length;
          }
        }
        this.cachedTotals = { vocab: totalVocab, kanji: totalKanji };
      }

      const vocabMemorizedCount = this.vocabMemorized.size;
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
          this.kanjiMemorized = new Set(parsed);
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
