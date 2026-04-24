# Dokumen Requirements

## Pendahuluan

Aplikasi flashcard interaktif berbasis Minna no Nihongo 1 yang mencakup 25 bab. Aplikasi ini membantu pengguna mempelajari bahasa Jepang melalui empat modul utama per bab: kosakata (kotoba), pola kalimat, flashcard bolak-balik kanji/romaji, dan kuis. Seluruh materi mengacu pada buku Minna no Nihongo 1 (edisi kedua).

## Glosarium

- **App**: Aplikasi flashcard Minna no Nihongo 1
- **Pengguna**: Orang yang menggunakan aplikasi
- **Bab**: Salah satu dari 25 bab dalam Minna no Nihongo 1
- **Kotoba**: Kosakata bahasa Jepang beserta arti dan cara baca
- **Pola_Kalimat**: Struktur gramatikal yang diajarkan dalam setiap bab
- **Materi**: Catatan tata bahasa tambahan per bab, mencakup penjelasan partikel, catatan penggunaan, dan poin gramatikal penting
- **Flashcard**: Kartu digital dua sisi yang menampilkan kanji/kana di satu sisi dan romaji/arti di sisi lain
- **Kuis**: Latihan soal pilihan ganda atau isian untuk menguji pemahaman per bab
- **Romaji**: Transliterasi huruf Latin dari bahasa Jepang
- **Kanji**: Tulisan karakter Cina yang digunakan dalam bahasa Jepang
- **Kana**: Tulisan fonetik Jepang (hiragana atau katakana)
- **Navigator**: Komponen navigasi utama yang menampilkan daftar bab
- **Pencarian Global**: Fitur pencarian kosakata dan pola kalimat lintas semua 25 bab

---

## Requirements

### Requirement 1: Navigasi Daftar Bab

**User Story:** Sebagai pengguna, saya ingin melihat daftar semua bab (1–25) dari Minna no Nihongo 1, sehingga saya dapat memilih bab yang ingin dipelajari.

#### Acceptance Criteria

1. THE App SHALL menampilkan daftar bab dari Bab 1 hingga Bab 25 pada halaman utama.
2. WHEN pengguna memilih sebuah bab, THE Navigator SHALL mengarahkan pengguna ke halaman detail bab tersebut.
3. THE App SHALL menampilkan judul tema setiap bab sesuai dengan buku Minna no Nihongo 1 (contoh: Bab 1 — わたしは マイク・ミラーです).
4. WHEN pengguna berada di halaman detail bab, THE Navigator SHALL menyediakan tombol kembali ke daftar bab.

---

### Requirement 2: Modul Kotoba (Kosakata)

**User Story:** Sebagai pengguna, saya ingin mempelajari kosakata setiap bab beserta kanji, kana, romaji, dan artinya, sehingga saya dapat memahami kosakata baru dengan lengkap.

#### Acceptance Criteria

1. WHEN pengguna membuka modul Kotoba pada sebuah bab, THE App SHALL menampilkan seluruh daftar kosakata bab tersebut sesuai dengan buku Minna no Nihongo 1.
2. THE App SHALL menampilkan setiap entri kosakata dengan lima informasi: tulisan kanji (jika ada), tulisan kana (hiragana/katakana), romaji, kelas kata (nomina, verba, adjektiva, dll.), dan arti dalam Bahasa Indonesia.
3. THE App SHALL menampilkan kosakata dalam urutan yang sama dengan urutan di buku Minna no Nihongo 1.
4. IF data kosakata untuk sebuah bab tidak tersedia, THEN THE App SHALL menampilkan pesan "Kosakata untuk bab ini belum tersedia."
5. THE App SHALL menampilkan field kanji dan kana sebagai dua field terpisah — kanji ditampilkan jika tersedia, kana selalu ditampilkan sebagai cara baca.

---

### Requirement 3: Modul Pola Kalimat

**User Story:** Sebagai pengguna, saya ingin mempelajari pola kalimat setiap bab beserta contoh penggunaannya, sehingga saya dapat memahami struktur gramatikal bahasa Jepang.

#### Acceptance Criteria

