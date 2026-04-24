/**
 * Modul Materi — catatan tata bahasa per bab.
 */

/**
 * Render daftar catatan tata bahasa ke dalam container.
 *
 * @param {HTMLElement} container
 * @param {import('../data.js').ChapterData} chapterData
 */
function renderGrammar(container, chapterData) {
  container.innerHTML = '';

  const notes = chapterData?.grammar;

  if (!notes || notes.length === 0) {
    container.innerHTML = `
      <p class="text-gray-500 text-center py-12">Materi untuk bab ini belum tersedia.</p>
    `;
    return;
  }

  const list = document.createElement('div');
  list.className = 'space-y-6';

  for (const note of notes) {
    const card = document.createElement('div');
    card.className = 'bg-white border border-gray-200 rounded-xl p-5 shadow-sm';

    const title = document.createElement('h3');
    title.className = 'text-base font-bold text-gray-800 mb-2';
    title.textContent = note.title;
    card.appendChild(title);

    const explanation = document.createElement('p');
    explanation.className = 'text-sm text-gray-600 mb-4 leading-relaxed';
    explanation.textContent = note.explanation;
    card.appendChild(explanation);

    if (note.examples && note.examples.length > 0) {
      const examplesEl = document.createElement('div');
      examplesEl.className = 'space-y-3';

      for (const ex of note.examples) {
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
