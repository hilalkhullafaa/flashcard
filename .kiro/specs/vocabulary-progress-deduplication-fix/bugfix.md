# Bugfix Requirements Document

## Introduction

Sistem progress tracking untuk vocabulary dan kanji saat ini memiliki dua masalah utama terkait duplikasi data:

1. **Duplikasi pada Total Progress Keseluruhan**: Total progress keseluruhan dari kanji dan kosakata (hiragana/katakana) menghitung vocabulary yang sama di berbagai bab sebagai item terpisah, sehingga total count menjadi tidak akurat.

2. **Duplikasi Status "Sudah Dihapal"**: Ketika vocabulary atau kanji ditandai sebagai sudah dihapal (diceklis) di satu bab, status tersebut tidak tersinkronisasi ke bab lain yang memiliki vocabulary yang sama, sehingga pengguna harus menandai ulang vocabulary yang sama di setiap bab.

Bug ini berdampak pada akurasi tracking progress pengguna dan pengalaman pengguna yang tidak efisien karena harus menandai vocabulary yang sama berulang kali.

**Identifier Unik**: Vocabulary yang sama diidentifikasi menggunakan kombinasi value "kanji" dan value "kana" pada setiap vocabulary item.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN menghitung total progress keseluruhan vocabulary THEN sistem menghitung vocabulary dengan kombinasi kanji+kana yang sama di berbagai bab sebagai item terpisah, menghasilkan total count yang lebih besar dari jumlah vocabulary unik sebenarnya

1.2 WHEN menghitung total progress keseluruhan kanji THEN sistem menghitung kanji yang sama di berbagai bab sebagai item terpisah, menghasilkan total count yang lebih besar dari jumlah kanji unik sebenarnya

1.3 WHEN user menandai vocabulary sebagai "sudah dihapal" di bab tertentu (misalnya bab 3) THEN status tersebut hanya tersimpan untuk vocabulary ID spesifik di bab tersebut dan tidak mempengaruhi vocabulary yang sama di bab lain (misalnya bab 7)

1.4 WHEN user menandai kanji sebagai "sudah dihapal" di bab tertentu THEN status tersebut hanya tersimpan untuk kanji text spesifik dari vocabulary ID di bab tersebut dan tidak mempengaruhi vocabulary lain dengan kanji yang sama di bab lain

1.5 WHEN user melihat vocabulary yang sama di bab berbeda THEN checkbox status tidak tersinkronisasi, sehingga vocabulary yang sudah ditandai di bab sebelumnya muncul sebagai belum ditandai di bab lain

### Expected Behavior (Correct)

2.1 WHEN menghitung total progress keseluruhan vocabulary THEN sistem SHALL menghitung vocabulary berdasarkan kombinasi unik kanji+kana, sehingga vocabulary dengan kombinasi yang sama hanya dihitung sekali dalam total count

2.2 WHEN menghitung total progress keseluruhan kanji THEN sistem SHALL menghitung kanji berdasarkan kanji text yang unik, sehingga kanji yang sama hanya dihitung sekali dalam total count

2.3 WHEN user menandai vocabulary sebagai "sudah dihapal" di bab manapun THEN sistem SHALL menyimpan status berdasarkan kombinasi kanji+kana dan menerapkan status tersebut ke semua vocabulary dengan kombinasi yang sama di semua bab

2.4 WHEN user menandai kanji sebagai "sudah dihapal" di bab manapun THEN sistem SHALL menyimpan status berdasarkan kanji text dan menerapkan status tersebut ke semua vocabulary dengan kanji yang sama di semua bab

2.5 WHEN user melihat vocabulary yang sama di bab berbeda THEN checkbox status SHALL tersinkronisasi, menampilkan status yang sama untuk vocabulary dengan kombinasi kanji+kana yang sama di semua bab

2.6 WHEN user menghapus status "sudah dihapal" dari vocabulary di bab manapun THEN sistem SHALL menghapus status tersebut dari semua vocabulary dengan kombinasi kanji+kana yang sama di semua bab

### Unchanged Behavior (Regression Prevention)

3.1 WHEN user menandai vocabulary yang berbeda (kombinasi kanji+kana berbeda) sebagai "sudah dihapal" THEN sistem SHALL CONTINUE TO menyimpan status secara independen untuk setiap vocabulary unik

3.2 WHEN sistem menyimpan progress ke localStorage THEN sistem SHALL CONTINUE TO menggunakan format data yang sama (array of strings) untuk kompatibilitas dengan data yang sudah ada

3.3 WHEN sistem menghitung progress per bab THEN sistem SHALL CONTINUE TO menghitung semua vocabulary items dalam bab tersebut tanpa deduplikasi (karena deduplikasi hanya untuk total keseluruhan)

3.4 WHEN sistem load progress dari localStorage THEN sistem SHALL CONTINUE TO memvalidasi dan membersihkan data yang invalid atau corrupted

3.5 WHEN user melihat daftar vocabulary yang sudah dihapal THEN sistem SHALL CONTINUE TO menampilkan informasi lengkap (kanji, kana, romaji, meaning, chapterId) untuk setiap item

3.6 WHEN localStorage tidak tersedia atau quota exceeded THEN sistem SHALL CONTINUE TO menampilkan warning dan tetap berfungsi tanpa persistence

3.7 WHEN sistem melakukan save ke localStorage THEN sistem SHALL CONTINUE TO menggunakan debounced save (100ms) untuk optimasi performa
