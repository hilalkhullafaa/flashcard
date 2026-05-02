/**
 * Modul Materi — menampilkan catatan tata bahasa per bab sesuai Minna no Nihongo 1.
 * 
 * Modul ini menampilkan penjelasan tata bahasa (grammar notes) dengan contoh penggunaan.
 * Semua materi diselaraskan dengan buku teks Minna no Nihongo 1.
 * 
 * Requirements: 5.1, 5.3, 5.4, 5.5, 5.6, 5.7
 */

/**
 * Render daftar catatan tata bahasa ke dalam container
 * 
 * Fungsi ini memvalidasi data tata bahasa, kemudian merender setiap grammar point dengan:
 * - Judul grammar point
 * - Penjelasan detail dalam bahasa Indonesia
 * - Contoh kalimat dengan terjemahan romaji dan Indonesia
 * 
 * @param {HTMLElement} container - Container element untuk merender tata bahasa
 * @param {import('../data.js').ChapterData} chapterData - Data bab yang berisi array grammar
 * 
 * @throws {Error} Logs error jika data tidak valid dan menampilkan pesan error ke user
 * 
 * @example
 * const container = document.getElementById('grammar-container');
 * const chapterData = await loadChapterData(1);
 * renderGrammar(container, chapterData);
 * 
 * Requirements: 5.1, 5.3, 5.5, 5.6, 5.7
 */
function renderGrammar(container, chapterData) {
  container.innerHTML = '';

  // Handle missing or invalid chapter data
  // Requirements: 13.4, 13.5, 13.10
  if (!chapterData || typeof chapterData !== 'object') {
    const detailedError = '[Modul Materi] Data bab tidak valid atau tidak ditemukan';
    console.error(detailedError, { receivedData: chapterData });
    // User-friendly error message in Indonesian (Requirements: 13.10)
    container.innerHTML = `
      <p class="text-gray-500 text-center py-12">Gagal memuat data tata bahasa.</p>
    `;
    return;
  }

  const notes = chapterData?.grammar;

  // Validate grammar array
  // Requirements: 5.5, 13.4, 13.5
  if (!Array.isArray(notes)) {
    const detailedError = `[Modul Materi] Field 'grammar' tidak ada atau bukan array. Tipe yang diterima: ${typeof notes}`;
    console.error(detailedError, { notes });
    // User-friendly error message in Indonesian (Requirements: 13.10)
    container.innerHTML = `
      <p class="text-gray-500 text-center py-12">Data tata bahasa tidak valid.</p>
    `;
    return;
  }

  // Handle empty grammar array
  // Requirements: 13.10
  if (notes.length === 0) {
    console.warn('[Modul Materi] Array tata bahasa kosong untuk bab ini');
    container.innerHTML = `
      <p class="text-gray-500 text-center py-12">Materi untuk bab ini belum tersedia.</p>
    `;
    return;
  }

  const list = document.createElement('div');
  list.className = 'space-y-6';

  // Render each grammar note
  // Requirements: 5.3, 5.4
  for (const note of notes) {
    // Validate grammar entry (Requirements: 5.5, 5.6)
    if (!note || !note.title || !note.explanation) {
      console.warn('[Modul Materi] Melewati catatan tata bahasa dengan data tidak lengkap', note);
      continue;
    }

    // Create grammar card
    const card = document.createElement('div');
    card.className = 'bg-white border border-gray-200 rounded-xl p-5 shadow-sm';

    // Grammar point title
    // Requirements: 5.3
    const title = document.createElement('h3');
    title.className = 'text-base font-bold text-gray-800 mb-2';
    title.textContent = note.title;
    card.appendChild(title);

    // Grammar explanation in Indonesian
    // Requirements: 5.3
    const explanation = document.createElement('p');
    explanation.className = 'text-sm text-gray-600 mb-4 leading-relaxed';
    explanation.textContent = note.explanation;
    card.appendChild(explanation);

    // Render examples if available
    // Requirements: 5.4
    if (note.examples && note.examples.length > 0) {
      const examplesEl = document.createElement('div');
      examplesEl.className = 'space-y-3';

      for (const ex of note.examples) {
        // Validate example entry (Requirements: 5.6)
        if (!ex || !ex.japanese || !ex.romaji || !ex.indonesian) {
          console.warn('[Modul Materi] Melewati contoh dengan data tidak lengkap', ex);
          continue;
        }

        const exEl = document.createElement('div');
        exEl.className = 'bg-gray-50 rounded-lg px-4 py-3';
        exEl.innerHTML = `
          <p class="text-base font-medium text-gray-800">${ex.japanese}</p>
          <p class="text-sm text-gray-500 italic">${ex.romaji}</p>
          <p class="text-sm text-gray-600">${ex.indonesian}</p>
        `;
        examplesEl.appendChild(exEl);
      }

      card.appendChild(examplesEl);
    }

    list.appendChild(card);
  }

  container.appendChild(list);
}

export { renderGrammar };
