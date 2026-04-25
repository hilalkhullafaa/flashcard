# Dokumen Requirements: JLPT N5 Quiz Enhancement

## Pendahuluan

Fitur ini menambahkan kuis bergaya JLPT N5 yang lebih komprehensif dan terstruktur untuk semua 25 bab dalam aplikasi flashcard Minna no Nihongo. Kuis saat ini hanya memiliki 10 soal dasar per bab yang menguji vocabulary dan grammar secara sederhana. Fitur baru ini akan menambahkan 15-20 soal per bab dengan format yang mengikuti struktur ujian JLPT N5, mencakup tiga kategori: Vocabulary (40%), Grammar (40%), dan Reading Comprehension (20%). Soal-soal dirancang untuk membantu pengguna mempersiapkan diri menghadapi ujian JLPT N5 dengan latihan yang lebih bervariasi dan mendalam.

## Glosarium

- **App**: Aplikasi flashcard Minna no Nihongo 1
- **Pengguna**: Orang yang menggunakan aplikasi
- **JLPT_N5_Quiz**: Kuis bergaya JLPT N5 dengan format soal terstruktur
- **Vocabulary_Question**: Soal yang menguji kanji reading, word meaning, atau contextual usage
- **Grammar_Question**: Soal yang menguji particle selection, sentence completion, atau grammar pattern
- **Reading_Question**: Soal yang menguji pemahaman bacaan pendek
- **Quiz_Module**: Modul kuis yang sudah ada di aplikasi (quiz.js)
- **Chapter_Data**: Data JSON per bab yang berisi vocabulary, patterns, grammar, dan quiz
- **Question_Pool**: Kumpulan soal JLPT N5 untuk setiap bab
- **Question_Category**: Kategori soal (vocabulary, grammar, atau reading)

---

## Requirements

### Requirement 1: Struktur Soal JLPT N5

**User Story:** Sebagai pengguna, saya ingin setiap bab memiliki soal kuis bergaya JLPT N5 yang terstruktur, sehingga saya dapat berlatih dengan format yang sesuai dengan ujian JLPT N5.

#### Acceptance Criteria

1. THE App SHALL menyediakan minimal 15 soal JLPT N5 per bab untuk semua 25 bab.
2. THE App SHALL menyediakan maksimal 20 soal JLPT N5 per bab untuk semua 25 bab.
3. THE App SHALL menyimpan soal JLPT N5 dalam format JSON yang sama dengan struktur quiz yang sudah ada.
4. THE App SHALL memastikan setiap soal JLPT N5 memiliki field: id, chapterId, order, question, choices (array dengan 4 elemen), correctIndex (0-3), dan category.
5. THE App SHALL menambahkan field category dengan nilai "vocabulary", "grammar", atau "reading" pada setiap soal JLPT N5.

---

### Requirement 2: Distribusi Kategori Soal

**User Story:** Sebagai pengguna, saya ingin soal kuis terdistribusi seimbang antara vocabulary, grammar, dan reading, sehingga saya dapat berlatih semua aspek yang diuji dalam JLPT N5.

#### Acceptance Criteria

1. WHEN Question_Pool untuk sebuah bab berisi 15 soal, THE App SHALL memastikan minimal 6 soal adalah Vocabulary_Question (40%).
2. WHEN Question_Pool untuk sebuah bab berisi 15 soal, THE App SHALL memastikan minimal 6 soal adalah Grammar_Question (40%).
3. WHEN Question_Pool untuk sebuah bab berisi 15 soal, THE App SHALL memastikan minimal 3 soal adalah Reading_Question (20%).
4. WHEN Question_Pool untuk sebuah bab berisi 20 soal, THE App SHALL memastikan minimal 8 soal adalah Vocabulary_Question (40%).
5. WHEN Question_Pool untuk sebuah bab berisi 20 soal, THE App SHALL memastikan minimal 8 soal adalah Grammar_Question (40%).
6. WHEN Question_Pool untuk sebuah bab berisi 20 soal, THE App SHALL memastikan minimal 4 soal adalah Reading_Question (20%).

---

### Requirement 3: Soal Vocabulary

**User Story:** Sebagai pengguna, saya ingin berlatih soal vocabulary yang menguji kanji reading, word meaning, dan contextual usage, sehingga saya dapat menguasai kosakata level N5.

#### Acceptance Criteria

