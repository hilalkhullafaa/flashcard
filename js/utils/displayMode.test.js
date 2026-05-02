/**
 * Unit tests for Display Mode Manager
 * Tests display mode state management, persistence, and listener pattern
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { displayModeManager } from './displayMode.js';

describe('DisplayModeManager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset the mode to default
    displayModeManager.mode = 'kanji';
    // Clear all listeners
    displayModeManager.listeners = [];
  });

  describe('getMode', () => {
    it('should return the current mode', () => {
      expect(displayModeManager.getMode()).toBe('kanji');
    });

    it('should return hiragana mode when set', () => {
      displayModeManager.mode = 'hiragana';
      expect(displayModeManager.getMode()).toBe('hiragana');
    });
  });

  describe('setMode', () => {
    it('should set kanji mode', () => {
      displayModeManager.setMode('kanji');
      expect(displayModeManager.getMode()).toBe('kanji');
    });

    it('should set hiragana mode', () => {
      displayModeManager.setMode('hiragana');
      expect(displayModeManager.getMode()).toBe('hiragana');
    });

    it('should reject invalid mode', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      displayModeManager.setMode('invalid');
      expect(displayModeManager.getMode()).toBe('kanji'); // Should remain unchanged
      expect(consoleSpy).toHaveBeenCalledWith('Invalid display mode:', 'invalid');
      consoleSpy.mockRestore();
    });

    it('should save mode to localStorage', () => {
      displayModeManager.setMode('hiragana');
      expect(localStorage.getItem('minna_display_mode')).toBe('hiragana');
    });

    it('should notify listeners when mode changes', () => {
      const listener = vi.fn();
      displayModeManager.addListener(listener);
      displayModeManager.setMode('hiragana');
      expect(listener).toHaveBeenCalledWith('hiragana');
    });
  });

  describe('toggle', () => {
    it('should toggle from kanji to hiragana', () => {
      displayModeManager.mode = 'kanji';
      displayModeManager.toggle();
      expect(displayModeManager.getMode()).toBe('hiragana');
    });

    it('should toggle from hiragana to kanji', () => {
      displayModeManager.mode = 'hiragana';
      displayModeManager.toggle();
      expect(displayModeManager.getMode()).toBe('kanji');
    });

    it('should save toggled mode to localStorage', () => {
      displayModeManager.mode = 'kanji';
      displayModeManager.toggle();
      expect(localStorage.getItem('minna_display_mode')).toBe('hiragana');
    });

    it('should notify listeners when toggling', () => {
      const listener = vi.fn();
      displayModeManager.addListener(listener);
      displayModeManager.toggle();
      expect(listener).toHaveBeenCalledWith('hiragana');
    });
  });

  describe('saveMode', () => {
    it('should save kanji mode to localStorage', () => {
      displayModeManager.mode = 'kanji';
      displayModeManager.saveMode();
      expect(localStorage.getItem('minna_display_mode')).toBe('kanji');
    });

    it('should save hiragana mode to localStorage', () => {
      displayModeManager.mode = 'hiragana';
      displayModeManager.saveMode();
      expect(localStorage.getItem('minna_display_mode')).toBe('hiragana');
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });
      
      displayModeManager.saveMode();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save display mode:', expect.any(Error));
      
      consoleSpy.mockRestore();
      localStorage.setItem = originalSetItem;
    });
  });

  describe('loadMode', () => {
    it('should load kanji mode from localStorage', () => {
      localStorage.setItem('minna_display_mode', 'kanji');
      const mode = displayModeManager.loadMode();
      expect(mode).toBe('kanji');
    });

    it('should load hiragana mode from localStorage', () => {
      localStorage.setItem('minna_display_mode', 'hiragana');
      const mode = displayModeManager.loadMode();
      expect(mode).toBe('hiragana');
    });

    it('should return default mode when localStorage is empty', () => {
      const mode = displayModeManager.loadMode();
      expect(mode).toBe('kanji');
    });

    it('should return default mode for invalid stored value', () => {
      localStorage.setItem('minna_display_mode', 'invalid');
      const mode = displayModeManager.loadMode();
      expect(mode).toBe('kanji');
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage not available');
      });
      
      const mode = displayModeManager.loadMode();
      expect(mode).toBe('kanji'); // Should return default
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load display mode:', expect.any(Error));
      
      consoleSpy.mockRestore();
      localStorage.getItem = originalGetItem;
    });
  });

  describe('listener pattern', () => {
    it('should add a listener', () => {
      const listener = vi.fn();
      displayModeManager.addListener(listener);
      expect(displayModeManager.listeners).toContain(listener);
    });

    it('should remove a listener', () => {
      const listener = vi.fn();
      displayModeManager.addListener(listener);
      displayModeManager.removeListener(listener);
      expect(displayModeManager.listeners).not.toContain(listener);
    });

    it('should notify multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      displayModeManager.addListener(listener1);
      displayModeManager.addListener(listener2);
      
      displayModeManager.setMode('hiragana');
      
      expect(listener1).toHaveBeenCalledWith('hiragana');
      expect(listener2).toHaveBeenCalledWith('hiragana');
    });

    it('should not notify removed listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      displayModeManager.addListener(listener1);
      displayModeManager.addListener(listener2);
      displayModeManager.removeListener(listener1);
      
      displayModeManager.setMode('hiragana');
      
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith('hiragana');
    });
  });

  describe('persistence across page loads', () => {
    it('should persist mode selection', () => {
      displayModeManager.setMode('hiragana');
      
      // Simulate page reload by creating a new instance
      const loadedMode = displayModeManager.loadMode();
      expect(loadedMode).toBe('hiragana');
    });

    it('should default to kanji on first load', () => {
      localStorage.clear();
      const mode = displayModeManager.loadMode();
      expect(mode).toBe('kanji');
    });
  });
});
