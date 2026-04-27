/**
 * Modul Percakapan — menampilkan contoh percakapan dari buku teks Minna no Nihongo.
 */

/**
 * Validate conversation data schema
 * @param {any} conversation - Conversation object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateConversation(conversation) {
  if (!conversation || typeof conversation !== 'object') {
    console.error('Invalid conversation: not an object', conversation);
    return false;
  }
  
  if (!conversation.id || typeof conversation.id !== 'string') {
    console.error('Invalid conversation: missing or invalid id', conversation);
    return false;
  }
  
  if (!Array.isArray(conversation.turns) || conversation.turns.length === 0) {
    console.error('Invalid conversation: missing or empty turns array', conversation);
    return false;
  }
  
  // Validate each turn
  for (const turn of conversation.turns) {
    if (!turn || typeof turn !== 'object') {
      console.error('Invalid conversation turn: not an object', turn);
      return false;
    }
    
    if (!turn.speaker || typeof turn.speaker !== 'string') {
      console.error('Invalid conversation turn: missing or invalid speaker', turn);
      return false;
    }
    
    if (!turn.japanese || typeof turn.japanese !== 'string') {
      console.error('Invalid conversation turn: missing or invalid japanese', turn);
      return false;
    }
    
    if (!turn.romaji || typeof turn.romaji !== 'string') {
      console.error('Invalid conversation turn: missing or invalid romaji', turn);
      return false;
    }
    
    if (!turn.indonesian || typeof turn.indonesian !== 'string') {
      console.error('Invalid conversation turn: missing or invalid indonesian', turn);
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

  // Handle missing or invalid chapter data
  if (!chapterData || typeof chapterData !== 'object') {
    console.error('Invalid chapter data provided to renderConversation');
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Gagal memuat data percakapan.</p>`;
    return;
  }

  const conversations = chapterData?.conversations || [];

  // Handle empty state
  if (conversations.length === 0) {
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Percakapan untuk bab ini belum tersedia.</p>`;
    return;
  }

  // Validate and filter conversations
  const validConversations = conversations.filter(conv => {
    const isValid = validateConversation(conv);
    if (!isValid) {
      console.warn('Skipping invalid conversation:', conv);
    }
    return isValid;
  });

  // Handle case where all conversations are invalid
  if (validConversations.length === 0) {
    console.error('No valid conversations found in chapter data');
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Data percakapan tidak valid.</p>`;
    return;
  }

  // Sort conversations by order
  const sortedConversations = [...validConversations].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 0;
    const orderB = typeof b.order === 'number' ? b.order : 0;
    return orderA - orderB;
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col gap-6';

  for (const conv of sortedConversations) {
    const convCard = document.createElement('div');
    convCard.className = 'bg-slate-800 border border-slate-700 rounded-xl p-5';

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

      // Japanese text
      const japaneseEl = document.createElement('p');
      japaneseEl.className = 'text-base font-medium text-white mb-1';
      japaneseEl.textContent = turn.japanese;
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
    wrapper.appendChild(convCard);
  }

  container.appendChild(wrapper);
}

export { renderConversation };
