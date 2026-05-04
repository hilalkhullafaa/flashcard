# Vocabulary Progress Deduplication Fix - Bugfix Design

## Overview

Bug ini terkait dengan duplikasi data dalam sistem progress tracking untuk vocabulary dan kanji. Masalah utama adalah:

1. **Total Progress Counting**: Vocabulary yang sama di berbagai bab dihitung sebagai item terpisah, menghasilkan total count yang tidak akurat
2. **Status Synchronization**: Status "sudah dihapal" tidak tersinkronisasi antar bab untuk vocabulary yang sama

Strategi perbaikan menggunakan **deduplikasi berbasis identifier unik** (kombinasi kanji+kana) untuk vocabulary dan kanji text untuk kanji. Perbaikan ini akan memastikan:
- Total count hanya menghitung item unik
- Status "sudah dihapal" tersinkronisasi di semua bab untuk vocabulary/kanji yang sama
- Backward compatibility dengan data localStorage yang sudah ada

## Glossary

- **Bug_Condition (C)**: Kondisi yang memicu bug - ketika vocabulary dengan kombinasi kanji+kana yang sama atau kanji yang sama muncul di berbagai bab
- **Property (P)**: Perilaku yang diharapkan - deduplikasi pada total count dan sinkronisasi status antar bab
- **Preservation**: Perilaku existing yang harus tetap tidak berubah - format localStorage, progress per bab, validasi data
- **Unique Identifier**: Kombinasi `kanji + "|" + kana` yang mengidentifikasi vocabulary unik secara global
- **Kanji Text**: String kanji yang digunakan sebagai identifier untuk kanji memorization
- **vocabMemorized**: Set yang menyimpan vocabulary ID yang sudah dihapal
- **kanjiMemorized**: Set yang menyimpan kanji text yang sudah dihapal
- **localStorage**: Browser storage untuk persistence data progress

## Bug Details

### Bug Condition

Bug terjadi ketika sistem menghitung total progress atau menyimpan status "sudah dihapal" untuk vocabulary/kanji yang muncul di berbagai bab. Sistem saat ini menggunakan vocabulary ID (format: `ch##_###`) sebagai identifier, yang bersifat unik per bab, sehingga vocabulary yang sama di bab berbeda dianggap sebagai item terpisah.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type VocabularyItem OR ProgressTrackingOperation
  OUTPUT: boolean
  
  IF input is VocabularyItem THEN
    // Bug condition for duplicate vocabulary
    RETURN EXISTS other_vocab IN all_chapters WHERE
           other_vocab.id != input.id AND
           other_vocab.kanji == input.kanji AND
           other_vocab.kana == input.kana
  
  ELSE IF input is ProgressTrackingOperation THEN
    // Bug condition for total count calculation
    IF input.operation == "calculateTotalVocab" THEN
      RETURN EXISTS duplicate_vocab WHERE
             COUNT(vocab WITH same kanji+kana) > 1
    
    ELSE IF input.operation == "calculateTotalKanji" THEN
      RETURN EXISTS duplicate_kanji WHERE
             COUNT(kanji WITH same kanji_text) > 1
    
    ELSE IF input.operation == "markMemorized" THEN
      // Bug condition for status synchronization
      RETURN EXISTS other_vocab IN other_chapters WHERE
             other_vocab has same kanji+kana BUT
             other_vocab.memorized_status != input.vocab.memorized_status
  
  RETURN FALSE
