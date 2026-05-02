/**
 * Furigana Utilities Loader
 * Makes kanji parser and vocabulary matcher utilities available globally
 */

import * as kanjiParser from './kanjiParser.js';
import * as vocabularyMatcher from './vocabularyMatcher.js';
import * as vocabularyCache from './vocabularyCache.js';

// Make utilities available globally for conversation module
window.kanjiParserUtils = kanjiParser;
window.vocabularyMatcherUtils = vocabularyMatcher;
window.vocabularyCacheUtils = vocabularyCache;

// Export for module usage
export { kanjiParser, vocabularyMatcher, vocabularyCache };
