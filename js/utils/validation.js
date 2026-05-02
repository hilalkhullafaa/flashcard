/**
 * Data Validation Utility
 * Validates chapter data structure and content for Minna no Nihongo application
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 4.7
 */

/**
 * Validate conversation data structure
 * 
 * @param {Object} conversation - Conversation object to validate
 * @returns {Object} Validation result with valid flag, errors array, and warnings array
 * 
 * Requirements: 4.3, 4.6, 13.2, 13.3, 13.10
 */
export function validateConversation(conversation) {
  const errors = [];
  const warnings = [];
  
  // Enhanced error handling for missing or invalid conversation object
  // Requirements: 13.2, 13.3
  if (!conversation || typeof conversation !== 'object') {
    const detailedError = `[Validasi Percakapan] Data percakapan tidak valid: bukan objek yang valid. Tipe yang diterima: ${typeof conversation}`;
    errors.push(detailedError);
    console.error(detailedError, { receivedData: conversation });
    return { valid: false, errors, warnings };
  }
  
  // Enhanced error handling for missing or invalid id field
  // Requirements: 13.2, 13.3
  if (!conversation.id || typeof conversation.id !== 'string') {
    const detailedError = `[Validasi Percakapan] Field 'id' tidak ada atau tidak valid. Tipe yang diharapkan: string, Tipe yang diterima: ${typeof conversation.id}`;
    errors.push(detailedError);
    console.error(detailedError, { conversationData: conversation });
  }
  
  // Enhanced error handling for missing or invalid turns array
  // Requirements: 13.2, 13.3
  if (!Array.isArray(conversation.turns)) {
    const detailedError = `[Validasi Percakapan] Field 'turns' tidak ada atau bukan array. ID Percakapan: ${conversation.id || 'tidak diketahui'}, Tipe yang diterima: ${typeof conversation.turns}`;
    errors.push(detailedError);
    console.error(detailedError, { conversationId: conversation.id, receivedTurns: conversation.turns });
  } else if (conversation.turns.length === 0) {
    const detailedError = `[Validasi Percakapan] Array 'turns' kosong. ID Percakapan: ${conversation.id || 'tidak diketahui'}`;
    errors.push(detailedError);
    console.error(detailedError, { conversationId: conversation.id });
  } else {
    // Validate each turn with detailed error messages
    // Requirements: 13.2, 13.3
    conversation.turns.forEach((turn, index) => {
      const turnLocation = `ID Percakapan: ${conversation.id || 'tidak diketahui'}, Giliran ke-${index + 1}`;
      
      if (!turn || typeof turn !== 'object') {
        const detailedError = `[Validasi Percakapan] Giliran ke-${index + 1} tidak valid: bukan objek. ${turnLocation}`;
        errors.push(detailedError);
        console.error(detailedError, { turn, index });
        return;
      }
      
      if (!turn.speaker || typeof turn.speaker !== 'string') {
        const detailedError = `[Validasi Percakapan] Field 'speaker' tidak ada atau tidak valid. ${turnLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof turn.speaker}`;
        errors.push(detailedError);
        console.error(detailedError, { turnLocation, turn });
      }
      
      if (!turn.japanese || typeof turn.japanese !== 'string') {
        const detailedError = `[Validasi Percakapan] Field 'japanese' tidak ada atau tidak valid. ${turnLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof turn.japanese}`;
        errors.push(detailedError);
        console.error(detailedError, { turnLocation, turn });
      }
      
      if (!turn.romaji || typeof turn.romaji !== 'string') {
        const detailedError = `[Validasi Percakapan] Field 'romaji' tidak ada atau tidak valid. ${turnLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof turn.romaji}`;
        errors.push(detailedError);
        console.error(detailedError, { turnLocation, turn });
      }
      
      if (!turn.indonesian || typeof turn.indonesian !== 'string') {
        const detailedError = `[Validasi Percakapan] Field 'indonesian' tidak ada atau tidak valid. ${turnLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof turn.indonesian}`;
        errors.push(detailedError);
        console.error(detailedError, { turnLocation, turn });
      }
      
      // Enhanced warning for missing hiragana field
      // Requirements: 13.2, 13.10
      if (!turn.hiragana) {
        const detailedWarning = `[Validasi Percakapan] Field 'hiragana' tidak ada. ${turnLocation}. Sistem akan menggunakan field 'japanese' sebagai fallback untuk pencocokan furigana.`;
        warnings.push(detailedWarning);
        console.warn(detailedWarning, { turnLocation, turn });
      } else if (typeof turn.hiragana !== 'string') {
        const detailedWarning = `[Validasi Percakapan] Field 'hiragana' tidak valid. ${turnLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof turn.hiragana}`;
        warnings.push(detailedWarning);
        console.warn(detailedWarning, { turnLocation, turn });
      } else if (!isValidHiragana(turn.hiragana)) {
        const detailedWarning = `[Validasi Percakapan] Field 'hiragana' mengandung karakter yang tidak valid. ${turnLocation}. Hiragana harus hanya berisi karakter hiragana, spasi, dan tanda baca.`;
        warnings.push(detailedWarning);
        console.warn(detailedWarning, { turnLocation, hiragana: turn.hiragana });
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate quiz question structure
 * 
 * @param {Object} question - Quiz question object to validate
 * @returns {Object} Validation result with valid flag, errors array, and warnings array
 * 
 * Requirements: 3.9, 6.4, 13.8, 13.9, 13.2, 13.3, 13.10
 */
export function validateQuizQuestion(question) {
  const errors = [];
  const warnings = [];
  
  // Enhanced error handling for missing or invalid question object
  // Requirements: 13.2, 13.3
  if (!question || typeof question !== 'object') {
    const detailedError = `[Validasi Kuis] Data soal tidak valid: bukan objek yang valid. Tipe yang diterima: ${typeof question}`;
    errors.push(detailedError);
    console.error(detailedError, { receivedData: question });
    return { valid: false, errors, warnings };
  }
  
  const questionLocation = `ID Soal: ${question.id || 'tidak diketahui'}`;
  
  // Enhanced error handling for missing or invalid id field
  // Requirements: 13.2, 13.3
  if (!question.id || typeof question.id !== 'string') {
    const detailedError = `[Validasi Kuis] Field 'id' tidak ada atau tidak valid. Tipe yang diharapkan: string, Tipe yang diterima: ${typeof question.id}`;
    errors.push(detailedError);
    console.error(detailedError, { questionData: question });
  }
  
  // Enhanced error handling for missing or invalid question text
  // Requirements: 13.2, 13.3
  if (!question.question || typeof question.question !== 'string') {
    const detailedError = `[Validasi Kuis] Field 'question' tidak ada atau tidak valid. ${questionLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof question.question}`;
    errors.push(detailedError);
    console.error(detailedError, { questionLocation, question });
  }
  
  // Enhanced error handling for missing or invalid chapterId
  // Requirements: 13.2, 13.3
  if (typeof question.chapterId !== 'number') {
    const detailedError = `[Validasi Kuis] Field 'chapterId' tidak ada atau tidak valid. ${questionLocation}, Tipe yang diharapkan: number, Tipe yang diterima: ${typeof question.chapterId}`;
    errors.push(detailedError);
    console.error(detailedError, { questionLocation, chapterId: question.chapterId });
  }
  
  // Enhanced error handling for missing or invalid order
  // Requirements: 13.2, 13.3
  if (typeof question.order !== 'number') {
    const detailedError = `[Validasi Kuis] Field 'order' tidak ada atau tidak valid. ${questionLocation}, Tipe yang diharapkan: number, Tipe yang diterima: ${typeof question.order}`;
    errors.push(detailedError);
    console.error(detailedError, { questionLocation, order: question.order });
  }
  
  // Enhanced error handling for choices array validation
  // Requirements: 13.2, 13.3
  if (!Array.isArray(question.choices)) {
    const detailedError = `[Validasi Kuis] Field 'choices' tidak ada atau bukan array. ${questionLocation}, Tipe yang diterima: ${typeof question.choices}`;
    errors.push(detailedError);
    console.error(detailedError, { questionLocation, choices: question.choices });
  } else if (question.choices.length !== 4) {
    const detailedError = `[Validasi Kuis] Jumlah pilihan jawaban tidak valid. ${questionLocation}, Jumlah yang diharapkan: 4, Jumlah yang diterima: ${question.choices.length}`;
    errors.push(detailedError);
    console.error(detailedError, { questionLocation, choicesCount: question.choices.length, choices: question.choices });
  } else {
    // Validate each choice is a non-empty string
    question.choices.forEach((choice, index) => {
      if (typeof choice !== 'string' || choice.trim() === '') {
        const detailedError = `[Validasi Kuis] Pilihan jawaban ke-${index + 1} tidak valid. ${questionLocation}, Tipe yang diharapkan: string (tidak kosong), Tipe yang diterima: ${typeof choice}`;
        errors.push(detailedError);
        console.error(detailedError, { questionLocation, choiceIndex: index, choice });
      }
    });
  }
  
  // Enhanced error handling for correctIndex validation
  // Requirements: 13.2, 13.3
  if (typeof question.correctIndex !== 'number') {
    const detailedError = `[Validasi Kuis] Field 'correctIndex' tidak ada atau tidak valid. ${questionLocation}, Tipe yang diharapkan: number, Tipe yang diterima: ${typeof question.correctIndex}`;
    errors.push(detailedError);
    console.error(detailedError, { questionLocation, correctIndex: question.correctIndex });
  } else if (question.correctIndex < 0 || question.correctIndex > 3) {
    const detailedError = `[Validasi Kuis] Nilai 'correctIndex' di luar rentang yang valid. ${questionLocation}, Rentang yang diharapkan: 0-3, Nilai yang diterima: ${question.correctIndex}`;
    errors.push(detailedError);
    console.error(detailedError, { questionLocation, correctIndex: question.correctIndex });
  }
  
  // Enhanced error handling for category validation
  // Requirements: 13.2, 13.3
  const validCategories = ['vocabulary', 'grammar', 'reading', 'conversation'];
  if (!question.category || typeof question.category !== 'string') {
    const detailedError = `[Validasi Kuis] Field 'category' tidak ada atau tidak valid. ${questionLocation}, Tipe yang diharapkan: string, Tipe yang diterima: ${typeof question.category}`;
    errors.push(detailedError);
    console.error(detailedError, { questionLocation, category: question.category });
  } else if (!validCategories.includes(question.category)) {
    const detailedError = `[Validasi Kuis] Kategori soal tidak valid. ${questionLocation}, Kategori yang diharapkan: ${validCategories.join(', ')}, Kategori yang diterima: '${question.category}'`;
    errors.push(detailedError);
    console.error(detailedError, { questionLocation, category: question.category, validCategories });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate complete chapter data structure
 * 
 * @param {Object} chapterData - Chapter data object to validate
 * @param {number} chapterId - Chapter ID (1-10 for enhanced chapters)
 * @returns {Object} Validation result with valid flag, errors array, and warnings array
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 4.7, 13.2, 13.3, 13.10
 */
export function validateChapterData(chapterData, chapterId) {
  const errors = [];
  const warnings = [];
  
  // Enhanced error handling for missing or invalid chapter data
  // Requirements: 13.2, 13.3
  if (!chapterData || typeof chapterData !== 'object') {
    const detailedError = `[Validasi Bab] Data bab tidak valid: bukan objek yang valid. Bab: ${chapterId}, Tipe yang diterima: ${typeof chapterData}`;
    errors.push(detailedError);
    console.error(detailedError, { chapterId, receivedData: chapterData });
    return { valid: false, errors, warnings };
  }
  
  // Validate conversations count for chapters 1-10
  if (chapterId >= 1 && chapterId <= 10) {
    const conversations = chapterData.conversations || [];
    
    // Enhanced error handling for conversation count validation
    // Requirements: 13.2, 13.3
    if (!Array.isArray(conversations)) {
      const detailedError = `[Validasi Bab] Field 'conversations' tidak ada atau bukan array. Bab: ${chapterId}, Tipe yang diterima: ${typeof conversations}`;
      errors.push(detailedError);
      console.error(detailedError, { chapterId, conversations });
    } else if (conversations.length !== 10) {
      const detailedError = `[Validasi Bab] Jumlah percakapan tidak sesuai. Bab: ${chapterId}, Jumlah yang diharapkan: 10, Jumlah yang diterima: ${conversations.length}`;
      errors.push(detailedError);
      console.error(detailedError, { chapterId, conversationsCount: conversations.length });
    } else {
      // Validate each conversation with enhanced error messages
      // Requirements: 13.2, 13.3, 13.10
      conversations.forEach((conv, index) => {
        const result = validateConversation(conv);
        if (!result.valid) {
          const detailedError = `[Validasi Bab] Percakapan ke-${index + 1} tidak valid. Bab: ${chapterId}, Error: ${result.errors.join('; ')}`;
          errors.push(detailedError);
          console.error(detailedError, { chapterId, conversationIndex: index, conversation: conv, validationErrors: result.errors });
        }
        if (result.warnings.length > 0) {
          result.warnings.forEach(warning => {
            const detailedWarning = `[Validasi Bab] Percakapan ke-${index + 1}. Bab: ${chapterId}, Peringatan: ${warning}`;
            warnings.push(detailedWarning);
            console.warn(detailedWarning, { chapterId, conversationIndex: index });
          });
        }
      });
    }
  }
  
  // Validate quiz count for chapters 1-10
  if (chapterId >= 1 && chapterId <= 10) {
    const quiz = chapterData.quiz || [];
    
    // Enhanced error handling for quiz count validation
    // Requirements: 13.2, 13.3
    if (!Array.isArray(quiz)) {
      const detailedError = `[Validasi Bab] Field 'quiz' tidak ada atau bukan array. Bab: ${chapterId}, Tipe yang diterima: ${typeof quiz}`;
      errors.push(detailedError);
      console.error(detailedError, { chapterId, quiz });
    } else if (quiz.length !== 50) {
      const detailedError = `[Validasi Bab] Jumlah soal kuis tidak sesuai. Bab: ${chapterId}, Jumlah yang diharapkan: 50, Jumlah yang diterima: ${quiz.length}`;
      errors.push(detailedError);
      console.error(detailedError, { chapterId, quizCount: quiz.length });
    } else {
      // Validate each question with enhanced error messages
      // Requirements: 13.2, 13.3, 13.10
      quiz.forEach((q, index) => {
        const result = validateQuizQuestion(q);
        if (!result.valid) {
          const detailedError = `[Validasi Bab] Soal kuis ke-${index + 1} tidak valid. Bab: ${chapterId}, Error: ${result.errors.join('; ')}`;
          errors.push(detailedError);
          console.error(detailedError, { chapterId, questionIndex: index, question: q, validationErrors: result.errors });
        }
        if (result.warnings.length > 0) {
          result.warnings.forEach(warning => {
            const detailedWarning = `[Validasi Bab] Soal kuis ke-${index + 1}. Bab: ${chapterId}, Peringatan: ${warning}`;
            warnings.push(detailedWarning);
            console.warn(detailedWarning, { chapterId, questionIndex: index });
          });
        }
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Check if text contains only valid hiragana characters
 * 
 * @param {string} text - Text to validate
 * @returns {boolean} True if text contains only valid hiragana characters
 * 
 * Requirements: 4.6
 */
export function isValidHiragana(text) {
  if (typeof text !== 'string') {
    return false;
  }
  
  // Hiragana Unicode range: U+3040 to U+309F
  // Also allow common punctuation and spaces:
  // - U+3000-U+303F: CJK Symbols and Punctuation
  // - U+FF01-U+FF60: Fullwidth forms (！？。、etc.)
  // - Regular spaces and ASCII punctuation
  const hiraganaRegex = /^[\u3040-\u309F\u3000-\u303F\uFF01-\uFF60\s！？。、～ー]*$/;
  return hiraganaRegex.test(text);
}
