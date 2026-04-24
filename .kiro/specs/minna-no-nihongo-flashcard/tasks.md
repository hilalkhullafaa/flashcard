# Rencana Implementasi: Minna no Nihongo Flashcard

## Overview

Implementasi SPA native HTML + vanilla JavaScript (ES Modules) untuk aplikasi flashcard Minna no Nihongo 1 yang mencakup 25 bab dengan **lima modul per bab**: Kotoba, Pola Kalimat, Materi, Flashcard, dan Kuis. Ditambah fitur pencarian global lintas bab. Data materi disimpan sebagai JSON statis, di-style menggunakan Tailwind CSS via CDN, tanpa framework dan tanpa build tool.

## Tasks

- [x] 1. Setup struktur proyek
  - [x] 1.1 Buat `index.html` sebagai entry point utama
  - [x] 1.2 Buat struktur direktori: `js/`, `js/pages/`, `js/modules/`, `data/`
  - [x] 1.3 Buat file placeholder kosong untuk semua modul JS
  - _Requirements: 1.1, 1.2, 7.1_

- [x] 2. Implementasi utilitas dan logika bisnis murni (`js/utils.js`)
  - [x] 2.1 Buat fungsi `shuffleArray(arr)` menggunakan algoritma Fisher-Yates
  - [x] 2.2 Buat fungsi `calculateQuizResult(questions, selectedAnswers)`
  - [x] 2.3 Buat fungsi `getNextIndex(currentIndex, total)` — navigasi siklik ke depan
  - [x] 2.4 Buat fungsi `getPrevIndex(currentIndex, total)` — navigasi siklik ke belakang
  - [x] 2.5 Export semua fungsi
  - [x] 2.6 Buat fungsi `searchVocabAndPatterns(allChaptersData, query)` — pencarian global
    - Cari pada field `kanji`, `kana`, `romaji`, `meaning` untuk kosakata
    - Cari pada field `pattern`, `explanation` untuk pola kalimat
    - Kembalikan array `SearchResult[]` dengan tipe `'vocab'` atau `'pattern'` dan `chapterId`
    - Pencarian case-insensitive, kembalikan array kosong jika query kosong
    - _Requirements: 9.2, 9.3_
  - _Requirements: 4.4, 4.5, 4.6, 4.8, 5.5, 5.6, 9.2, 9.3_

- [x] 3. Implementasi layer data (`js/data.js`)
  - [x] 3.1 Buat fungsi `fetchChapters()`
  - [x] 3.2 Buat fungsi `fetchChapterData(chapterId)`
  - [x] 3.3 Bungkus setiap fetch dengan `try/catch`
  - [x] 3.4 Export kedua fungsi
  - [x] 3.5 Buat fungsi `fetchAllChaptersData()` — fetch semua 25 bab secara paralel dengan `Promise.all`
    - Kembalikan array `ChapterData[]` (skip bab yang gagal di-fetch)
    - Export fungsi: `export { fetchChapters, fetchChapterData, fetchAllChaptersData }`
    - _Requirements: 9.2_
  - _Requirements: 2.1, 3.1, 5.1, 6.1, 9.2_

- [x] 4. Buat data JSON statis untuk semua 25 bab
  - [x] 4.1 Buat `data/chapters.json` berisi array metadata 25 bab
  - [x] 4.2 Buat/perbarui `data/ch01.json` hingga `data/ch25.json` dengan struktur baru:
    - Field `vocabulary` menggunakan `kanji` (tulisan kanji, boleh kosong) dan `kana` (hiragana/katakana, wajib) sebagai dua field terpisah
    - Tambahkan field `grammar` berisi array `GrammarNote[]` per bab
    - Kosakata dilengkapi dan diverifikasi sesuai buku Minna no Nihongo 1 edisi kedua
    - Setiap bab memiliki minimal 10 soal kuis dengan tepat 4 pilihan jawaban
    - _Requirements: 2.1, 2.5, 6.1, 6.2, 6.3, 8.1, 8.2_
  - _Requirements: 2.1, 2.3, 2.5, 3.1, 5.2, 6.1, 6.2, 6.3, 6.4, 8.1, 8.2_

- [x] 5. Implementasi router (`js/app.js`)
  - [x] 5.1 Buat fungsi `router()` yang mem-parse `window.location.hash`
    - `#/` atau hash kosong → `renderChapterList(appContainer)`
    - `#/chapter/{id}` → `renderChapterDetail(appContainer, id)`
    - Hash tidak dikenal → redirect ke `#/`
  - [x] 5.2 Daftarkan event listener `hashchange` dan `DOMContentLoaded`
  - _Requirements: 1.1, 1.2_

