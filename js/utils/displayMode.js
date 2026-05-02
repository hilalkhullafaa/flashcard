/**
 * Display Mode Manager
 * Manages kanji/hiragana display mode state and persistence
 * 
 * Requirements: 2.3, 2.6, 2.8, 2.10, 5.3
 */

const STORAGE_KEY = 'minna_display_mode';
const DEFAULT_MODE = 'kanji';

/**
 * DisplayModeManager class
 * Manages the display mode state (kanji/hiragana) with localStorage persistence
 * and listener pattern for mode change notifications
 */
class DisplayModeManager {
  constructor() {
    this.mode = this.loadMode();
    this.listeners = [];
  }
  
  /**
   * Get the current display mode
   * 
   * @returns {'kanji'|'hiragana'} Current display mode
   * 
   * Requirements: 2.3
   */
  getMode() {
    return this.mode;
  }
  
  /**
   * Set the display mode
   * 
   * @param {'kanji'|'hiragana'} mode - Display mode to set
   * 
   * Requirements: 2.3, 2.6, 2.10
   */
  setMode(mode) {
    if (mode !== 'kanji' && mode !== 'hiragana') {
      console.error('Invalid display mode:', mode);
      return;
    }
    this.mode = mode;
    this.saveMode();
    this.notifyListeners();
  }
  
  /**
   * Toggle between kanji and hiragana modes
   * 
   * Requirements: 2.6, 5.3
   */
  toggle() {
    const newMode = this.mode === 'kanji' ? 'hiragana' : 'kanji';
    this.setMode(newMode);
  }
  
  /**
   * Save the current mode to localStorage
   * Handles localStorage errors gracefully
   * 
   * Requirements: 2.10
   */
  saveMode() {
    try {
      localStorage.setItem(STORAGE_KEY, this.mode);
    } catch (error) {
      console.error('Failed to save display mode:', error);
    }
  }
  
  /**
   * Load the display mode from localStorage
   * Returns default mode if not found or on error
   * 
   * @returns {'kanji'|'hiragana'} Loaded display mode or default
   * 
   * Requirements: 2.8, 2.10
   */
  loadMode() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'hiragana' ? 'hiragana' : DEFAULT_MODE;
    } catch (error) {
      console.error('Failed to load display mode:', error);
      return DEFAULT_MODE;
    }
  }
  
  /**
   * Add a listener for mode change events
   * 
   * @param {Function} callback - Callback function to invoke on mode change
   *                              Receives the new mode as parameter
   * 
   * Requirements: 2.6
   */
  addListener(callback) {
    this.listeners.push(callback);
  }
  
  /**
   * Remove a listener for mode change events
   * 
   * @param {Function} callback - Callback function to remove
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }
  
  /**
   * Notify all registered listeners of mode change
   * 
   * Requirements: 2.6
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.mode));
  }
}

// Singleton instance
const displayModeManager = new DisplayModeManager();

export { displayModeManager };