1. WHEN pengguna membuka modul Pola Kalimat pada sebuah bab, THE App SHALL menampilkan seluruh pola kalimat bab tersebut sesuai dengan buku Minna no Nihongo 1.
2. THE App SHALL menampilkan setiap pola kalimat dengan tiga komponen: struktur pola (contoh: N は N です), penjelasan dalam Bahasa Indonesia, dan minimal satu contoh kalimat lengkap.
3. THE App SHALL menampilkan setiap contoh kalimat dengan tiga representasi: tulisan Jepang (kanji/kana), romaji, dan terjemahan Bahasa Indonesia.
4. IF data pola kalimat untuk sebuah bab tidak tersedia, THEN THE App SHALL menampilkan pesan "Pola kalimat untuk bab ini belum tersedia."

---

### Requirement 4: Modul Flashcard Bolak-Balik

**User Story:** Sebagai pengguna, saya ingin berlatih menggunakan flashcard bolak-balik yang menampilkan kanji/kana di satu sisi dan romaji/arti di sisi lain, sehingga saya dapat menghafalkan kosakata secara efektif.

#### Acceptance Criteria

1. WHEN pengguna membuka modul Flashcard pada sebuah bab, THE App SHALL menampilkan flashcard pertama dari daftar kosakata bab tersebut dengan sisi depan (kanji/kana) menghadap ke atas.
2. WHEN pengguna mengetuk sebuah flashcard, THE App SHALL membalik kartu untuk menampilkan sisi belakang yang berisi romaji dan arti Bahasa Indonesia.
3. WHEN pengguna mengetuk flashcard yang sedang menampilkan sisi belakang, THE App SHALL membalik kartu kembali ke sisi depan.
4. WHEN pengguna menekan tombol "Berikutnya", THE App SHALL menampilkan flashcard kosakata berikutnya dalam urutan bab.
5. WHEN pengguna menekan tombol "Sebelumnya", THE App SHALL menampilkan flashcard kosakata sebelumnya dalam urutan bab.
6. WHEN pengguna berada di flashcard terakhir dan menekan tombol "Berikutnya", THE App SHALL menampilkan flashcard pertama (kembali ke awal).
7. THE App SHALL menampilkan indikator posisi kartu saat ini, misalnya "3 / 20", yang menunjukkan nomor kartu saat ini dari total kartu dalam bab.
8. WHEN pengguna menekan tombol "Acak", THE App SHALL mengacak urutan flashcard dalam sesi tersebut.

---

### Requirement 5: Modul Kuis

**User Story:** Sebagai pengguna, saya ingin mengerjakan kuis per bab untuk menguji pemahaman saya terhadap kosakata dan pola kalimat, sehingga saya dapat mengukur kemajuan belajar saya.

#### Acceptance Criteria

1. WHEN pengguna membuka modul Kuis pada sebuah bab, THE App SHALL menampilkan soal kuis yang mencakup kosakata dan pola kalimat dari bab tersebut.
2. THE App SHALL menyediakan minimal 10 soal per bab dalam format pilihan ganda dengan 4 pilihan jawaban.
3. WHEN pengguna memilih sebuah jawaban, THE App SHALL segera menampilkan umpan balik visual: warna hijau untuk jawaban benar dan warna merah untuk jawaban salah.
4. WHEN pengguna menjawab soal dengan salah, THE App SHALL menampilkan jawaban yang benar setelah umpan balik diberikan.
5. WHEN pengguna menyelesaikan semua soal kuis, THE App SHALL menampilkan halaman hasil yang memuat skor akhir dalam format "X dari Y soal benar" dan persentase kebenaran.
6. WHEN pengguna menekan tombol "Ulangi Kuis", THE App SHALL mengacak urutan soal dan pilihan jawaban, lalu memulai kuis dari awal.
7. THE App SHALL memastikan setiap soal kuis hanya memiliki satu jawaban yang benar.
8. IF data kuis untuk sebuah bab tidak tersedia, THEN THE App SHALL menampilkan pesan "Kuis untuk bab ini belum tersedia."

---

### Requirement 6: Konsistensi Materi dengan Buku Minna no Nihongo 1

**User Story:** Sebagai pengguna, saya ingin memastikan seluruh materi dalam aplikasi sesuai dengan buku Minna no Nihongo 1, sehingga saya dapat belajar dengan referensi yang akurat.