- [x] 6. Implementasi halaman daftar bab + pencarian global (`js/pages/chapterList.js`)
  - [x] 6.1 Buat fungsi `renderChapterList(container)`
    - Render kotak pencarian di bagian atas halaman
    - Fetch data dari `fetchChapters()` dan render 25 kartu bab
    - Tampilkan pesan loading dan error dengan tombol "Coba Lagi"
    - _Requirements: 1.1, 1.3_
  - [x] 6.2 Implementasi logika pencarian real-time
    - Event listener `input` pada kotak pencarian
    - Saat query kosong: sembunyikan hasil, tampilkan daftar bab
    - Saat query tidak kosong: fetch semua data dengan `fetchAllChaptersData()`, jalankan `searchVocabAndPatterns()`, render hasil
    - Kelompokkan hasil menjadi seksi "Kosakata" dan "Pola Kalimat"
    - Setiap hasil menampilkan label nomor bab dan dapat diklik untuk navigasi ke bab + tab yang sesuai
    - Tampilkan pesan "Tidak ada hasil" jika array kosong
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_
  - _Requirements: 1.1, 1.3, 9.1–9.8_

- [x] 7. Implementasi halaman detail bab (`js/pages/chapterDetail.js`)
  - [x] 7.1 Buat fungsi `renderChapterDetail(container, chapterId)`
    - Validasi `chapterId`: jika di luar rentang 1–25, redirect ke `#/`
    - Fetch data dari `fetchChapterData(chapterId)`
    - Render header bab dengan tombol "← Kembali ke Daftar Bab"
    - Render **lima** tab navigasi: "Kotoba", "Pola Kalimat", "Materi", "Flashcard", "Kuis"
    - Tab aktif ditandai secara visual; default tab aktif: "Kotoba"
    - Klik tab memanggil fungsi render modul yang sesuai
    - _Requirements: 1.2, 7.1, 7.2, 7.3, 8.1_
  - _Requirements: 1.2, 7.1, 7.2, 7.3, 8.1_

- [x] 8. Implementasi modul Kotoba (`js/modules/kotoba.js`)
  - [x] 8.1 Buat fungsi `renderKotoba(container, chapterData)`
    - Tampilkan kanji (jika field `kanji` tidak kosong) dan kana sebagai dua baris terpisah
    - Urutkan berdasarkan field `order` ascending
    - Fallback jika data kosong
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 9. Implementasi modul Pola Kalimat (`js/modules/pattern.js`)
  - [x] 9.1 Buat fungsi `renderPattern(container, chapterData)`
    - Render struktur pola, penjelasan, dan semua contoh kalimat
    - Setiap contoh: Jepang, romaji, Indonesia
    - Fallback jika data kosong
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 10. Implementasi modul Materi (`js/modules/grammar.js`)
  - [x] 10.1 Buat fungsi `renderGrammar(container, chapterData)`
    - Bersihkan `container.innerHTML`
    - Jika `chapterData.grammar` kosong atau tidak ada, tampilkan: "Materi untuk bab ini belum tersedia."
    - Render setiap `GrammarNote` dengan: judul, penjelasan, dan semua contoh kalimat
    - Setiap contoh kalimat menampilkan tiga representasi: Jepang, romaji, Indonesia
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 11. Implementasi modul Flashcard (`js/modules/flashcard.js`)
  - [x] 11.1 Buat fungsi `renderFlashcard(container, chapterData)`
    - Sisi depan: tampilkan kanji (jika ada) dan kana
    - Sisi belakang: tampilkan romaji dan arti
    - Tombol Sebelumnya, Berikutnya, Acak; indikator "X / N"
    - _Requirements: 4.1–4.8_
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 12. Implementasi modul Kuis (`js/modules/quiz.js`)
  - [x] 12.1 Buat fungsi `renderQuiz(container, chapterData)`
    - Soal satu per satu, 4 pilihan, umpan balik hijau/merah
    - Halaman hasil dengan skor dan persentase
    - Tombol "Ulangi Kuis" dengan pengacakan
    - _Requirements: 5.1–5.8_
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 13. Wiring akhir dan integrasi
  - [x] 13.1 Tambahkan file placeholder `js/modules/grammar.js` dan pastikan semua import/export antar modul sudah benar
  - [x] 13.2 Verifikasi routing dan navigasi dari hasil pencarian ke halaman detail bab
  - [x] 13.3 Validasi semua file JSON: field `kanji`, `kana`, `grammar` ada di setiap `ch{N}.json`; setiap soal kuis valid
  - [x] 13.4 Uji aplikasi secara manual menggunakan checklist di design.md
  - _Requirements: 1.1, 1.2, 5.2, 5.7, 6.1, 9.6_

## Catatan

- Tidak ada build step — buka `index.html` langsung di browser atau gunakan server statis sederhana
- Semua fungsi di `utils.js` adalah pure function dan dapat diuji secara manual di browser console
- Tailwind CSS dimuat via CDN sehingga tidak perlu konfigurasi PostCSS atau build
- ES Modules memerlukan server HTTP — gunakan server statis lokal (contoh: `npx serve .`)
- Field `kanji` pada `VocabEntry` boleh kosong string `""` untuk kata yang tidak memiliki kanji; field `kana` selalu wajib diisi
