# Implementation Plan: JLPT N5 Quiz Enhancement

## Overview

Fitur ini menambahkan 15-20 soal JLPT N5 per bab untuk semua 25 bab dengan distribusi: 40% vocabulary, 40% grammar, 20% reading comprehension. Implementasi dilakukan melalui penambahan data JSON dengan field `category` opsional, tanpa perubahan kode JavaScript. Soal dirancang mengikuti format ujian JLPT N5 resmi dan relevan dengan materi setiap bab.

## Tasks

- [x] 1. Buat soal JLPT N5 untuk Bab 1-5 (Batch 1)
  - [x] 1.1 Buat 20 soal JLPT N5 untuk Bab 1
    - Buat 8 soal vocabulary (3 kanji reading + 3 word meaning + 2 contextual usage)
    - Buat 8 soal grammar (3 particle selection + 3 sentence completion + 2 pattern recognition)
    - Buat 4 soal reading comprehension (4 bacaan pendek dengan 1 pertanyaan masing-masing)
    - Tambahkan field `category` pada setiap soal ("vocabulary", "grammar", atau "reading")
    - Gunakan vocabulary dan grammar dari data/ch01.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 1.2 Buat 20 soal JLPT N5 untuk Bab 2
    - Buat 8 soal vocabulary (3 kanji reading + 3 word meaning + 2 contextual usage)
    - Buat 8 soal grammar (3 particle selection + 3 sentence completion + 2 pattern recognition)
    - Buat 4 soal reading comprehension
    - Gunakan vocabulary dan grammar dari data/ch02.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 1.3 Buat 20 soal JLPT N5 untuk Bab 3
    - Buat 8 soal vocabulary (3 kanji reading + 3 word meaning + 2 contextual usage)
    - Buat 8 soal grammar (3 particle selection + 3 sentence completion + 2 pattern recognition)
    - Buat 4 soal reading comprehension
    - Gunakan vocabulary dan grammar dari data/ch03.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 1.4 Buat 20 soal JLPT N5 untuk Bab 4
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch04.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 1.5 Buat 20 soal JLPT N5 untuk Bab 5
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch05.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_

- [x] 2. Validasi struktur JSON dan distribusi kategori untuk Batch 1
  - Validasi setiap bab memiliki 25-30 soal total (10 lama + 15-20 JLPT N5)
  - Validasi distribusi kategori: ~40% vocabulary, ~40% grammar, ~20% reading
  - Validasi setiap soal memiliki field wajib: id, chapterId, order, question, choices (4 elemen), correctIndex (0-3)
  - Validasi soal JLPT N5 memiliki field category
  - Validasi tidak ada duplikat choices dalam satu soal
  - _Requirements: 1.1-1.5, 2.1-2.6, 8.1-8.4, 10.1-10.4_

- [x] 3. Checkpoint - Review Batch 1 dengan user
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Buat soal JLPT N5 untuk Bab 6-10 (Batch 2)
  - [x] 4.1 Buat 20 soal JLPT N5 untuk Bab 6
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch06.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 4.2 Buat 20 soal JLPT N5 untuk Bab 7
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch07.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 4.3 Buat 20 soal JLPT N5 untuk Bab 8
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch08.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 4.4 Buat 20 soal JLPT N5 untuk Bab 9
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch09.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 4.5 Buat 20 soal JLPT N5 untuk Bab 10
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch10.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_

- [x] 5. Validasi struktur JSON dan distribusi kategori untuk Batch 2
  - Validasi struktur dan distribusi kategori untuk Bab 6-10
  - _Requirements: 1.1-1.5, 2.1-2.6, 8.1-8.4, 10.1-10.4_

- [x] 6. Checkpoint - Review Batch 2 dengan user
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Buat soal JLPT N5 untuk Bab 11-15 (Batch 3)
  - [x] 7.1 Buat 20 soal JLPT N5 untuk Bab 11
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch11.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 7.2 Buat 20 soal JLPT N5 untuk Bab 12
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch12.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 7.3 Buat 20 soal JLPT N5 untuk Bab 13
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch13.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 7.4 Buat 20 soal JLPT N5 untuk Bab 14
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch14.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 7.5 Buat 20 soal JLPT N5 untuk Bab 15
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch15.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_

- [x] 8. Validasi struktur JSON dan distribusi kategori untuk Batch 3
  - Validasi struktur dan distribusi kategori untuk Bab 11-15
  - _Requirements: 1.1-1.5, 2.1-2.6, 8.1-8.4, 10.1-10.4_

