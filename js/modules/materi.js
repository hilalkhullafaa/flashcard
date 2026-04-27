/**
 * Modul Materi — menggabungkan pola kalimat dan tata bahasa dalam satu tampilan.
 */

/**
 * Validate materi entry (pattern or grammar)
 * @param {any} entry - Entry to validate
 * @param {string} type - Entry type ('pattern' or 'grammar')
 * @returns {boolean} - True if valid, false otherwise
 */
function validateMateriEntry(entry, type) {
  if (!entry || typeof entry !== 'object') {
    console.error(`Invalid ${type} entry: not an object`, entry);
    return false;
  }
  
  if (type === 'pattern') {
    if (!entry.pattern || typeof entry.pattern !== 'string') {
      console.error('Invalid pattern entry: missing or invalid pattern field', entry);
      return false;
    }
  } else if (type === 'grammar') {
    if (!entry.title || typeof entry.title !== 'string') {
      console.error('Invalid grammar entry: missing or invalid title field', entry);
      return false;
    }
  }
  
  if (!entry.explanation || typeof entry.explanation !== 'string') {
    console.error(`Invalid ${type} entry: missing or invalid explanation`, entry);
    return false;
  }
  
  // Examples are optional, but if present should be an array
  if (entry.examples !== undefined && !Array.isArray(entry.examples)) {
    console.error(`Invalid ${type} entry: examples is not an array`, entry);
    return false;
  }
  
  return true;
}

/**
 * Render daftar materi (patterns + grammar) ke dalam container.
 *
 * @param {HTMLElement} container
 * @param {import('../data.js').ChapterData} chapterData
 */
function renderMateri(container, chapterData) {
  container.innerHTML = '';

  // Handle missing or invalid chapter data
  if (!chapterData || typeof chapterData !== 'object') {
    console.error('Invalid chapter data provided to renderMateri');
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Gagal memuat data materi.</p>`;
    return;
  }

  const patterns = chapterData?.patterns || [];
  const grammar = chapterData?.grammar || [];

  // Validate patterns array
  if (!Array.isArray(patterns)) {
    console.error('Invalid patterns data: not an array', patterns);
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Data pola kalimat tidak valid.</p>`;
    return;
  }

  // Validate grammar array
  if (!Array.isArray(grammar)) {
    console.error('Invalid grammar data: not an array', grammar);
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Data tata bahasa tidak valid.</p>`;
    return;
  }

  // Validate and merge patterns and grammar arrays
  const validPatterns = patterns.filter(p => {
    const isValid = validateMateriEntry(p, 'pattern');
    if (!isValid) {
      console.warn('Skipping invalid pattern entry:', p);
    }
    return isValid;
  });

  const validGrammar = grammar.filter(g => {
    const isValid = validateMateriEntry(g, 'grammar');
    if (!isValid) {
      console.warn('Skipping invalid grammar entry:', g);
    }
    return isValid;
  });

  const mergedEntries = [
    ...validPatterns.map(p => ({ ...p, type: 'pattern' })),
    ...validGrammar.map(g => ({ ...g, type: 'grammar' }))
  ];

  // Handle empty state
  if (mergedEntries.length === 0) {
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Materi untuk bab ini belum tersedia.</p>`;
    return;
  }

  // Sort by order property (with fallback for missing order)
  mergedEntries.sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 0;
    const orderB = typeof b.order === 'number' ? b.order : 0;
    return orderA - orderB;
  });

  const list = document.createElement('div');
  list.className = 'flex flex-col gap-4';

  for (const entry of mergedEntries) {
    const card = document.createElement('div');
    card.className = 'bg-slate-800 border border-slate-700 rounded-xl p-4';

    // Badge to distinguish entry type
    const badge = document.createElement('span');
    badge.className = entry.type === 'pattern' 
      ? 'inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3'
      : 'inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3';
    badge.textContent = entry.type === 'pattern' ? 'POLA' : 'TATA BAHASA';
    card.appendChild(badge);

    // Title/Pattern
    const titleEl = document.createElement('p');
    titleEl.className = 'text-lg font-bold text-indigo-300 mb-2';
    titleEl.textContent = entry.type === 'pattern' ? entry.pattern : entry.title;
    card.appendChild(titleEl);

    // Explanation
    const explanation = document.createElement('p');
    explanation.className = 'text-sm text-slate-400 mb-3 leading-relaxed';
    explanation.textContent = entry.explanation;
    card.appendChild(explanation);

    // Examples
    if (entry.examples && entry.examples.length > 0) {
      const exList = document.createElement('div');
      exList.className = 'flex flex-col gap-2';
      for (const ex of entry.examples) {
        const exEl = document.createElement('div');
        exEl.className = 'bg-slate-900/60 rounded-lg px-3 py-2.5 border border-slate-700/50';
        exEl.innerHTML = `
          <p class="text-sm font-medium text-white">${ex.japanese}</p>
          <p class="text-xs text-slate-500 italic">${ex.romaji}</p>
          <p class="text-xs text-slate-400">${ex.indonesian}</p>
        `;
        exList.appendChild(exEl);
      }
      card.appendChild(exList);
    }

    list.appendChild(card);
  }

  container.appendChild(list);
}

export { renderMateri };
