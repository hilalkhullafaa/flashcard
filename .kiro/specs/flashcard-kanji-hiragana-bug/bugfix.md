# Bugfix Requirements Document

## Introduction

Pada fitur flashcard aplikasi pembelajaran bahasa Jepang "Minna no Nihongo", terdapat bug di mode "Kanji Saja" yang masih menampilkan vocabulary dengan hiragana atau katakana. Mode "Kanji Saja" seharusnya hanya menampilkan vocabulary yang memiliki karakter kanji sebenarnya, bukan hiragana atau katakana.

Bug ini terjadi karena filter vocabulary untuk mode kanji hanya memeriksa apakah field `kanji` tidak kosong, tanpa memvalidasi apakah isi field tersebut benar-benar mengandung karakter kanji atau hanya hiragana/katakana.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN mode "Kanji Saja" dipilih THEN sistem menampilkan vocabulary yang field `kanji`-nya berisi hiragana (contoh: "これ", "それ", "あれ")

1.2 WHEN mode "Kanji Saja" dipilih THEN sistem menampilkan vocabulary yang field `kanji`-nya berisi katakana (contoh: "ノート", "テレビ", "カード")

1.3 WHEN mode "Kanji Saja" dipilih THEN sistem menggunakan filter `v.kanji && v.kanji !== ''` yang tidak membedakan antara kanji sebenarnya dengan hiragana/katakana

### Expected Behavior (Correct)

2.1 WHEN mode "Kanji Saja" dipilih THEN sistem SHALL hanya menampilkan vocabulary yang field `kanji`-nya mengandung minimal satu karakter kanji sebenarnya (Unicode range: U+4E00-U+9FAF, U+3400-U+4DBF)

2.2 WHEN mode "Kanji Saja" dipilih THEN sistem SHALL mengecualikan vocabulary yang field `kanji`-nya hanya berisi hiragana (Unicode range: U+3040-U+309F)

2.3 WHEN mode "Kanji Saja" dipilih THEN sistem SHALL mengecualikan vocabulary yang field `kanji`-nya hanya berisi katakana (Unicode range: U+30A0-U+30FF)

2.4 WHEN vocabulary dengan kanji valid ditampilkan di mode "Kanji Saja" THEN bagian depan kartu SHALL hanya menampilkan field `kanji` tanpa menampilkan field `kana`

### Unchanged Behavior (Regression Prevention)

3.1 WHEN mode "Semua Kosakata" dipilih THEN sistem SHALL CONTINUE TO menampilkan semua vocabulary termasuk yang hanya berisi hiragana atau katakana

3.2 WHEN vocabulary ditampilkan di mode "Semua Kosakata" THEN sistem SHALL CONTINUE TO menampilkan field `kanji` (jika ada) dan field `kana`

3.3 WHEN kartu flashcard dibalik (flip) di mode "Kanji Saja" THEN sistem SHALL CONTINUE TO menampilkan kana, romaji, arti, dan word class di bagian belakang

3.4 WHEN tidak ada vocabulary dengan kanji valid di suatu chapter THEN sistem SHALL CONTINUE TO menampilkan pesan "Tidak ada kosakata kanji di bab ini" dengan tombol "Lihat Semua Kosakata"

3.5 WHEN tombol navigasi (Sebelumnya, Berikutnya, Acak) digunakan THEN sistem SHALL CONTINUE TO berfungsi normal di kedua mode

3.6 WHEN tombol "Sudah Ingat" atau "Belum Ingat" diklik THEN sistem SHALL CONTINUE TO menyimpan progress dengan benar menggunakan progressTracker

3.7 WHEN mode flashcard dipilih THEN sistem SHALL CONTINUE TO menyimpan pilihan mode ke localStorage dengan key `mnn_flashcard_mode_ch{chapterId}`