1. THE App SHALL menyediakan Vocabulary_Question yang menguji kanji reading (membaca kanji dengan hiragana yang benar).
2. THE App SHALL menyediakan Vocabulary_Question yang menguji word meaning (memilih arti kata yang tepat).
3. THE App SHALL menyediakan Vocabulary_Question yang menguji contextual usage (memilih kata yang tepat untuk melengkapi kalimat).
4. THE App SHALL memastikan setiap Vocabulary_Question menggunakan kosakata yang relevan dengan materi bab tersebut.
5. THE App SHALL memastikan tingkat kesulitan Vocabulary_Question sesuai dengan level JLPT N5.

---

### Requirement 4: Soal Grammar

**User Story:** Sebagai pengguna, saya ingin berlatih soal grammar yang menguji particle selection, sentence completion, dan grammar pattern, sehingga saya dapat menguasai tata bahasa level N5.

#### Acceptance Criteria

1. THE App SHALL menyediakan Grammar_Question yang menguji particle selection (memilih partikel yang tepat untuk melengkapi kalimat).
2. THE App SHALL menyediakan Grammar_Question yang menguji sentence completion (melengkapi kalimat dengan pola grammar yang benar).
3. THE App SHALL menyediakan Grammar_Question yang menguji grammar pattern recognition (mengidentifikasi pola grammar yang digunakan).
4. THE App SHALL memastikan setiap Grammar_Question menggunakan pola grammar yang relevan dengan materi bab tersebut.
5. THE App SHALL memastikan tingkat kesulitan Grammar_Question sesuai dengan level JLPT N5.

---

### Requirement 5: Soal Reading Comprehension

**User Story:** Sebagai pengguna, saya ingin berlatih soal reading comprehension dengan bacaan pendek, sehingga saya dapat meningkatkan kemampuan membaca dan memahami teks bahasa Jepang level N5.

#### Acceptance Criteria

1. THE App SHALL menyediakan Reading_Question yang berisi bacaan pendek (2-4 kalimat) diikuti dengan pertanyaan pemahaman.
2. THE App SHALL memastikan bacaan dalam Reading_Question menggunakan kosakata dan grammar yang relevan dengan materi bab tersebut.
3. THE App SHALL memastikan setiap Reading_Question menguji pemahaman isi bacaan, bukan hanya pengetahuan vocabulary atau grammar.
4. THE App SHALL memastikan tingkat kesulitan Reading_Question sesuai dengan level JLPT N5.
5. THE App SHALL menyimpan teks bacaan sebagai bagian dari field question dalam format JSON.

---

### Requirement 6: Kompatibilitas dengan Modul Quiz yang Ada

**User Story:** Sebagai pengguna, saya ingin soal JLPT N5 dapat ditampilkan menggunakan modul quiz yang sudah ada, sehingga pengalaman pengguna tetap konsisten.

#### Acceptance Criteria

1. THE Quiz_Module SHALL dapat menampilkan soal JLPT N5 tanpa modifikasi pada logika render utama.
2. THE App SHALL memastikan struktur data soal JLPT N5 kompatibel dengan interface QuizQuestion yang sudah ada.
3. THE App SHALL memastikan field category tidak mengganggu fungsi Quiz_Module yang sudah ada.
4. THE App SHALL memastikan soal JLPT N5 dapat diacak menggunakan fungsi shuffleArray yang sudah ada.
5. THE App SHALL memastikan scoring dan feedback untuk soal JLPT N5 menggunakan fungsi calculateQuizResult yang sudah ada.

---

### Requirement 7: Relevansi Soal dengan Materi Bab

**User Story:** Sebagai pengguna, saya ingin soal JLPT N5 di setiap bab relevan dengan materi yang diajarkan di bab tersebut, sehingga saya dapat menguji pemahaman saya terhadap materi yang baru dipelajari.

#### Acceptance Criteria

1. THE App SHALL memastikan Vocabulary_Question di setiap bab menggunakan kosakata dari field vocabulary dalam Chapter_Data bab tersebut.
2. THE App SHALL memastikan Grammar_Question di setiap bab menggunakan pola grammar dari field patterns atau grammar dalam Chapter_Data bab tersebut.
3. THE App SHALL memastikan Reading_Question di setiap bab menggunakan kombinasi kosakata dan grammar dari Chapter_Data bab tersebut.
4. THE App SHALL memastikan soal JLPT N5 tidak menggunakan materi dari bab yang lebih tinggi (bab selanjutnya).

---

### Requirement 8: Format Multiple Choice dengan 4 Pilihan

**User Story:** Sebagai pengguna, saya ingin setiap soal JLPT N5 memiliki 4 pilihan jawaban seperti format ujian JLPT yang sebenarnya, sehingga saya dapat berlatih dengan format yang familiar.

