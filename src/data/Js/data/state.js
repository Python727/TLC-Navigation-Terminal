'use strict';
/**
 * state.js  — src/data/JS/data/state.js
 * ─────────────────────────────────────────────────────────────────────
 * Zentrales State-Objekt.
 * Alle Custom-Elements lesen / schreiben hierher.
 * Änderungen lösen ein CustomEvent 'tlc:statechange' auf window aus,
 * damit betroffene Komponenten sich neu rendern können.
 * ─────────────────────────────────────────────────────────────────────
 */

const _defaultState = {
  /* Karte */
  scale:  0.75,
  panX:   0,
  panY:   0,

  /* Nutzerdaten (persistent) */
  waypoints:    [],   // [{ gx, gy, label }]
  userMarkers:  [],   // [{ gx, gy, color, note }]
  nodeData:     {},   // { [locationId]: { color, note, resources: [{icon,label,value}] } }
  boatPos:      null, // { gx, gy } | null
  visibility:   {},   // { hidden, seedvault, caves, labels, fogOfWar }
  activeZone:   null, // zuletzt gewählte Zone
};

/** Tiefer Clone, nur für plain-JSON-Daten */
function _deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

class TlcState {
  constructor() {
    this._data = _deepClone(_defaultState);
  }

  /* ── Getter ──────────────────────────────────────────── */
  get(key) {
    return this._data[key];
  }

  getAll() {
    return this._data;
  }

  /* ── Setter (löst Event aus) ─────────────────────────── */
  set(key, value) {
    this._data[key] = value;
    this._emit(key);
  }

  /** Merge für verschachtelte Objekte (z.B. nodeData) */
  merge(key, value) {
    if (typeof this._data[key] === 'object' && !Array.isArray(this._data[key])) {
      this._data[key] = Object.assign({}, this._data[key], value);
    } else {
      this._data[key] = value;
    }
    this._emit(key);
  }

  /* ── Persistenz ──────────────────────────────────────── */
  /** Lädt persistenten State via TLC_SERVER (Electron) oder localStorage */
  async load() {
    try {
      let saved = null;

      if (window.TLC_SERVER) {
        saved = await window.TLC_SERVER.loadState();
      }

      if (saved) {
        const keys = ['waypoints', 'userMarkers', 'nodeData', 'boatPos', 'visibility', 'activeZone'];
        keys.forEach(k => {
          if (saved[k] !== undefined) this._data[k] = saved[k];
        });
      }
    } catch (e) {
      console.warn('[TlcState] load error:', e);
    }
    this._emit('*');
  }

  /** Speichert persistenten State */
  async save() {
    const payload = {
      waypoints:   this._data.waypoints,
      userMarkers: this._data.userMarkers,
      nodeData:    this._data.nodeData,
      boatPos:     this._data.boatPos,
      visibility:  this._data.visibility,
      activeZone:  this._data.activeZone,
    };
    try {
      if (window.TLC_SERVER) {
        await window.TLC_SERVER.saveState(payload);
      }
    } catch (e) {
      console.warn('[TlcState] save error:', e);
    }
  }

  /* ── Event ───────────────────────────────────────────── */
  _emit(key) {
    window.dispatchEvent(new CustomEvent('tlc:statechange', { detail: { key } }));
  }
}

window.TLC_STATE = new TlcState();
