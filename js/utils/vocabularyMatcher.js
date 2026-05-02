/**
 * Vocabulary Matcher Utility
 * Matches kanji words with their hiragana readings from vocabulary data
 * 
 * Requirements: 2.3, 2.6
 */

/**
 * Build a vocabulary map from chapter vocabulary data
 * Creates a mapping of kanji → hiragana readings
 * 
 * @param {Array} vocabularyArray - Array of vocabulary objects from chapter data
 * @returns {Map<string, string>} Map of kanji to hiragana readings
 * 
 * @example
 * buildVocabularyMap([
 *   { kanji: '私', kana: 'わたし' },
 *   { kanji: '学生', kana: 'がくせい' }
 * ])
 * // Returns: Map { '私' => 'わたし', '学生' => 'がくせい' }
 */
export function buildVocabularyMap(vocabularyArray) {
  const map = new Map();
  
  if (!Array.isArray(vocabularyArray)) {
    return map;
  }
  
  for (const vocab of vocabularyArray) {
    if (vocab && vocab.kanji && vocab.kana) {
      // Remove spaces from kanji and kana for matching
      const kanji = vocab.kanji.replace(/\s+/g, '');
      const kana = vocab.kana.replace(/\s+/g, '');
      
      if (kanji && kana) {
        map.set(kanji, kana);
      }
    }
  }
  
  return map;
}

/**
 * Find the longest matching kanji sequence from a given position
 * Tries to match the longest possible kanji sequence from vocabulary
 * 
 * @param {string} text - Japanese text
 * @param {number} startIndex - Starting position in text
 * @param {Map<string, string>} vocabularyMap - Vocabulary mapping
 * @returns {{kanji: string, reading: string, length: number} | null} Match result or null
 */
export function findLongestMatch(text, startIndex, vocabularyMap) {
  if (!text || startIndex >= text.length || !vocabularyMap) {
    return null;
  }
  
  let longestMatch = null;
  let maxLength = 0;
  
  // Try matching sequences of increasing length
  // Start from longest possible (up to 10 characters) down to 1
  const maxSearchLength = Math.min(10, text.length - startIndex);
  
  for (let length = maxSearchLength; length >= 1; length--) {
    const substring = text.substring(startIndex, startIndex + length);
    
    if (vocabularyMap.has(substring)) {
      const reading = vocabularyMap.get(substring);
      longestMatch = {
        kanji: substring,
        reading: reading,
        length: length
      };
      break; // Found longest match
    }
  }
  
  return longestMatch;
}

/**
 * Match kanji text with hiragana text to extract readings
 * Uses character-by-character alignment when vocabulary lookup fails
 * 
 * @param {string} kanjiText - Text with kanji
 * @param {string} hiraganaText - Full hiragana reading
 * @param {Map<string, string>} vocabularyMap - Vocabulary mapping
 * @returns {Map<string, string>} Map of kanji sequences to their readings
 */