END FUNCTION
```

### Examples

**Example 1: Duplicate Vocabulary Count**
- Vocabulary "私" (わたし) muncul di:
  - Chapter 1: `ch01_001` dengan kanji="私", kana="わたし"
  - Chapter 3: `ch03_025` dengan kanji="私", kana="わたし"
- **Current Behavior**: Total count = 2 (dihitung terpisah)
- **Expected Behavior**: Total count = 1 (deduplikasi berdasarkan kanji+kana)

**Example 2: Unsynchronized Status**
- User menandai "私" (わたし) sebagai sudah dihapal di Chapter 1
- **Current Behavior**: Status hanya tersimpan untuk `ch01_001`, vocabulary yang sama di Chapter 3 (`ch03_025`) masih unchecked
- **Expected Behavior**: Status tersinkronisasi, checkbox di Chapter 3 juga checked

**Example 3: Duplicate Kanji Count**
- Kanji "私" muncul di berbagai vocabulary:
  - `ch01_001`: kanji="私"
  - `ch03_025`: kanji="私"
- **Current Behavior**: Jika kedua vocabulary ditandai, kanji "私" dihitung 2 kali
- **Expected Behavior**: Kanji "私" hanya dihitung 1 kali dalam total

**Example 4: Edge Case - Vocabulary Tanpa Kanji**
- Vocabulary "あなた" (あなた) di Chapter 1: kanji="", kana="あなた"
- **Expected Behavior**: Tetap dihitung dalam total vocabulary, tidak dihitung dalam total kanji

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Format data localStorage tetap menggunakan array of strings untuk kompatibilitas
- Progress per bab tetap menghitung semua vocabulary items tanpa deduplikasi
- Validasi dan pembersihan data invalid/corrupted tetap berfungsi
- Debounced save (100ms) untuk optimasi performa tetap digunakan
- Warning untuk localStorage unavailable/quota exceeded tetap ditampilkan
- Daftar vocabulary yang sudah dihapal tetap menampilkan informasi lengkap

**Scope:**
Semua operasi yang TIDAK melibatkan total count keseluruhan atau sinkronisasi status antar bab harus tetap tidak terpengaruh. Ini termasuk:
- Perhitungan progress per bab individual
- Display vocabulary list dalam satu bab
- Operasi CRUD pada data vocabulary
- Error handling dan edge case handling

## Hypothesized Root Cause

Berdasarkan analisis kode di `progress.js`, root cause dari bug ini adalah:

1. **Vocabulary ID sebagai Primary Identifier**: Sistem menggunakan vocabulary ID (format `ch##_###`) sebagai identifier utama, yang bersifat unik per bab. Ini menyebabkan vocabulary yang sama di bab berbeda dianggap sebagai item terpisah.

2. **Tidak Ada Deduplikasi pada Total Count**: Fungsi `getStats()` menghitung total dengan iterasi semua vocabulary tanpa memeriksa duplikasi berdasarkan konten (kanji+kana).

3. **Status Tracking Berbasis Vocabulary ID**: Set `vocabMemorized` dan `kanjiMemorized` menyimpan vocabulary ID, bukan identifier unik global. Ini menyebabkan status tidak tersinkronisasi antar bab.

4. **Kanji Tracking Menggunakan Kanji Text**: Sistem sudah menggunakan kanji text sebagai identifier untuk kanji memorization, tetapi total count tidak melakukan deduplikasi.

## Correctness Properties

Property 1: Bug Condition - Deduplikasi Total Count

_For any_ vocabulary item atau kanji yang muncul di berbagai bab dengan kombinasi kanji+kana yang sama (untuk vocabulary) atau kanji text yang sama (untuk kanji), sistem SHALL menghitung item tersebut hanya sekali dalam total count keseluruhan, menghasilkan total yang akurat berdasarkan jumlah vocabulary/kanji unik.

**Validates: Requirements 2.1, 2.2**

Property 2: Bug Condition - Sinkronisasi Status Antar Bab

_For any_ vocabulary atau kanji yang ditandai sebagai "sudah dihapal" di bab manapun, sistem SHALL menyimpan status berdasarkan identifier unik (kombinasi kanji+kana untuk vocabulary, kanji text untuk kanji) dan menerapkan status tersebut ke semua vocabulary/kanji dengan identifier yang sama di semua bab, sehingga checkbox status tersinkronisasi.

**Validates: Requirements 2.3, 2.4, 2.5, 2.6**

Property 3: Preservation - Format Data dan Kompatibilitas

_For any_ operasi save/load ke localStorage, sistem SHALL CONTINUE TO menggunakan format data yang sama (array of strings) dan melakukan validasi/pembersihan data invalid, memastikan backward compatibility dengan data yang sudah ada dan forward compatibility dengan data baru.

**Validates: Requirements 3.2, 3.4**

Property 4: Preservation - Progress Per Bab

_For any_ operasi perhitungan progress per bab individual, sistem SHALL CONTINUE TO menghitung semua vocabulary items dalam bab tersebut tanpa deduplikasi, karena deduplikasi hanya berlaku untuk total keseluruhan.

**Validates: Requirements 3.3**

## Fix Implementation

### Changes Required

Berdasarkan analisis root cause, berikut adalah perubahan yang diperlukan:

**File**: `js/modules/progress.js`

**Specific Changes**:

1. **Tambahkan Helper Function untuk Unique Identifier**:
   - Buat fungsi `_getVocabUniqueKey(vocab)` yang mengembalikan `${vocab.kanji}|${vocab.kana}`
   - Fungsi ini akan digunakan untuk deduplikasi dan sinkronisasi status

2. **Modifikasi `getStats()` untuk Deduplikasi Total Count**:
   - Gunakan `Map` untuk tracking vocabulary unik berdasarkan unique key (kanji+kana)
   - Gunakan `Set` untuk tracking kanji unik berdasarkan kanji text
   - Update cache `cachedTotals` dengan hasil deduplikasi

