# Flashcard Kanji Filter Bugfix Design

## Overview

Bug ini terjadi pada fitur flashcard mode "Kanji Saja" yang masih menampilkan vocabulary dengan field `kanji` berisi hiragana atau katakana, padahal seharusnya hanya menampilkan vocabulary yang benar-benar mengandung karakter kanji. Penyebab utamanya adalah filter yang hanya memeriksa apakah field `kanji` tidak kosong (`v.kanji && v.kanji !== ''`), tanpa memvalidasi apakah isinya benar-benar karakter kanji.

Solusi yang akan diterapkan adalah menambahkan fungsi helper `hasKanji()` di `js/utils.js` yang memeriksa apakah sebuah string mengandung minimal satu karakter kanji menggunakan Unicode range, kemudian menggunakan fungsi ini di filter vocabulary pada `js/modules/flashcard.js`.

## Glossary

- **Bug_Condition (C)**: Kondisi yang memicu bug - ketika mode "Kanji Saja" dipilih dan vocabulary dengan field `kanji` berisi hanya hiragana atau katakana ditampilkan
- **Property (P)**: Perilaku yang diinginkan - mode "Kanji Saja" hanya menampilkan vocabulary yang field `kanji`-nya mengandung minimal satu karakter kanji sebenarnya
- **Preservation**: Perilaku mode "Semua Kosakata" dan fungsi lainnya yang harus tetap tidak berubah setelah fix
- **hasKanji()**: Fungsi helper baru di `js/utils.js` yang memeriksa apakah string mengandung karakter kanji menggunakan Unicode range
- **kanjiVocabulary**: Array hasil filter vocabulary yang hanya berisi vocabulary dengan kanji valid
- **Kanji Unicode Range**: U+4E00-U+9FAF (CJK Unified Ideographs), U+3400-U+4DBF (CJK Extension A)
- **Hiragana Unicode Range**: U+3040-U+309F
- **Katakana Unicode Range**: U+30A0-U+30FF

## Bug Details

### Bug Condition

Bug terjadi ketika pengguna memilih mode "Kanji Saja" di flashcard. Fungsi `renderFlashcard()` di `js/modules/flashcard.js` menggunakan filter `v.kanji && v.kanji !== ''` untuk memilih vocabulary kanji, yang hanya memeriksa apakah field `kanji` tidak kosong tanpa memvalidasi apakah isinya benar-benar karakter kanji.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { mode: string, vocabulary: VocabEntry }
  OUTPUT: boolean
  
  RETURN input.mode === 'kanji'
         AND input.vocabulary.kanji !== null
         AND input.vocabulary.kanji !== ''
         AND NOT containsActualKanji(input.vocabulary.kanji)
         AND vocabularyIsDisplayed(input.vocabulary)
END FUNCTION

FUNCTION containsActualKanji(text)
  INPUT: text of type string
  OUTPUT: boolean
  
  FOR EACH character IN text DO
    charCode := character.codePointAt(0)
    IF (charCode >= 0x4E00 AND charCode <= 0x9FAF) OR
       (charCode >= 0x3400 AND charCode <= 0x4DBF) THEN
      RETURN true
    END IF
  END FOR
  RETURN false
