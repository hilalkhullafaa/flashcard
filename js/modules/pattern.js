/**
 * Modul Pola Kalimat — menampilkan pola kalimat per bab sesuai Minna no Nihongo 1.
 * 
 * Modul ini menampilkan pola kalimat (sentence patterns) dengan penjelasan dan contoh
 * penggunaan. Semua pola kalimat diselaraskan dengan buku teks Minna no Nihongo 1.
 * 
 * Requirements: 5.1, 5.2, 5.4, 5.5, 5.6, 5.7
 */

/**
 * Render daftar pola kalimat ke dalam container
 * 
 * Fungsi ini memvalidasi data pola kalimat, kemudian merender setiap pola dengan:
 * - Template pola (e.g., "N は N です")
 * - Penjelasan dalam bahasa Indonesia
 * - Contoh kalimat dengan terjemahan romaji dan Indonesia
 * 
 * @param {HTMLElement} container - Container element untuk merender pola kalimat
 * @param {import('../data.js').ChapterData} chapterData - Data bab yang berisi array patterns
 * 
 * @throws {Error} Logs error jika data tidak valid dan menampilkan pesan error ke user
 * 
 * @example
 * const container = document.getElementById('pattern-container');
 * const chapterData = await loadChapterData(1);
 * renderPattern(container, chapterData);
 * 
 * Requirements: 5.1, 5.2, 5.5, 5.6, 5.7
 */
function renderPattern(container, chapterData) {
  container.innerHTML = '';
  
  // Handle missing or invalid chapter data
  // Requirements: 13.4, 13.5, 13.10
  if (!chapterData || typeof chapterData !== 'object') {
    const detailedError = '[Modul Pola Kalimat] Data bab tidak valid atau tidak ditemukan';
    console.error(detailedError, { receivedData: chapterData });
    // User-friendly error message in Indonesian (Requirements: 13.10)
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Gagal memuat data pola kalimat.</p>`;
    return;
  }
  
  const patterns = chapterData?.patterns;

  // Validate patterns array
  // Requirements: 5.5, 13.4, 13.5
  if (!Array.isArray(patterns)) {
    const detailedError = `[Modul Pola Kalimat] Field 'patterns' tidak ada atau bukan array. Tipe yang diterima: ${typeof patterns}`;
    console.error(detailedError, { patterns });
    // User-friendly error message in Indonesian (Requirements: 13.10)
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Data pola kalimat tidak valid.</p>`;
    return;
  }

  // Handle empty patterns array
  // Requirements: 13.10
  if (patterns.length === 0) {
    console.warn('[Modul Pola Kalimat] Array pola kalimat kosong untuk bab ini');
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Pola kalimat untuk bab ini belum tersedia.</p>`;
    return;
  }

  const list = document.createElement('div');
  list.className = 'flex flex-col gap-4';

  // Render each pattern
  // Requirements: 5.2, 5.4
  for (const pat of patterns) {
    // Validate pattern entry (Requirements: 5.5, 5.6)
    if (!pat || !pat.pattern || !pat.explanation) {
      console.warn('[Modul Pola Kalimat] Melewati pola kalimat dengan data tidak lengkap', pat);
      continue;
    }

    // Create pattern card
    const card = document.createElement('div');
    card.className = 'bg-slate-800 border border-slate-700 rounded-xl p-4';

    // Pattern template (e.g., "N は N です")
    // Requirements: 5.2
    const patternEl = document.createElement('p');
    patternEl.className = 'text-lg font-bold text-indigo-300 mb-2';
    patternEl.textContent = pat.pattern;
    card.appendChild(patternEl);

    // Pattern explanation in Indonesian
    // Requirements: 5.2
    const explanation = document.createElement('p');
    explanation.className = 'text-sm text-slate-400 mb-3 leading-relaxed';
    explanation.textContent = pat.explanation;
    card.appendChild(explanation);

    // Render examples if available
    // Requirements: 5.4
    if (pat.examples && pat.examples.length > 0) {
      const exList = document.createElement('div');
      exList.className = 'flex flex-col gap-2';
      
      for (const ex of pat.examples) {
        // Validate example entry (Requirements: 5.6)
        if (!ex || !ex.japanese || !ex.romaji || !ex.indonesian) {
          console.warn('[Modul Pola Kalimat] Melewati contoh dengan data tidak lengkap', ex);
          continue;
        }

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

export { renderPattern };