3. **Modifikasi `markVocabMemorized()` untuk Sinkronisasi Status**:
   - Cari semua vocabulary dengan unique key yang sama di semua bab
   - Tambahkan semua vocabulary ID yang match ke `vocabMemorized` Set
   - Ini memastikan status tersinkronisasi antar bab

4. **Modifikasi `markVocabForgotten()` untuk Sinkronisasi Status**:
   - Cari semua vocabulary dengan unique key yang sama di semua bab
   - Hapus semua vocabulary ID yang match dari `vocabMemorized` Set
   - Ini memastikan status removal tersinkronisasi antar bab

5. **Modifikasi `isVocabMemorized()` untuk Check Berbasis Unique Key**:
   - Cari vocabulary item berdasarkan vocabId
   - Generate unique key dari vocabulary item
   - Check apakah ada vocabulary ID lain dengan unique key yang sama di `vocabMemorized`
   - Return true jika ada match

6. **Kanji Tracking Tetap Menggunakan Kanji Text**:
   - Sistem sudah menggunakan kanji text sebagai identifier
   - Hanya perlu memastikan deduplikasi pada total count di `getStats()`
   - Tidak perlu perubahan pada `markKanjiMemorized()` dan `markKanjiForgotten()`

7. **Backward Compatibility untuk Data Lama**:
   - Pada `load()`, deteksi format data lama (vocabulary ID) vs format baru (unique key)
   - Jika data lama terdeteksi, lakukan migrasi otomatis:
     - Untuk setiap vocabulary ID di `vocabMemorized`, cari vocabulary item
     - Generate unique key dan cari semua vocabulary ID dengan unique key yang sama
     - Tambahkan semua vocabulary ID yang match ke `vocabMemorized`
   - Simpan data yang sudah dimigrasi

### Data Structure Changes

**Current localStorage format**:
```javascript
// mnn_vocab_progress: array of vocabulary IDs
["ch01_001", "ch01_002", "ch03_025"]

// mnn_kanji_progress: array of kanji texts
["私", "学生", "先生"]
```

**New localStorage format** (tetap sama untuk backward compatibility):
```javascript
// mnn_vocab_progress: array of vocabulary IDs (semua ID dengan unique key yang sama)
["ch01_001", "ch03_025", "ch07_032"]  // semua vocabulary dengan kanji="私", kana="わたし"

// mnn_kanji_progress: array of kanji texts (tidak berubah)
["私", "学生", "先生"]
```

**Internal data structure** (tidak berubah):
```javascript
// vocabMemorized: Set of vocabulary IDs
Set(["ch01_001", "ch03_025", "ch07_032"])

// kanjiMemorized: Set of kanji texts
Set(["私", "学生", "先生"])
```

### Migration Strategy

**Automatic Migration on Load**:
1. Deteksi apakah data perlu migrasi (check jika ada vocabulary dengan unique key yang sama tetapi tidak semua ID-nya ada di Set)
2. Jika perlu migrasi:
   - Untuk setiap vocabulary ID di `vocabMemorized`
   - Cari semua vocabulary ID lain dengan unique key yang sama
   - Tambahkan ke `vocabMemorized`
3. Simpan data yang sudah dimigrasi
4. Log migrasi untuk debugging

**No Breaking Changes**:
- Format localStorage tetap sama (array of strings)
- Hanya isi array yang berubah (lebih banyak ID untuk vocabulary yang sama)
- Data lama tetap valid dan akan dimigrasi otomatis

## Testing Strategy

### Validation Approach

Testing strategy mengikuti pendekatan dua fase: pertama, surface counterexamples yang mendemonstrasikan bug pada kode yang belum diperbaiki, kemudian verifikasi bahwa fix bekerja dengan benar dan mempertahankan behavior yang ada.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples yang mendemonstrasikan bug SEBELUM mengimplementasikan fix. Konfirmasi atau refute analisis root cause. Jika refute, perlu re-hypothesize.

**Test Plan**: Tulis test yang mensimulasikan skenario duplikasi vocabulary dan kanji di berbagai bab, serta skenario marking/unmarking status. Jalankan test pada kode UNFIXED untuk mengamati failure dan memahami root cause.

**Test Cases**:
1. **Duplicate Vocabulary Count Test**: Buat mock data dengan vocabulary yang sama di 2 bab berbeda, hitung total count (akan fail pada unfixed code - count = 2 instead of 1)
2. **Duplicate Kanji Count Test**: Buat mock data dengan kanji yang sama di berbagai vocabulary, hitung total kanji count (akan fail pada unfixed code - count > 1 for same kanji)
3. **Unsynchronized Status Test**: Mark vocabulary di bab 1, check status di bab 3 untuk vocabulary yang sama (akan fail pada unfixed code - status not synchronized)
4. **Status Removal Synchronization Test**: Mark vocabulary di semua bab, unmark di satu bab, check status di bab lain (akan fail pada unfixed code - status not synchronized on removal)

