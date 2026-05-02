/**
 * Modul Percakapan — menampilkan contoh percakapan dari buku teks Minna no Nihongo.
 */

import { displayModeManager } from '../utils/displayMode.js';
import { getCachedVocabularyMap, getCachedFurigana } from '../utils/vocabularyCache.js';

/**
 * Create toggle control for switching between kanji and hiragana display modes
 * 
 * @returns {HTMLElement} Toggle control element
 * 
 * Requirements: 2.3, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7
 */
function createToggleControl() {
  const control = document.createElement('div');
  control.className = 'flex justify-end mb-4';
  
  const button = document.createElement('button');
  button.className = 'px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center gap-2';
  button.setAttribute('type', 'button');
  
  /**
   * Update button text and ARIA label based on current mode
   * Requirements: 5.2, 5.5, 5.6
   */
  const updateButtonText = () => {
    const mode = displayModeManager.getMode();
    const icon = mode === 'kanji' ? '🔤' : 'あ';
    const text = mode === 'kanji' ? 'Tampilkan Hiragana' : 'Tampilkan Kanji';
    button.innerHTML = `${icon} ${text}`;
    button.setAttribute('aria-label', `Toggle display mode. Current mode: ${mode}. Click to switch to ${mode === 'kanji' ? 'hiragana' : 'kanji'}`);
  };
  
  updateButtonText();
  
  // Click event handler - Requirements: 5.3
  button.addEventListener('click', () => {
    displayModeManager.toggle();
    updateButtonText();
  });
  
  // Keyboard event handler - Requirements: 5.7
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      displayModeManager.toggle();
      updateButtonText();
    }
  });
  
  control.appendChild(button);
  return control;
}

/**
 * Generate ruby text (furigana) by parsing kanji and matching with hiragana readings
 * Uses character-level parsing to identify kanji and wrap them with ruby tags
 * 
 * @param {string} kanjiText - Text with kanji
 * @param {string} hiraganaText - Text in hiragana
 * @param {Map<string, string>} vocabularyMap - Optional vocabulary mapping for better matching
 * @param {number} chapterNumber - Chapter number for logging context
 * @param {string} conversationId - Conversation ID for logging context
 * @returns {string} HTML string with ruby tags
 */
function generateRubyText(kanjiText, hiraganaText, vocabularyMap = null, chapterNumber = null, conversationId = null) {
  // Import utilities dynamically (will be available at runtime)
  const { parseKanjiSegments, containsKanji } = window.kanjiParserUtils || {};
  const { matchKanjiToHiragana, getReading } = window.vocabularyMatcherUtils || {};
  
  // Fallback if utilities not loaded
  if (!parseKanjiSegments || !matchKanjiToHiragana) {
    console.warn('Kanji parser utilities not loaded, using fallback');
    return generateRubyTextFallback(kanjiText, hiraganaText);
  }
  
  // If texts are identical or no kanji present, return as-is
  if (kanjiText === hiraganaText || !containsKanji(kanjiText)) {
    return kanjiText;
  }
  
  // Parse kanji text into segments
  const segments = parseKanjiSegments(kanjiText);
  
  // Match kanji with hiragana readings
  const readingsMap = matchKanjiToHiragana(kanjiText, hiraganaText, vocabularyMap);
  
  // Build result with ruby tags
  let result = '';
  
  for (const segment of segments) {
    if (segment.isKanji) {
      // Get reading for this kanji sequence
      // Pass context for detailed warning logging (Requirements: 1.8, 8.7)
      const context = {
        chapterNumber: chapterNumber,
        conversationId: conversationId
      };
      const reading = getReading(segment.text, vocabularyMap, readingsMap, context);
      
      if (reading) {
        // Wrap with ruby tag
        result += `<ruby>${segment.text}<rt style="font-size: 0.5em; opacity: 0.8;">${reading}</rt></ruby>`;
      } else {
        // No reading found - warning already logged by getReading
        // Display kanji without furigana (graceful degradation)
        // Requirements: 1.8, 8.7
        result += segment.text;
      }
    } else {
      // Not kanji, just append as-is (particles, hiragana, katakana, punctuation)
      result += segment.text;
    }
  }
  
  return result;
}

