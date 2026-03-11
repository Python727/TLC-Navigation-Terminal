'use strict';
/**
 * storage.js  — src/data/JS/utils/storage.js
 * ─────────────────────────────────────────────────────────────────────
 * Thin wrapper around TLC_STATE.load() / TLC_STATE.save().
 * Automatically initializes the state when the app starts.
 * ─────────────────────────────────────────────────────────────────────
 */

const TLC_STORAGE = (() => {

  /** Loads the persistent state and dispatches 'tlc:ready' afterwards */
  async function init() {
    await window.TLC_STATE.load();
    window.dispatchEvent(new CustomEvent('tlc:ready'));
    console.log('[TLC Storage] State loaded, App ready.');
  }

  /** Saves the current state (Debounce 300 ms) */
  let _saveTimer = null;
  function save() {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
      window.TLC_STATE.save();
    }, 300);
  }

  return { init, save };
})();

window.TLC_STORAGE = TLC_STORAGE;

/* Auto-init sobald DOM fertig ist */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => TLC_STORAGE.init());
} else {
  TLC_STORAGE.init();
}