END FUNCTION
```

### Examples

- **Contoh 1**: Mode "Kanji Saja" dipilih, vocabulary dengan `kanji: "あなた"` (hiragana) ditampilkan → BUG (seharusnya tidak ditampilkan)
- **Contoh 2**: Mode "Kanji Saja" dipilih, vocabulary dengan `kanji: "エンジニア"` (katakana) ditampilkan → BUG (seharusnya tidak ditampilkan)
- **Contoh 3**: Mode "Kanji Saja" dipilih, vocabulary dengan `kanji: "私"` (kanji) ditampilkan → CORRECT (seharusnya ditampilkan)
- **Contoh 4**: Mode "Kanji Saja" dipilih, vocabulary dengan `kanji: "会社員"` (kanji) ditampilkan → CORRECT (seharusnya ditampilkan)
- **Edge case**: Mode "Kanji Saja" dipilih, vocabulary dengan `kanji: "〜さん"` (simbol + hiragana) tidak ditampilkan → CORRECT (tidak mengandung kanji)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Mode "Semua Kosakata" harus tetap menampilkan semua vocabulary termasuk yang hanya berisi hiragana atau katakana
- Tampilan kartu flashcard (front dan back) harus tetap sama untuk kedua mode
- Fungsi navigasi (Sebelumnya, Berikutnya, Acak) harus tetap berfungsi normal
- Fungsi progress tracking (Sudah Ingat, Belum Ingat) harus tetap berfungsi dengan benar
- Penyimpanan pilihan mode ke localStorage harus tetap berfungsi
- Pesan "Tidak ada kosakata kanji di bab ini" dengan tombol "Lihat Semua Kosakata" harus tetap muncul jika tidak ada vocabulary dengan kanji valid

**Scope:**
Semua input yang TIDAK melibatkan mode "Kanji Saja" harus sama sekali tidak terpengaruh oleh fix ini. Ini termasuk:
- Mode "Semua Kosakata" - tetap menampilkan semua vocabulary
- Interaksi dengan kartu (flip, navigasi) - tetap berfungsi sama
- Progress tracking - tetap menyimpan data dengan benar
- Fungsi utility lainnya di `js/utils.js` - tidak terpengaruh

## Hypothesized Root Cause

Berdasarkan analisis kode di `js/modules/flashcard.js` baris 51-52, penyebab bug yang paling mungkin adalah:

1. **Filter Tidak Memvalidasi Konten**: Filter `v.kanji && v.kanji !== ''` hanya memeriksa apakah field `kanji` ada dan tidak kosong, tanpa memeriksa apakah isinya benar-benar karakter kanji
   - Vocabulary dengan `kanji: "あなた"` (hiragana) lolos filter karena field tidak kosong
   - Vocabulary dengan `kanji: "エンジニア"` (katakana) lolos filter karena field tidak kosong

2. **Tidak Ada Fungsi Helper untuk Deteksi Kanji**: Tidak ada fungsi utility yang memeriksa apakah string mengandung karakter kanji sebenarnya
   - Perlu fungsi yang memeriksa Unicode range karakter kanji
   - Fungsi ini harus membedakan kanji dari hiragana dan katakana

3. **Asumsi Data yang Salah**: Kode mengasumsikan bahwa jika field `kanji` terisi, maka isinya pasti karakter kanji
   - Asumsi ini tidak valid karena data vocabulary menggunakan field `kanji` untuk menyimpan berbagai jenis karakter Jepang
   - Beberapa vocabulary tidak memiliki representasi kanji dan menggunakan hiragana/katakana di field `kanji`

## Correctness Properties

Property 1: Bug Condition - Kanji Filter Validation

_For any_ vocabulary entry where mode "Kanji Saja" is selected and the `kanji` field contains at least one actual kanji character (Unicode range U+4E00-U+9FAF or U+3400-U+4DBF), the fixed filter function SHALL include that vocabulary in the displayed flashcard set.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - All Vocabulary Mode Behavior

_For any_ vocabulary entry where mode "Semua Kosakata" is selected, the fixed code SHALL display exactly the same vocabulary entries as the original code, preserving all existing functionality including display format, navigation, and progress tracking.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**

## Fix Implementation

### Changes Required

Berdasarkan analisis root cause, fix yang diperlukan adalah:

**File 1**: `js/utils.js`

**Function**: Tambahkan fungsi helper baru `hasKanji()`

**Specific Changes**:
1. **Tambahkan fungsi `hasKanji()`**: Fungsi ini akan memeriksa apakah sebuah string mengandung minimal satu karakter kanji
   - Input: string yang akan diperiksa
   - Output: boolean (true jika mengandung kanji, false jika tidak)
   - Implementasi: Loop melalui setiap karakter dan periksa apakah code point-nya berada di range kanji Unicode
   - Range kanji: U+4E00-U+9FAF (CJK Unified Ideographs) atau U+3400-U+4DBF (CJK Extension A)

2. **Export fungsi `hasKanji()`**: Tambahkan ke export statement agar bisa digunakan di module lain

**File 2**: `js/modules/flashcard.js`

**Function**: `renderFlashcard()`

**Specific Changes**:
1. **Import fungsi `hasKanji()`**: Tambahkan import dari `../utils.js` di baris 1
   ```javascript
   import { shuffleArray, getNextIndex, getPrevIndex, hasKanji } from '../utils.js';
   ```

2. **Update filter kanjiVocabulary**: Ganti filter di baris 51-52 dari:
   ```javascript
   const kanjiVocabulary = allVocabulary.filter(v => v.kanji && v.kanji !== '');
   ```
   Menjadi:
   ```javascript
   const kanjiVocabulary = allVocabulary.filter(v => v.kanji && hasKanji(v.kanji));
   ```

3. **Tidak ada perubahan lain**: Semua logic lainnya tetap sama, termasuk:
   - Mode handling dan persistence
   - Card display logic (front/back)
   - Navigation buttons
   - Progress tracking
   - Empty state handling

## Testing Strategy

### Validation Approach

Testing strategy mengikuti pendekatan dua fase: pertama, surface counterexamples yang mendemonstrasikan bug pada kode yang belum diperbaiki, kemudian verifikasi bahwa fix bekerja dengan benar dan mempertahankan perilaku yang ada.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples yang mendemonstrasikan bug SEBELUM mengimplementasikan fix. Konfirmasi atau refute analisis root cause. Jika kita refute, kita perlu re-hypothesize.

**Test Plan**: Tulis test yang mensimulasikan pemilihan mode "Kanji Saja" dan memeriksa vocabulary mana yang ditampilkan. Jalankan test ini pada kode UNFIXED untuk mengobservasi failure dan memahami root cause.

**Test Cases**:
1. **Hiragana in Kanji Field Test**: Pilih mode "Kanji Saja", periksa apakah vocabulary dengan `kanji: "あなた"` ditampilkan (akan fail pada unfixed code - seharusnya tidak ditampilkan tapi ditampilkan)
2. **Katakana in Kanji Field Test**: Pilih mode "Kanji Saja", periksa apakah vocabulary dengan `kanji: "エンジニア"` ditampilkan (akan fail pada unfixed code - seharusnya tidak ditampilkan tapi ditampilkan)
3. **Actual Kanji Test**: Pilih mode "Kanji Saja", periksa apakah vocabulary dengan `kanji: "私"` ditampilkan (akan pass pada unfixed code - seharusnya ditampilkan dan ditampilkan)
4. **Mixed Characters Test**: Pilih mode "Kanji Saja", periksa apakah vocabulary dengan `kanji: "会社員"` ditampilkan (akan pass pada unfixed code - mengandung kanji)

**Expected Counterexamples**:
- Vocabulary dengan field `kanji` berisi hanya hiragana atau katakana ditampilkan di mode "Kanji Saja"
- Possible causes: filter hanya memeriksa field tidak kosong, tidak memvalidasi konten

### Fix Checking

**Goal**: Verifikasi bahwa untuk semua input di mana bug condition berlaku, fungsi yang sudah diperbaiki menghasilkan perilaku yang diharapkan.

**Pseudocode:**
```
FOR ALL vocabulary WHERE isBugCondition({ mode: 'kanji', vocabulary }) DO
  result := renderFlashcard_fixed(container, chapterData, { mode: 'kanji' })
  ASSERT NOT vocabularyIsDisplayed(vocabulary)
