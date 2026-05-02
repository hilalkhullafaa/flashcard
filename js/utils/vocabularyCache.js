/**
 * Vocabulary Mapping Cache Utility
 * 
 * Caches kanji-to-hiragana mappings to avoid repeated parsing
 * and optimize furigana generation performance.
 * 
 * Requirements: 12.6, 12.7
 */

/**
 * Global cache for vocabulary mappings
 * Key: chapterId
 * Value: Map<kanji, hiragana>
 */
const vocabularyCache = new Map();

/**
 * Global cache for generated furigana
 * Key: `${chapterId}:${kanjiText}:${hiraganaText}`
 * Value: generated ruby HTML
 */
const furiganaCache = new Map();

/**
 * Get or build vocabulary map for a chapter
 * 
 * @param {number} chapterId - Chapter number
 * @param {Array} vocabularyArray - Array of vocabulary objects
 * @param {Function} buildVocabularyMap - Function to build vocabulary map
 * @returns {Map<string, string>} Vocabulary mapping
 * 
 * Requirements: 12.6
 */
export function getCachedVocabularyMap(chapterId, vocabularyArray, buildVocabularyMap) {
  // Check if already cached
  if (vocabularyCache.has(chapterId)) {
    return vocabularyCache.get(chapterId);
  }
  
  // Build and cache
  const vocabularyMap = buildVocabularyMap(vocabularyArray);
  vocabularyCache.set(chapterId, vocabularyMap);
  
  return vocabularyMap;
}

/**
 * Get cached furigana or generate and cache it
 * 
 * @param {number} chapterId - Chapter number
 * @param {string} kanjiText - Text with kanji
 * @param {string} hiraganaText - Text in hiragana
 * @param {Function} generateFn - Function to generate furigana
 * @param {Map<string, string>} vocabularyMap - Vocabulary mapping
 * @returns {string} Generated ruby HTML
 * 
 * Requirements: 12.6
 */
export function getCachedFurigana(chapterId, kanjiText, hiraganaText, generateFn, vocabularyMap) {
  // Create cache key
  const cacheKey = `${chapterId}:${kanjiText}:${hiraganaText}`;
  
  // Check if already cached
  if (furiganaCache.has(cacheKey)) {
    return furiganaCache.get(cacheKey);
  }
  
  // Generate and cache
  const result = generateFn(kanjiText, hiraganaText, vocabularyMap);
  furiganaCache.set(cacheKey, result);
  
  return result;
}

/**
 * Clear vocabulary cache for a specific chapter or all chapters
 * 
 * @param {number} [chapterId] - Optional chapter ID to clear, or clear all if not provided
 */
export function clearVocabularyCache(chapterId = null) {
  if (chapterId !== null) {
    vocabularyCache.delete(chapterId);
  } else {
    vocabularyCache.clear();
  }
}

/**
 * Clear furigana cache for a specific chapter or all chapters
 * 
 * @param {number} [chapterId] - Optional chapter ID to clear, or clear all if not provided
 */
export function clearFuriganaCache(chapterId = null) {
  if (chapterId !== null) {
    // Clear all entries for this chapter
    const keysToDelete = [];
    for (const key of furiganaCache.keys()) {
      if (key.startsWith(`${chapterId}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => furiganaCache.delete(key));
  } else {
    furiganaCache.clear();
  }
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
  vocabularyCache.clear();
  furiganaCache.clear();
}

/**
 * Get cache statistics for monitoring
 * 
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
  return {
    vocabularyCacheSize: vocabularyCache.size,
    furiganaCacheSize: furiganaCache.size,
    vocabularyCachedChapters: Array.from(vocabularyCache.keys()),
    estimatedMemoryUsage: estimateMemoryUsage()
  };
}

/**
 * Estimate memory usage of caches (rough estimate)
 * 
 * @returns {number} Estimated memory usage in bytes
 */
function estimateMemoryUsage() {
  let totalSize = 0;
  
  // Estimate vocabulary cache size
  for (const [key, map] of vocabularyCache.entries()) {
    totalSize += key.toString().length * 2; // Key size
    for (const [k, v] of map.entries()) {
      totalSize += (k.length + v.length) * 2; // Assume 2 bytes per char
    }
  }
  
  // Estimate furigana cache size
  for (const [key, value] of furiganaCache.entries()) {
    totalSize += (key.length + value.length) * 2; // Assume 2 bytes per char
  }
  
  return totalSize;
}

/**
 * Batch operations for optimized DOM updates
 * Collects multiple DOM operations and executes them in a single batch
 * to minimize reflows and repaints
 * 
 * Requirements: 12.7
 */
export class DOMBatchUpdater {
  constructor() {
    this.operations = [];
    this.scheduled = false;
  }
  
  /**
   * Add a DOM update operation to the batch
   * 
   * @param {Function} operation - Function that performs DOM update
   */
  addOperation(operation) {
    this.operations.push(operation);
    
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.executeBatch());
    }
  }
  
  /**
   * Execute all batched operations
   */
  executeBatch() {
    // Use DocumentFragment for batch DOM updates
    const fragment = document.createDocumentFragment();
    
    // Execute all operations
    for (const operation of this.operations) {
      try {
        operation(fragment);
      } catch (error) {
        console.error('DOM batch operation failed:', error);
      }
    }
    
    // Clear operations
    this.operations = [];
    this.scheduled = false;
  }
  
  /**
   * Clear all pending operations
   */
  clear() {
    this.operations = [];
    this.scheduled = false;
  }
}

/**
 * Create a singleton DOM batch updater
 */
export const domBatchUpdater = new DOMBatchUpdater();