export function matchKanjiToHiragana(kanjiText, hiraganaText, vocabularyMap) {
  const matches = new Map();
  
  if (!kanjiText || !hiraganaText) {
    return matches;
  }
  
  // Remove spaces for easier matching
  const kanjiClean = kanjiText.replace(/\s+/g, '');
  const hiraganaClean = hiraganaText.replace(/\s+/g, '');
  
  let kanjiIndex = 0;
  let hiraganaIndex = 0;
  
  while (kanjiIndex < kanjiClean.length && hiraganaIndex < hiraganaClean.length) {
    const kanjiChar = kanjiClean[kanjiIndex];
    const hiraganaChar = hiraganaClean[hiraganaIndex];
    
    // If characters match (both hiragana/katakana), move forward
    if (kanjiChar === hiraganaChar) {
      kanjiIndex++;
      hiraganaIndex++;
      continue;
    }
    
    // Try to find kanji sequence starting at current position
    const match = findLongestMatch(kanjiClean, kanjiIndex, vocabularyMap);
    
    if (match) {
      // Found in vocabulary
      matches.set(match.kanji, match.reading);
      kanjiIndex += match.length;
      hiraganaIndex += match.reading.length;
    } else {
      // Kanji not in vocabulary, try to extract reading from hiragana text
      // Collect all kanji characters in sequence
      let kanjiSequence = '';
      let k = kanjiIndex;
      while (k < kanjiClean.length && isKanji(kanjiClean[k])) {
        kanjiSequence += kanjiClean[k];
        k++;
      }
      
      if (kanjiSequence.length === 0) {
        // Not a kanji, skip
        kanjiIndex++;
        hiraganaIndex++;
        continue;
      }
      
      // Find the next matching character to determine reading length
      let readingLength = 1;
      let nextMatchIndex = -1;
      
      // Look ahead in kanji text for next non-kanji character
      const nextNonKanjiChar = k < kanjiClean.length ? kanjiClean[k] : null;
      
      if (nextNonKanjiChar) {
        // Find this character in hiragana text
        const foundIndex = hiraganaClean.indexOf(nextNonKanjiChar, hiraganaIndex);
        if (foundIndex !== -1) {
          nextMatchIndex = foundIndex;
          readingLength = foundIndex - hiraganaIndex;
        }
      }
      
      // If no match found, take remaining hiragana
      if (nextMatchIndex === -1) {
        readingLength = hiraganaClean.length - hiraganaIndex;
      }
      
      const reading = hiraganaClean.substring(hiraganaIndex, hiraganaIndex + readingLength);
      matches.set(kanjiSequence, reading);
      
      kanjiIndex = k;
      hiraganaIndex += readingLength;
    }
  }
  
  return matches;
}

/**
 * Helper function to check if a character is kanji
 * (Imported from kanjiParser but duplicated here for standalone use)
 */
function isKanji(char) {
  if (!char || char.length === 0) return false;
  
  const code = char.charCodeAt(0);
  return (code >= 0x4e00 && code <= 0x9faf) || 
         (code >= 0x3400 && code <= 0x4dbf);
}

/**
 * Get reading for a kanji sequence
 * First tries vocabulary map, then falls back to provided hiragana text
 * 
 * @param {string} kanji - Kanji sequence
 * @param {Map<string, string>} vocabularyMap - Vocabulary mapping
 * @param {Map<string, string>} fallbackMap - Fallback readings from text matching
 * @param {Object} context - Optional context for detailed warning logging
 * @param {number} context.chapterNumber - Chapter number
 * @param {string} context.conversationId - Conversation ID
 * @returns {string | null} Hiragana reading or null
 * 
 * Requirements: 1.8, 8.7
 */
export function getReading(kanji, vocabularyMap, fallbackMap, context = null) {
  if (!kanji) return null;
  
  // Try vocabulary map first
  if (vocabularyMap && vocabularyMap.has(kanji)) {
    return vocabularyMap.get(kanji);
  }
  
  // Try fallback map
  if (fallbackMap && fallbackMap.has(kanji)) {
    return fallbackMap.get(kanji);
  }
  
  // No match found - log detailed warning with context
  // Requirements: 1.8, 8.7
  if (context) {
    const contextInfo = [];
    if (context.chapterNumber !== null && context.chapterNumber !== undefined) {
      contextInfo.push(`Chapter ${context.chapterNumber}`);
    }
    if (context.conversationId) {
      contextInfo.push(`Conversation ${context.conversationId}`);
    }
    const contextStr = contextInfo.length > 0 ? ` (${contextInfo.join(', ')})` : '';
    
    console.warn(`[Vocabulary Matcher] Unknown kanji sequence not found in vocabulary: "${kanji}"${contextStr}`);
  } else {
    console.warn(`[Vocabulary Matcher] Unknown kanji sequence not found in vocabulary: "${kanji}"`);
  }
  
  return null;
}