END FOR

FOR ALL vocabulary WHERE hasActualKanji(vocabulary.kanji) DO
  result := renderFlashcard_fixed(container, chapterData, { mode: 'kanji' })
  ASSERT vocabularyIsDisplayed(vocabulary)
END FOR
```

### Preservation Checking

**Goal**: Verifikasi bahwa untuk semua input di mana bug condition TIDAK berlaku, fungsi yang sudah diperbaiki menghasilkan hasil yang sama dengan fungsi original.

**Pseudocode:**
```
FOR ALL input WHERE input.mode !== 'kanji' DO
  ASSERT renderFlashcard_original(input) = renderFlashcard_fixed(input)
END FOR

FOR ALL interaction WHERE interaction.type IN ['navigation', 'flip', 'progress'] DO
  ASSERT behavior_original(interaction) = behavior_fixed(interaction)
END FOR
```

**Testing Approach**: Property-based testing direkomendasikan untuk preservation checking karena:
- Menghasilkan banyak test case secara otomatis di seluruh input domain
- Menangkap edge case yang mungkin terlewat oleh unit test manual
- Memberikan jaminan kuat bahwa perilaku tidak berubah untuk semua input non-buggy

**Test Plan**: Observasi perilaku pada kode UNFIXED terlebih dahulu untuk mode "Semua Kosakata" dan interaksi lainnya, kemudian tulis property-based test yang menangkap perilaku tersebut.

**Test Cases**:
1. **All Mode Preservation**: Observasi bahwa mode "Semua Kosakata" menampilkan semua vocabulary pada unfixed code, kemudian tulis test untuk verifikasi ini tetap berlaku setelah fix
2. **Card Display Preservation**: Observasi bahwa tampilan kartu (front/back) bekerja dengan benar pada unfixed code, kemudian tulis test untuk verifikasi ini tetap berlaku setelah fix
3. **Navigation Preservation**: Observasi bahwa tombol navigasi bekerja dengan benar pada unfixed code, kemudian tulis test untuk verifikasi ini tetap berlaku setelah fix
4. **Progress Tracking Preservation**: Observasi bahwa progress tracking bekerja dengan benar pada unfixed code, kemudian tulis test untuk verifikasi ini tetap berlaku setelah fix

### Unit Tests

- Test fungsi `hasKanji()` dengan berbagai input:
  - String dengan kanji sebenarnya (harus return true)
  - String dengan hanya hiragana (harus return false)
  - String dengan hanya katakana (harus return false)
  - String dengan campuran kanji dan hiragana (harus return true)
  - String kosong (harus return false)
  - String dengan simbol dan hiragana (harus return false)
- Test filter kanjiVocabulary dengan data vocabulary sample
- Test bahwa mode "Kanji Saja" hanya menampilkan vocabulary dengan kanji valid
- Test bahwa mode "Semua Kosakata" tetap menampilkan semua vocabulary

### Property-Based Tests

- Generate random vocabulary entries dengan berbagai kombinasi kanji/hiragana/katakana dan verifikasi filter bekerja dengan benar
- Generate random chapter data dan verifikasi mode "Semua Kosakata" selalu menampilkan semua vocabulary
- Test bahwa untuk setiap vocabulary dengan kanji valid, mode "Kanji Saja" menampilkannya
- Test bahwa untuk setiap vocabulary tanpa kanji valid, mode "Kanji Saja" tidak menampilkannya

### Integration Tests

- Test full flashcard flow dengan mode "Kanji Saja" di chapter yang memiliki campuran vocabulary
- Test switching antara mode "Semua Kosakata" dan "Kanji Saja"
- Test bahwa empty state muncul dengan benar ketika tidak ada vocabulary dengan kanji valid
- Test bahwa progress tracking tetap berfungsi dengan benar di kedua mode