#### Acceptance Criteria

1. THE App SHALL memastikan setiap soal JLPT N5 memiliki tepat 4 pilihan jawaban dalam field choices.
2. THE App SHALL memastikan setiap soal JLPT N5 memiliki tepat 1 jawaban benar yang ditandai dengan field correctIndex (0-3).
3. THE App SHALL memastikan pilihan jawaban yang salah (distractor) masuk akal dan tidak terlalu mudah dibedakan.
4. THE App SHALL memastikan pilihan jawaban tidak memiliki duplikat dalam satu soal.

---

### Requirement 9: Tingkat Kesulitan Level N5

**User Story:** Sebagai pengguna, saya ingin soal JLPT N5 memiliki tingkat kesulitan yang sesuai dengan level N5, sehingga saya dapat berlatih dengan soal yang realistis untuk persiapan ujian.

#### Acceptance Criteria

1. THE App SHALL memastikan Vocabulary_Question hanya menggunakan kosakata yang termasuk dalam silabus JLPT N5.
2. THE App SHALL memastikan Grammar_Question hanya menggunakan pola grammar yang termasuk dalam silabus JLPT N5.
3. THE App SHALL memastikan Reading_Question menggunakan kalimat sederhana dengan struktur yang sesuai level N5.
4. THE App SHALL memastikan bacaan dalam Reading_Question tidak melebihi 50 karakter Jepang per bacaan.

---

### Requirement 10: Integrasi dengan Data JSON Bab

**User Story:** Sebagai pengguna, saya ingin soal JLPT N5 tersimpan dalam file JSON yang sama dengan data bab lainnya, sehingga struktur data aplikasi tetap konsisten dan mudah dikelola.

#### Acceptance Criteria

1. THE App SHALL menyimpan soal JLPT N5 dalam field quiz di dalam file ch{N}.json untuk setiap bab.
2. THE App SHALL memastikan soal JLPT N5 dan soal quiz dasar yang sudah ada dapat disimpan bersama dalam satu array quiz.
3. THE App SHALL memastikan field category membedakan soal JLPT N5 dari soal quiz dasar (soal dasar tidak memiliki field category).
4. THE App SHALL memastikan fetchChapterData dapat memuat soal JLPT N5 tanpa modifikasi pada fungsi fetch.

---

### Requirement 11: Tampilan Kategori Soal (Opsional)

**User Story:** Sebagai pengguna, saya ingin melihat kategori soal (Vocabulary/Grammar/Reading) saat mengerjakan kuis, sehingga saya tahu aspek apa yang sedang diuji.

#### Acceptance Criteria

1. WHERE fitur tampilan kategori diaktifkan, THE Quiz_Module SHALL menampilkan label kategori soal di atas pertanyaan.
2. WHERE fitur tampilan kategori diaktifkan, THE App SHALL menampilkan label "Vocabulary" untuk Vocabulary_Question.
3. WHERE fitur tampilan kategori diaktifkan, THE App SHALL menampilkan label "Grammar" untuk Grammar_Question.
4. WHERE fitur tampilan kategori diaktifkan, THE App SHALL menampilkan label "Reading" untuk Reading_Question.
5. WHERE fitur tampilan kategori tidak diaktifkan, THE Quiz_Module SHALL menampilkan soal tanpa label kategori.

---

### Requirement 12: Filter Soal Berdasarkan Kategori (Opsional)

**User Story:** Sebagai pengguna, saya ingin dapat memilih kategori soal yang ingin saya latih (hanya Vocabulary, hanya Grammar, atau hanya Reading), sehingga saya dapat fokus pada aspek tertentu yang perlu ditingkatkan.

#### Acceptance Criteria

1. WHERE fitur filter kategori diaktifkan, THE Quiz_Module SHALL menyediakan tombol filter untuk memilih kategori soal.
2. WHERE fitur filter kategori diaktifkan, WHEN pengguna memilih filter "Vocabulary", THE Quiz_Module SHALL hanya menampilkan Vocabulary_Question.
3. WHERE fitur filter kategori diaktifkan, WHEN pengguna memilih filter "Grammar", THE Quiz_Module SHALL hanya menampilkan Grammar_Question.
4. WHERE fitur filter kategori diaktifkan, WHEN pengguna memilih filter "Reading", THE Quiz_Module SHALL hanya menampilkan Reading_Question.
5. WHERE fitur filter kategori diaktifkan, WHEN pengguna memilih filter "Semua", THE Quiz_Module SHALL menampilkan semua soal dari ketiga kategori.
