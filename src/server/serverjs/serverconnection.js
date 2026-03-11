'use strict';
/**
 * serverconnection.js  — src/server/serverjs/serverconnection.js
 * ─────────────────────────────────────────────────────────────────────
 * Electron IPC Bridge for the renderer process.
 *
 * Builds upon the existing contextBridge pattern from preload.js:
 *   window.GeneralApi.GeneralCommand(data) → ipcRenderer.invoke("GENERAL_COMMANDS", data)
 *
 * Exports window.TLC_SERVER with:
 *   - invoke(command, data)   → calls GENERAL_COMMANDS
 *   - loadState()             → reads Map-State
 *   - saveState(obj)          → writes Map-State
 *
 * Fallback to localStorage if GeneralApi is unavailable (Dev-Browser).
 * ─────────────────────────────────────────────────────────────────────
 */

/* ── Base class (backward compatibility with existing code) ──── */
class GeneralConnection extends HTMLElement {
  async GeneralRequest(command_, data_) {
    if (typeof window.GeneralApi === 'undefined') {
      console.warn('[ServerConnection] General API not available.');
      return null;
    }
    return window.GeneralApi.GeneralCommand(
      JSON.stringify({ command: command_, data: data_ })
    );
  }
}

/* ── TLC_SERVER ─────────────────────────────────────────────────── */
;(function () {
  const STORAGE_KEY = 'tlc_map_state_v2';
  const hasIPC = () => typeof window.GeneralApi !== 'undefined';

  async function loadState() {
    if (hasIPC()) {
      try {
        const res = await window.GeneralApi.GeneralCommand(
          JSON.stringify({ command: 'tlcmap:load-state', data: null })
        );
        if (res && res.success && res.data) {
          return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        }
      } catch (e) {
        console.warn('[TLC_SERVER] Electron load failed:', e);
      }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  async function saveState(stateObj) {
    const serialized = JSON.stringify(stateObj);
    if (hasIPC()) {
      try {
        await window.GeneralApi.GeneralCommand(
          JSON.stringify({ command: 'tlcmap:save-state', data: serialized })
        );
      } catch (e) {
        console.warn('[TLC_SERVER] Electron save failed:', e);
      }
    }
    try { localStorage.setItem(STORAGE_KEY, serialized); } catch (e) {}
  }

  async function invoke(command, data) {
    if (!hasIPC()) { console.warn('[TLC_SERVER] invoke — no IPC:', command); return null; }
    return window.GeneralApi.GeneralCommand(JSON.stringify({ command, data }));
  }

  window.TLC_SERVER = { invoke, loadState, saveState };
  console.log('[TLC_SERVER] Bridge ready. IPC:', hasIPC() ? 'JA' : 'localStorage-Modus');
})();
