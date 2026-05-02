// Router and app initialization
import { renderChapterList } from './pages/chapterList.js';
import { renderChapterDetail } from './pages/chapterDetail.js';
import { renderProgressDetail } from './pages/progressDetail.js';
import { fetchAllChaptersData } from './data.js';

// Load furigana utilities for conversation module
import './utils/furiganaUtils.js';

async function router() {
  const appContainer = document.getElementById('app');
  const hash = window.location.hash;

  if (!hash || hash === '#/') {
    renderChapterList(appContainer);
  } else if (hash === '#/progress') {
    const allChaptersData = await fetchAllChaptersData();
    renderProgressDetail(appContainer, allChaptersData);
  } else {
    const chapterMatch = hash.match(/^#\/chapter\/(\d+)(?:\/(\w+))?$/);
    if (chapterMatch) {
      const id = parseInt(chapterMatch[1], 10);
      const tab = chapterMatch[2] || null;
      renderChapterDetail(appContainer, id, tab);
    } else {
      window.location.hash = '#/';
    }
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