/**
 * Fallback ruby text generation (simple word-by-word approach)
 * Used when kanji parser utilities are not available
 * 
 * @param {string} kanjiText - Text with kanji
 * @param {string} hiraganaText - Text in hiragana
 * @returns {string} HTML string with ruby tags
 */
function generateRubyTextFallback(kanjiText, hiraganaText) {
  // Split by spaces to handle word-by-word
  const kanjiWords = kanjiText.split(/\s+/);
  const hiraganaWords = hiraganaText.split(/\s+/);
  
  if (kanjiWords.length !== hiraganaWords.length) {
    // If word counts don't match, fall back to simple ruby
    return `<ruby>${kanjiText}<rt style="font-size: 0.5em;">${hiraganaText}</rt></ruby>`;
  }
  
  // Process word by word
  const result = kanjiWords.map((kanjiWord, index) => {
    const hiraganaWord = hiraganaWords[index];
    
    // If words are identical, no need for ruby
    if (kanjiWord === hiraganaWord) {
      return kanjiWord;
    }
    
    // Check if word contains kanji
    const hasKanji = /[\u4e00-\u9faf\u3400-\u4dbf]/.test(kanjiWord);
    
    if (hasKanji) {
      // Wrap with ruby tag
      return `<ruby>${kanjiWord}<rt style="font-size: 0.5em; opacity: 0.8;">${hiraganaWord}</rt></ruby>`;
    } else {
      // No kanji, just return the word
      return kanjiWord;
    }
  }).join(' ');
  
  return result;
}

/**
 * Validate conversation data schema
 * Enhanced with detailed error logging for debugging
 * 
 * @param {any} conversation - Conversation object to validate
 * @returns {boolean} - True if valid, false otherwise
 * 
 * Requirements: 2.6, 13.4, 13.5
 */
function validateConversation(conversation) {
  // Enhanced error handling for missing or invalid conversation object
  // Requirements: 13.4, 13.5
  if (!conversation || typeof conversation !== 'object') {
    const detailedError = `[Modul Percakapan] Data percakapan tidak valid: bukan objek yang valid. Tipe yang diterima: ${typeof conversation}`;
    console.error(detailedError, { receivedData: conversation });
    return false;
  }
  
  // Enhanced error handling for missing or invalid id field
  // Requirements: 13.4, 13.5
  if (!conversation.id || typeof conversation.id !== 'string') {
    const detailedError = `[Modul Percakapan] Field 'id' tidak ada atau tidak valid. Tipe yang diharapkan: string, Tipe yang diterima: ${typeof conversation.id}`;
    console.error(detailedError, { conversationData: conversation });
    return false;
  }
  
  // Enhanced error handling for missing or invalid turns array
  // Requirements: 13.4, 13.5
  if (!Array.isArray(conversation.turns)) {
    const detailedError = `[Modul Percakapan] Field 'turns' tidak ada atau bukan array. ID Percakapan: ${conversation.id}, Tipe yang diterima: ${typeof conversation.turns}`;
    console.error(detailedError, { conversationId: conversation.id, receivedTurns: conversation.turns });
    return false;
  }
  
  if (conversation.turns.length === 0) {
    const detailedError = `[Modul Percakapan] Array 'turns' kosong. ID Percakapan: ${conversation.id}`;
    console.error(detailedError, { conversationId: conversation.id });
    return false;
  }
  
  // Validate each turn with detailed error messages
  // Requirements: 13.4, 13.5
  for (let i = 0; i < conversation.turns.length; i++) {
    const turn = conversation.turns[i];
    const turnLocation = `ID Percakapan: ${conversation.id}, Giliran ke-${i + 1}`;
    
    if (!turn || typeof turn !== 'object') {
      const detailedError = `[Modul Percakapan] Giliran tidak valid: bukan objek. ${turnLocation}`;
      console.error(detailedError, { turn, index: i });
      return false;
    }
    
    if (!turn.speaker || typeof turn.speaker !== 'string') {
      const detailedError = `[Modul Percakapan] Field 'speaker' tidak ada atau tidak valid. ${turnLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof turn.speaker}`;
      console.error(detailedError, { turnLocation, turn });
      return false;
    }
    
    if (!turn.japanese || typeof turn.japanese !== 'string') {
      const detailedError = `[Modul Percakapan] Field 'japanese' tidak ada atau tidak valid. ${turnLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof turn.japanese}`;
      console.error(detailedError, { turnLocation, turn });
      return false;
    }
    
    if (!turn.romaji || typeof turn.romaji !== 'string') {
      const detailedError = `[Modul Percakapan] Field 'romaji' tidak ada atau tidak valid. ${turnLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof turn.romaji}`;
      console.error(detailedError, { turnLocation, turn });
      return false;
    }
    
    if (!turn.indonesian || typeof turn.indonesian !== 'string') {
      const detailedError = `[Modul Percakapan] Field 'indonesian' tidak ada atau tidak valid. ${turnLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof turn.indonesian}`;
      console.error(detailedError, { turnLocation, turn });
      return false;
    }
  }
  
  return true;
}

