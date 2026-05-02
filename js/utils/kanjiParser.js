/**
 * Kanji Parser Utility
 * Identifies and extracts kanji characters from Japanese text
 * 
 * Requirements: 2.1, 2.2, 2.3
 */

/**
 * Check if a character is a kanji character
 * Uses Unicode ranges for CJK Unified Ideographs
 * 
 * @param {string} char - Single character to check
 * @returns {boolean} True if character is kanji
 */
export function isKanji(char) {
  if (!char || char.length === 0) return false;
  
  const code = char.charCodeAt(0);
  
  // CJK Unified Ideographs: U+4E00 to U+9FAF
  // CJK Extension A: U+3400 to U+4DBF
  return (code >= 0x4e00 && code <= 0x9faf) || 
         (code >= 0x3400 && code <= 0x4dbf);
}

/**
 * Check if a character is hiragana
 * 
 * @param {string} char - Single character to check
 * @returns {boolean} True if character is hiragana
 */
export function isHiragana(char) {
  if (!char || char.length === 0) return false;
  
  const code = char.charCodeAt(0);
  // Hiragana: U+3040 to U+309F
  return code >= 0x3040 && code <= 0x309f;
}

/**
 * Check if a character is katakana
 * 
 * @param {string} char - Single character to check
 * @returns {boolean} True if character is katakana
 */
export function isKatakana(char) {
  if (!char || char.length === 0) return false;
  
  const code = char.charCodeAt(0);
  // Katakana: U+30A0 to U+30FF
  return code >= 0x30a0 && code <= 0x30ff;
}

/**
 * Parse Japanese text and identify kanji sequences
 * Returns an array of segments, each marked as kanji or non-kanji
 * 
 * @param {string} text - Japanese text to parse
 * @returns {Array<{text: string, isKanji: boolean}>} Array of text segments
 * 
 * @example
 * parseKanjiSegments('私は学生です')
 * // Returns: [
 * //   { text: '私', isKanji: true },
 * //   { text: 'は', isKanji: false },
 * //   { text: '学生', isKanji: true },
 * //   { text: 'です', isKanji: false }
 * // ]
 */
export function parseKanjiSegments(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  const segments = [];
  let currentSegment = '';
  let currentIsKanji = null;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charIsKanji = isKanji(char);
    
    if (currentIsKanji === null) {
      // First character
      currentSegment = char;
      currentIsKanji = charIsKanji;
    } else if (currentIsKanji === charIsKanji) {
      // Same type as current segment, append
      currentSegment += char;
    } else {
      // Different type, save current segment and start new one
      segments.push({
        text: currentSegment,
        isKanji: currentIsKanji
      });
      currentSegment = char;
      currentIsKanji = charIsKanji;
    }
  }
  
  // Add the last segment
  if (currentSegment) {
    segments.push({
      text: currentSegment,
      isKanji: currentIsKanji
    });
  }
  
  return segments;
}

/**
 * Extract kanji characters from text
 * 
 * @param {string} text - Japanese text
 * @returns {string[]} Array of kanji characters/sequences
 */
export function extractKanji(text) {
  const segments = parseKanjiSegments(text);
  return segments
    .filter(segment => segment.isKanji)
    .map(segment => segment.text);
}

/**
 * Check if text contains any kanji characters
 * 
 * @param {string} text - Text to check
 * @returns {boolean} True if text contains kanji
 */
export function containsKanji(text) {
  if (!text || typeof text !== 'string') return false;
  
  for (let i = 0; i < text.length; i++) {
    if (isKanji(text[i])) {
      return true;
    }
  }
  
  return false;
}