#### Acceptance Criteria

1. THE App SHALL menggunakan kosakata, pola kalimat, dan contoh kalimat yang bersumber dari buku Minna no Nihongo 1 (edisi kedua) untuk setiap bab 1 hingga 25.
2. THE App SHALL menampilkan judul/tema setiap bab sesuai dengan buku Minna no Nihongo 1.
3. THE App SHALL menggunakan sistem penulisan yang konsisten: kanji/kana untuk tulisan Jepang dan romaji Hepburn untuk transliterasi.
4. THE App SHALL memastikan arti kosakata dalam Bahasa Indonesia konsisten dengan terjemahan yang lazim digunakan dalam konteks pembelajaran Minna no Nihongo 1.

---

### Requirement 7: Navigasi Antar Modul dalam Bab

**User Story:** Sebagai pengguna, saya ingin berpindah dengan mudah antar modul (Kotoba, Pola Kalimat, Materi, Flashcard, Kuis) dalam satu bab, sehingga pengalaman belajar saya menjadi lancar.

#### Acceptance Criteria

1. WHEN pengguna berada di halaman detail sebuah bab, THE App SHALL menampilkan lima tab atau tombol navigasi: "Kotoba", "Pola Kalimat", "Materi", "Flashcard", dan "Kuis".
2. WHEN pengguna menekan salah satu tab navigasi, THE App SHALL menampilkan konten modul yang dipilih tanpa memuat ulang halaman secara penuh.
3. THE App SHALL menandai tab yang sedang aktif secara visual agar pengguna mengetahui modul yang sedang dibuka.

---

### Requirement 8: Modul Materi (Catatan Tata Bahasa)

**User Story:** Sebagai pengguna, saya ingin membaca catatan tata bahasa tambahan per bab — termasuk penjelasan partikel dan poin gramatikal penting — sehingga saya dapat memahami konteks penggunaan bahasa Jepang secara lebih mendalam.

#### Acceptance Criteria

1. WHEN pengguna membuka modul Materi pada sebuah bab, THE App SHALL menampilkan daftar catatan tata bahasa bab tersebut.
2. THE App SHALL menampilkan setiap catatan dengan: judul poin gramatikal, penjelasan dalam Bahasa Indonesia, dan minimal satu contoh kalimat.
3. THE App SHALL menampilkan setiap contoh kalimat dengan tiga representasi: tulisan Jepang, romaji, dan terjemahan Bahasa Indonesia.
4. IF data materi untuk sebuah bab tidak tersedia, THEN THE App SHALL menampilkan pesan "Materi untuk bab ini belum tersedia."

---

### Requirement 9: Fitur Pencarian Global

**User Story:** Sebagai pengguna, saya ingin mencari kosakata dan pola kalimat dari semua bab sekaligus, sehingga saya dapat menemukan materi yang saya butuhkan dengan cepat tanpa harus membuka bab satu per satu.

#### Acceptance Criteria

1. THE App SHALL menyediakan kotak pencarian yang dapat diakses dari halaman utama (daftar bab).
2. WHEN pengguna mengetikkan kata kunci, THE App SHALL menampilkan hasil pencarian secara real-time (tanpa perlu menekan tombol submit) dari seluruh 25 bab.
3. THE App SHALL mencari kata kunci pada field: kanji, kana, romaji, dan arti (untuk kosakata); serta field pattern dan explanation (untuk pola kalimat).
4. THE App SHALL menampilkan hasil pencarian dengan label yang menunjukkan nomor bab asal setiap hasil.
5. THE App SHALL mengelompokkan hasil pencarian menjadi dua seksi: "Kosakata" dan "Pola Kalimat".
6. WHEN pengguna mengklik hasil pencarian, THE App SHALL mengarahkan pengguna ke halaman detail bab yang sesuai dengan tab yang relevan aktif.
7. IF tidak ada hasil yang ditemukan, THEN THE App SHALL menampilkan pesan "Tidak ada hasil untuk kata kunci tersebut."
8. WHEN kotak pencarian kosong, THE App SHALL menyembunyikan area hasil pencarian dan menampilkan daftar bab seperti biasa.
