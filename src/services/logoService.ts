/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const STORAGE_KEY = 'emscps_custom_emblem';
export const DEFAULT_EMBLEM_PATH = '/assets/lao-emblem.png';

type LogoChangeListener = (newLogoUrl: string) => void;
const listeners: Set<LogoChangeListener> = new Set();

export const logoService = {
  /**
   * Retrieves the current emblem URL.
   * Returns custom uploaded base64 data URL if present, otherwise returns default public asset path.
   */
  getEmblemLogo(): string {
    if (typeof window === 'undefined') return DEFAULT_EMBLEM_PATH;
    try {
      const custom = localStorage.getItem(STORAGE_KEY);
      if (custom && custom.startsWith('data:image/')) {
        return custom;
      }
    } catch {
      // LocalStorage access error
    }
    return DEFAULT_EMBLEM_PATH;
  },

  /**
   * Checks whether the user has uploaded a custom emblem.
   */
  hasCustomEmblem(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const custom = localStorage.getItem(STORAGE_KEY);
      return Boolean(custom && custom.startsWith('data:image/'));
    } catch {
      return false;
    }
  },

  /**
   * Saves custom base64 image data URL to storage and notifies listeners.
   */
  saveCustomEmblem(dataUrl: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, dataUrl);
      listeners.forEach((fn) => fn(dataUrl));
    } catch (err) {
      console.error('Failed to save custom emblem to localStorage:', err);
      throw err;
    }
  },

  /**
   * Resets the emblem to the default public asset path (/assets/lao-emblem.png).
   */
  clearCustomEmblem(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      listeners.forEach((fn) => fn(DEFAULT_EMBLEM_PATH));
    } catch (err) {
      console.error('Failed to clear custom emblem:', err);
    }
  },

  /**
   * Subscribes to emblem logo updates.
   */
  subscribe(listener: LogoChangeListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
