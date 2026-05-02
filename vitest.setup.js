// Setup file for vitest
// Provides global test utilities and mocks

// Mock localStorage for tests
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

// Load furigana utilities for tests
import * as kanjiParser from './js/utils/kanjiParser.js';
import * as vocabularyMatcher from './js/utils/vocabularyMatcher.js';

// Make utilities available globally
global.window = global.window || {};
global.window.kanjiParserUtils = kanjiParser;
global.window.vocabularyMatcherUtils = vocabularyMatcher;
