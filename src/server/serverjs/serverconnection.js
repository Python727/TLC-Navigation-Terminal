'use strict';
/**
 * serverconnection.js  — src/server/serverjs/serverconnection.js
 * ─────────────────────────────────────────────────────────────────────
 * Electron IPC Bridge für den Renderer-Prozess.
 *
 * Baut auf dem bestehenden contextBridge-Muster aus preload.js auf:
 *   window.GeneralApi.GeneralCommand(data) → ipcRenderer.invoke("GENERAL_COMMANDS", data)
 *
 * Exportiert window.TLC_SERVER mit:
 *   - invoke(command, data)   → ruft GENERAL_COMMANDS auf
 *   - loadState()             → liest Map-State
 *   - saveState(obj)          → schreibt Map-State
 *
 * Fallback auf localStorage wenn GeneralApi nicht verfügbar (Dev-Browser).
 * ─────────────────────────────────────────────────────────────────────
 */

/* ── Basis-Klasse (Rückwärtskompatibilität mit bestehendem Code) ──── */
class GeneralConnection extends HTMLElement {
  async GeneralRequest(command_, data_) {
    if (typeof window.GeneralApi === 'undefined') {
      console.warn('[ServerConnection] GeneralApi nicht verfügbar.');
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

  async function _ipc(command, data) {
    return window.GeneralApi.GeneralCommand(JSON.stringify({ command, data }));
  }

  async function loadState({ slot = 0 } = {}) {
    if (hasIPC()) {
      try {
        const res = await _ipc('tlcmap:load-state', { slot });
        if (res && res.success && res.data) {
          return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        }
      } catch (e) { console.warn('[TLC_SERVER] load error:', e); }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '_slot' + slot);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  async function saveState({ slot = 0, payload } = {}) {
    const serialized = JSON.stringify(payload);
    if (hasIPC()) {
      try {
        await _ipc('tlcmap:save-state', { slot, payload: serialized });
      } catch (e) { console.warn('[TLC_SERVER] save error:', e); }
    }
    try { localStorage.setItem(STORAGE_KEY + '_slot' + slot, serialized); } catch (e) {}
  }

  async function listSlots() {
    if (hasIPC()) {
      try { return await _ipc('tlcmap:list-slots', null); } catch (e) {}
    }
    // localStorage fallback
    const slots = [];
    for (let i = 0; i < 8; i++) {
      const raw = localStorage.getItem(STORAGE_KEY + '_slot' + i);
      if (raw) {
        try {
          const d = JSON.parse(raw);
          slots.push({ slot: i, exists: true, name: d._slotName || `Savegame ${i+1}`, zone: d.activeZone || null, waypoints: (d.waypoints||[]).length, markers: (d.userMarkers||[]).length });
        } catch { slots.push({ slot: i, exists: true, name: `Savegame ${i+1}` }); }
      } else {
        slots.push({ slot: i, exists: false, name: `Savegame ${i+1}` });
      }
    }
    return { success: true, slots };
  }

  async function deleteSlot({ slot }) {
    if (hasIPC()) {
      try { return await _ipc('tlcmap:delete-slot', { slot }); } catch (e) {}
    }
    localStorage.removeItem(STORAGE_KEY + '_slot' + slot);
    return { success: true };
  }

  async function renameSlot({ slot, name }) {
    if (hasIPC()) {
      try { return await _ipc('tlcmap:rename-slot', { slot, name }); } catch (e) {}
    }
    return { success: false };
  }

  async function invoke(command, data) {
    if (!hasIPC()) { console.warn('[TLC_SERVER] invoke — kein IPC:', command); return null; }
    return _ipc(command, data);
  }

  window.TLC_SERVER = { invoke, loadState, saveState, listSlots, deleteSlot, renameSlot };
  console.log('[TLC_SERVER] Bridge bereit. IPC:', hasIPC() ? 'JA' : 'localStorage-Modus');
})();
