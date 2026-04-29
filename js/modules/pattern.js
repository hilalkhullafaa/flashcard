function renderPattern(container, chapterData) {
  container.innerHTML = '';
  
  // Handle missing or invalid chapter data
  if (!chapterData || typeof chapterData !== 'object') {
    console.error('Invalid chapter data provided to renderPattern');
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Gagal memuat data pola kalimat.</p>`;
    return;
  }
  
  const patterns = chapterData?.patterns;

  // Validate patterns array
  if (!Array.isArray(patterns)) {
    console.error('Invalid patterns data: not an array', patterns);
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Data pola kalimat tidak valid.</p>`;
    return;
  }

  if (patterns.length === 0) {
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Pola kalimat untuk bab ini belum tersedia.</p>`;
    return;
  }

  const list = document.createElement('div');
  list.className = 'flex flex-col gap-4';

  for (const pat of patterns) {
    const card = document.createElement('div');
    card.className = 'bg-slate-800 border border-slate-700 rounded-xl p-4';

    const patternEl = document.createElement('p');
    patternEl.className = 'text-lg font-bold text-indigo-300 mb-2';
    patternEl.textContent = pat.pattern;
    card.appendChild(patternEl);

    const explanation = document.createElement('p');
    explanation.className = 'text-sm text-slate-400 mb-3 leading-relaxed';
    explanation.textContent = pat.explanation;
    card.appendChild(explanation);

    if (pat.examples && pat.examples.length > 0) {
      const exList = document.createElement('div');
      exList.className = 'flex flex-col gap-2';
      for (const ex of pat.examples) {
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