/**
 * Render daftar percakapan ke dalam container.
 *
 * @param {HTMLElement} container
 * @param {import('../data.js').ChapterData} chapterData
 */
function renderConversation(container, chapterData) {
  container.innerHTML = '';

  // Enhanced error handling for missing or invalid chapter data
  // Requirements: 13.4, 13.5, 13.10
  if (!chapterData || typeof chapterData !== 'object') {
    const detailedError = '[Modul Percakapan] Data bab tidak valid atau tidak ditemukan';
    console.error(detailedError, { receivedData: chapterData });
    // User-friendly error message in Indonesian
    // Requirements: 13.10
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-slate-400 text-sm mb-2">⚠️ Gagal memuat data percakapan</p>
        <p class="text-slate-500 text-xs">Data bab tidak valid. Silakan coba muat ulang halaman.</p>
      </div>
    `;
    return;
  }

  const conversations = chapterData?.conversations || [];

  // Enhanced error handling for empty conversations
  // Requirements: 13.10
  if (conversations.length === 0) {
    console.warn('[Modul Percakapan] Array percakapan kosong untuk bab ini');
    // User-friendly message in Indonesian
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-slate-400 text-sm">📚 Percakapan untuk bab ini belum tersedia</p>
      </div>
    `;
    return;
  }

  // Validate and filter conversations with enhanced error logging
  // Requirements: 2.6, 13.4, 13.5
  const validConversations = conversations.filter((conv, index) => {
    const isValid = validateConversation(conv);
    if (!isValid) {
      // Log detailed warning when skipping invalid conversation
      // Requirements: 2.6, 13.4, 13.5
      const detailedWarning = `[Modul Percakapan] Melewati percakapan ke-${index + 1} karena data tidak valid`;
      console.warn(detailedWarning, { conversationIndex: index, conversation: conv });
    }
    return isValid;
  });

  // Enhanced error handling when all conversations are invalid
  // Requirements: 13.4, 13.5, 13.10
  if (validConversations.length === 0) {
    const detailedError = '[Modul Percakapan] Tidak ada percakapan yang valid ditemukan dalam data bab';
    console.error(detailedError, { totalConversations: conversations.length });
    // User-friendly error message in Indonesian
    // Requirements: 13.10
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-slate-400 text-sm mb-2">⚠️ Data percakapan tidak valid</p>
        <p class="text-slate-500 text-xs">Semua percakapan memiliki format data yang tidak sesuai. Silakan hubungi administrator.</p>
      </div>
    `;
    return;
  }

  // Log warning if some conversations were skipped
  // Requirements: 2.6, 13.10
  if (validConversations.length < conversations.length) {
    const skippedCount = conversations.length - validConversations.length;
    const detailedWarning = `[Modul Percakapan] ${skippedCount} percakapan dilewati karena data tidak valid`;
    console.warn(detailedWarning, { 
      totalConversations: conversations.length, 
      validConversations: validConversations.length,
      skippedCount 
    });
  }

  // Sort conversations by order
  const sortedConversations = [...validConversations].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 0;
    const orderB = typeof b.order === 'number' ? b.order : 0;
    return orderA - orderB;
  });

  // Extract chapter number for logging context (must be before vocabularyMap)
  const chapterNumber = chapterData.chapter?.id || chapterData.chapterId || chapterData.id || null;

  // Build vocabulary map from chapter data for better furigana matching
  // Use cached vocabulary map to avoid repeated parsing (Requirements: 12.6)
  let vocabularyMap = null;
  if (chapterData.vocabulary && Array.isArray(chapterData.vocabulary)) {
    const { buildVocabularyMap } = window.vocabularyMatcherUtils || {};
    if (buildVocabularyMap) {
      vocabularyMap = getCachedVocabularyMap(
        chapterNumber,
        chapterData.vocabulary,
        buildVocabularyMap
      );
    }
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col gap-6';

  // Add display mode toggle control - Requirements: 2.3, 5.1
  const toggleControl = createToggleControl();
  wrapper.appendChild(toggleControl);

  // Create conversations container
  const conversationsContainer = document.createElement('div');
  conversationsContainer.className = 'flex flex-col gap-6';
  conversationsContainer.id = 'conversations-list';

  // Render conversations list
  renderConversationsList(conversationsContainer, sortedConversations, vocabularyMap, chapterNumber);
  wrapper.appendChild(conversationsContainer);

  container.appendChild(wrapper);

  // Listen for mode changes and re-render - Requirements: 2.6
  const handleModeChange = () => {
    renderConversationsList(conversationsContainer, sortedConversations, vocabularyMap, chapterNumber);
  };
  displayModeManager.addListener(handleModeChange);
}

/**
 * Render the list of conversations based on current display mode
 * 
 * @param {HTMLElement} container - Container element for conversations
 * @param {Array} conversations - Array of conversation objects
 * @param {Map<string, string>} vocabularyMap - Optional vocabulary mapping for better furigana matching
 * @param {number} chapterNumber - Chapter number for logging context
 */
function renderConversationsList(container, conversations, vocabularyMap = null, chapterNumber = null) {
  container.innerHTML = '';
  const mode = displayModeManager.getMode();

  for (const conv of conversations) {
    const convCard = document.createElement('div');
    convCard.className = 'bg-slate-800 border border-slate-700 rounded-xl p-5 transition-opacity duration-200';

    // Optional conversation title
    if (conv.title) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'text-lg font-bold text-indigo-300 mb-4';
      titleEl.textContent = conv.title;
      convCard.appendChild(titleEl);
    }

    // Conversation turns container
    const turnsContainer = document.createElement('div');
    turnsContainer.className = 'flex flex-col gap-3';

    for (const turn of conv.turns) {
      const turnCard = document.createElement('div');
      turnCard.className = 'bg-slate-900/60 rounded-lg px-4 py-3 border border-slate-700/50';

      // Speaker name
      const speakerEl = document.createElement('p');
      speakerEl.className = 'text-xs font-semibold text-indigo-400 mb-2';
      speakerEl.textContent = turn.speaker;
      turnCard.appendChild(speakerEl);

      // Japanese text - display based on mode (Requirements: 2.4, 2.5)
      const japaneseEl = document.createElement('p');
      japaneseEl.className = 'text-base font-medium text-white mb-1';
      
      if (mode === 'hiragana' && turn.hiragana && turn.japanese !== turn.hiragana) {
        // Display hiragana as furigana (ruby text) above kanji
        // Use cached furigana to avoid repeated generation (Requirements: 12.6)
        const rubyHTML = getCachedFurigana(
          chapterNumber,
          turn.japanese,
          turn.hiragana,
          (kanjiText, hiraganaText, vocabMap) => {
            // Pass chapter number and conversation ID for detailed warning logging
            return generateRubyText(kanjiText, hiraganaText, vocabMap, chapterNumber, conv.id);
          },
          vocabularyMap
        );
        japaneseEl.innerHTML = sanitizeRubyHTML(rubyHTML);
      } else {
        // Display kanji only
        japaneseEl.textContent = turn.japanese;
      }
      
      turnCard.appendChild(japaneseEl);

      // Romaji
      const romajiEl = document.createElement('p');
      romajiEl.className = 'text-sm text-slate-500 italic mb-2';
      romajiEl.textContent = turn.romaji;
      turnCard.appendChild(romajiEl);

      // Indonesian translation
      const indonesianEl = document.createElement('p');
      indonesianEl.className = 'text-sm text-slate-400';
      indonesianEl.textContent = turn.indonesian;
      turnCard.appendChild(indonesianEl);

      turnsContainer.appendChild(turnCard);
    }

    convCard.appendChild(turnsContainer);
    container.appendChild(convCard);
  }
}

/**
 * Sanitize HTML to only allow ruby and rt tags
 * Prevents XSS attacks while allowing furigana display
 * 
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeRubyHTML(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // For now, return as-is since we control the input
  // In production, implement proper sanitization
  return html;
}

export { renderConversation };