**Expected Counterexamples**:
- Total count lebih besar dari jumlah vocabulary/kanji unik sebenarnya
- Status "sudah dihapal" tidak tersinkronisasi antar bab untuk vocabulary yang sama
- Possible causes: vocabulary ID sebagai identifier, tidak ada deduplikasi, tidak ada sinkronisasi status

### Fix Checking

**Goal**: Verifikasi bahwa untuk semua input dimana bug condition berlaku, fungsi yang sudah diperbaiki menghasilkan behavior yang diharapkan.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := fixedFunction(input)
  ASSERT expectedBehavior(result)
END FOR

WHERE expectedBehavior(result) IS:
  IF input is duplicate vocabulary THEN
    ASSERT result.totalCount == uniqueCount(vocabulary by kanji+kana)
  
  ELSE IF input is duplicate kanji THEN
    ASSERT result.totalCount == uniqueCount(kanji by kanji_text)
  
  ELSE IF input is mark memorized operation THEN
    ASSERT ALL vocabulary with same kanji+kana are marked
  
  ELSE IF input is mark forgotten operation THEN
    ASSERT ALL vocabulary with same kanji+kana are unmarked
END WHERE
```

**Test Cases**:
1. **Deduplicated Vocabulary Count**: Verify total count equals unique vocabulary count
2. **Deduplicated Kanji Count**: Verify total kanji count equals unique kanji count
3. **Synchronized Mark Status**: Verify marking in one chapter marks all chapters
4. **Synchronized Unmark Status**: Verify unmarking in one chapter unmarks all chapters
5. **Unique Identifier Correctness**: Verify unique key generation is consistent

### Preservation Checking

**Goal**: Verifikasi bahwa untuk semua input dimana bug condition TIDAK berlaku, fungsi yang sudah diperbaiki menghasilkan hasil yang sama dengan fungsi original.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalFunction(input) = fixedFunction(input)
END FOR
```

**Testing Approach**: Property-based testing direkomendasikan untuk preservation checking karena:
- Menghasilkan banyak test case secara otomatis di seluruh input domain
- Menangkap edge case yang mungkin terlewat oleh manual unit test
- Memberikan jaminan kuat bahwa behavior tidak berubah untuk semua input non-buggy

**Test Plan**: Observe behavior pada kode UNFIXED terlebih dahulu untuk operasi yang tidak terkait bug (progress per bab, localStorage format, validasi data), kemudian tulis property-based test yang menangkap behavior tersebut.

**Test Cases**:
1. **Progress Per Bab Preservation**: Observe bahwa progress per bab menghitung semua items tanpa deduplikasi pada unfixed code, kemudian verify behavior tetap sama setelah fix
2. **localStorage Format Preservation**: Observe format localStorage (array of strings) pada unfixed code, verify format tetap sama setelah fix
3. **Data Validation Preservation**: Observe validasi dan pembersihan data invalid pada unfixed code, verify behavior tetap sama setelah fix
4. **Debounced Save Preservation**: Observe debounced save (100ms) pada unfixed code, verify behavior tetap sama setelah fix
5. **Storage Warning Preservation**: Observe warning untuk localStorage unavailable pada unfixed code, verify behavior tetap sama setelah fix

### Unit Tests

- Test unique key generation untuk berbagai kombinasi kanji+kana
- Test deduplikasi pada getStats() dengan mock data yang memiliki duplikasi
- Test sinkronisasi status pada markVocabMemorized() dan markVocabForgotten()
- Test backward compatibility dengan data localStorage format lama
- Test edge case: vocabulary tanpa kanji, vocabulary dengan kanji yang sama tetapi kana berbeda
- Test migration logic untuk data lama

### Property-Based Tests

- Generate random chapter data dengan vocabulary yang mungkin duplikat, verify total count selalu equals unique count
- Generate random marking operations, verify status selalu tersinkronisasi untuk vocabulary dengan unique key yang sama
- Generate random localStorage data (format lama dan baru), verify load() selalu berhasil dan data valid
- Test preservation: generate random operations yang tidak terkait bug, verify behavior tidak berubah

### Integration Tests

- Test full flow: load data lama -> migrasi otomatis -> mark vocabulary -> verify sinkronisasi -> save -> reload -> verify persistence
- Test full flow: create new data -> mark vocabulary di berbagai bab -> verify deduplikasi total count
- Test full flow: mark vocabulary -> unmark -> verify removal tersinkronisasi
- Test interaction dengan UI: verify checkbox status tersinkronisasi di berbagai bab
- Test performance: verify deduplikasi tidak memperlambat operasi secara signifikan