- [x] 9. Checkpoint - Review Batch 3 dengan user
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Buat soal JLPT N5 untuk Bab 16-20 (Batch 4)
  - [x] 10.1 Buat 20 soal JLPT N5 untuk Bab 16
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch16.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 10.2 Buat 20 soal JLPT N5 untuk Bab 17
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch17.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 10.3 Buat 20 soal JLPT N5 untuk Bab 18
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch18.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 10.4 Buat 20 soal JLPT N5 untuk Bab 19
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch19.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 10.5 Buat 20 soal JLPT N5 untuk Bab 20
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch20.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_

- [x] 11. Validasi struktur JSON dan distribusi kategori untuk Batch 4
  - Validasi struktur dan distribusi kategori untuk Bab 16-20
  - _Requirements: 1.1-1.5, 2.1-2.6, 8.1-8.4, 10.1-10.4_

- [x] 12. Checkpoint - Review Batch 4 dengan user
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Buat soal JLPT N5 untuk Bab 21-25 (Batch 5)
  - [x] 13.1 Buat 20 soal JLPT N5 untuk Bab 21
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch21.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 13.2 Buat 20 soal JLPT N5 untuk Bab 22
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch22.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 13.3 Buat 20 soal JLPT N5 untuk Bab 23
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch23.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 13.4 Buat 20 soal JLPT N5 untuk Bab 24
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch24.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_
  
  - [x] 13.5 Buat 20 soal JLPT N5 untuk Bab 25
    - Buat 8 soal vocabulary, 8 soal grammar, 4 soal reading
    - Gunakan vocabulary dan grammar dari data/ch25.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1-2.6, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.4, 8.1-8.4, 9.1-9.4_

- [x] 14. Validasi struktur JSON dan distribusi kategori untuk Batch 5
  - Validasi struktur dan distribusi kategori untuk Bab 21-25
  - _Requirements: 1.1-1.5, 2.1-2.6, 8.1-8.4, 10.1-10.4_

- [x] 15. Checkpoint - Review Batch 5 dengan user
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Testing manual untuk semua bab
  - [ ] 16.1 Test fungsional untuk Bab 1-5
    - Buka aplikasi dan navigasi ke setiap bab
    - Mulai kuis dan verifikasi soal JLPT N5 muncul
    - Test tombol "Acak" untuk memastikan soal diacak dengan benar
    - Verifikasi jawaban benar/salah ditampilkan dengan warna yang tepat
    - Verifikasi skor dihitung dengan benar
    - _Requirements: 6.1-6.5_
  
  - [ ] 16.2 Test fungsional untuk Bab 6-10
    - Test fungsionalitas kuis untuk Bab 6-10
    - _Requirements: 6.1-6.5_
  
  - [ ] 16.3 Test fungsional untuk Bab 11-15
    - Test fungsionalitas kuis untuk Bab 11-15
    - _Requirements: 6.1-6.5_
  
  - [ ] 16.4 Test fungsional untuk Bab 16-20
    - Test fungsionalitas kuis untuk Bab 16-20
    - _Requirements: 6.1-6.5_
  
  - [ ] 16.5 Test fungsional untuk Bab 21-25
    - Test fungsionalitas kuis untuk Bab 21-25
    - _Requirements: 6.1-6.5_

- [x] 17. Update VALIDATION_CHECKLIST.md
  - Tambahkan section untuk validasi soal JLPT N5
  - Tambahkan checklist untuk distribusi kategori (40% vocab, 40% grammar, 20% reading)
  - Tambahkan checklist untuk validasi field category
  - Tambahkan checklist untuk kualitas soal (relevansi materi, tingkat kesulitan N5, distractor quality)
  - _Requirements: 1.1-1.5, 2.1-2.6_

- [x] 18. Final checkpoint - Review keseluruhan implementasi
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks dibagi per batch 5 bab untuk memudahkan review dan validasi
- Setiap batch memiliki checkpoint untuk memastikan kualitas sebelum lanjut ke batch berikutnya
- Tidak ada perubahan kode JavaScript yang diperlukan - hanya penambahan data JSON
- Field `category` bersifat opsional dan backward compatible dengan soal lama
- Fokus pada kualitas soal: relevansi materi, tingkat kesulitan N5, dan distractor yang masuk akal
- Setiap soal harus menggunakan vocabulary dan grammar dari bab yang sesuai atau sebelumnya
