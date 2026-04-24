/**
 * Modul Pola Kalimat — struktur gramatikal beserta penjelasan dan contoh.
 */

/**
 * Render daftar pola kalimat ke dalam container.
 *
 * @param {HTMLElement} container
 * @param {import('../data.js').ChapterData} chapterData
 */
function renderPattern(container, chapterData) {
  container.innerHTML = '';

  const patterns = chapterData?.patterns;

  if (!patterns || patterns.length === 0) {
    container.innerHTML = `
      <p class="text-gray-500 text-center py-12">Pola kalimat untuk bab ini belum tersedia.</p>
    `;
    return;
  }

  const list = document.createElement('div');
  list.className = 'space-y-6';

  for (const pat of patterns) {
    const card = document.createElement('div');
    card.className = 'bg-white border border-gray-200 rounded-xl p-5 shadow-sm';

    // Pattern structure
    const patternEl = document.createElement('p');
    patternEl.className = 'text-xl font-bold text-indigo-700 mb-2';
    patternEl.textContent = pat.pattern;
    card.appendChild(patternEl);

    // Explanation
    const explanation = document.createElement('p');
    explanation.className = 'text-sm text-gray-600 mb-4 leading-relaxed';
    explanation.textContent = pat.explanation;
    card.appendChild(explanation);

    // Examples
    if (pat.examples && pat.examples.length > 0) {
      const examplesEl = document.createElement('div');
      examplesEl.className = 'space-y-3';

      for (const ex of pat.examples) {
        const exEl = document.createElement('div');
        exEl.className = 'bg-indigo-50 rounded-lg px-4 py-3';
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

export { renderPattern };
