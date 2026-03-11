'use strict';
/**
 * TlcSidebar.js  — src/data/JS/components/TlcSidebar.js
 * ─────────────────────────────────────────────────────────────────────
 * Custom Element: <tlc-sidebar>
 * Zwei-Phasen Navigation:
 *   Phase 1: Zonen-Auswahl
 *   Phase 2: Standortliste (Suche + einklappbare Kategorien)
 * ─────────────────────────────────────────────────────────────────────
 */

class TlcSidebar extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeZone    = null;
    this._page          = 'zones';   // 'zones' | 'locations'
    this._collapsed     = {};        // { [groupName]: true/false }
    this._searchQuery   = '';
  }

  connectedCallback() {
    this._render();
    this._bindEvents();

    this._stateHandler = () => {
      if (this._page === 'locations') this._buildList();
    };
    window.addEventListener('tlc:statechange', this._stateHandler);
    window.addEventListener('tlc:ready', () => {
      const savedZone = window.TLC_STATE.get('activeZone');
      if (savedZone) {
        const zone = (window.TLC_ZONES || []).find(z => z.id === savedZone);
        if (zone) {
          this._activeZone = savedZone;
          if (window.TLC_COORDS?.setZone) window.TLC_COORDS.setZone(zone);
          this._showLocations(zone);
          return;
        }
      }
      if (this._page === 'zones')     this._buildZones();
      if (this._page === 'locations') this._buildList();
    });
  }

  disconnectedCallback() {
    window.removeEventListener('tlc:statechange', this._stateHandler);
  }

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: var(--tlc-sidebar-w, 280px);
          background: rgba(13, 31, 40, 0.97);
          border-right: 1px solid var(--tlc-border, #1a4a5a);
          z-index: var(--z-sidebar, 50);
          display: flex;
          flex-direction: column;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
          padding-top: var(--tlc-header-h, 42px);
          overflow: hidden;
        }

        /* ── Header Bar ── */
        .top-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-bottom: 1px solid var(--tlc-border, #1a4a5a);
          flex-shrink: 0;
        }
        .btn-back {
          background: none; border: none;
          color: #4a7a8a; cursor: pointer;
          font-size: 16px; padding: 2px 4px;
          border-radius: 3px;
          transition: color 120ms;
          display: none;
        }
        .btn-back:hover { color: var(--tlc-accent, #00d4aa); }
        .bar-title {
          font-family: var(--tlc-font-hud, 'Orbitron', sans-serif);
          font-size: 11px; letter-spacing: 2px;
          color: var(--tlc-accent, #00d4aa);
          text-transform: uppercase;
          flex: 1;
        }
        .zone-badge {
          font-size: 9px; letter-spacing: 1px;
          color: #4a7a8a; text-transform: uppercase;
          display: none;
        }

        /* ── Suche ── */
        .search-wrap {
          padding: 8px 12px;
          border-bottom: 1px solid var(--tlc-border, #1a4a5a);
          flex-shrink: 0;
          display: none;
        }
        .search-wrap input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(0,0,0,0.4);
          border: 1px solid var(--tlc-border, #1a4a5a);
          border-radius: 4px;
          color: var(--tlc-text, #b8e4f0);
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
          font-size: 12px;
          padding: 7px 10px 7px 30px;
          outline: none;
          transition: border-color 120ms;
        }
        .search-wrap input:focus { border-color: var(--tlc-accent, #00d4aa); }
        .search-wrap input::placeholder { color: #4a7a8a; }
        .search-icon {
          position: absolute;
          left: 22px; top: 50%;
          transform: translateY(-50%);
          font-size: 13px; color: #4a7a8a;
          pointer-events: none;
        }
        .search-wrap { position: relative; }

        /* ── Inhalt (scrollbar) ── */
        #sidebar-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }
        #sidebar-content::-webkit-scrollbar       { width: 4px; }
        #sidebar-content::-webkit-scrollbar-track { background: #060d10; }
        #sidebar-content::-webkit-scrollbar-thumb { background: #1a4a5a; border-radius: 2px; }

        /* ── Zonen-Karten ── */
        .zone-list { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
        .zone-card {
          border: 1px solid var(--tlc-border, #1a4a5a);
          border-radius: 6px;
          padding: 14px 16px;
          cursor: pointer;
          transition: border-color 150ms, background 150ms;
          background: rgba(0,0,0,0.2);
        }
        .zone-card:hover {
          border-color: var(--tlc-accent, #00d4aa);
          background: rgba(0,212,170,0.06);
        }
        .zone-card-name {
          font-family: var(--tlc-font-hud, 'Orbitron', sans-serif);
          font-size: 12px; letter-spacing: 1px;
          color: var(--tlc-accent, #00d4aa);
          margin-bottom: 5px;
        }
        .zone-card-sub {
          font-size: 10px; color: #4a7a8a; letter-spacing: 0.5px;
        }
        .zone-card-count {
          margin-top: 10px;
          font-size: 10px; color: #4a7a8a;
          display: flex; gap: 12px; flex-wrap: wrap;
        }
        .zone-card-count span { color: #b8e4f0; }

        /* ── Gruppen & Items ── */
        .group { border-bottom: 1px solid rgba(26,74,90,0.4); }
        .group-header {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 12px 7px 14px;
          cursor: pointer;
          user-select: none;
          transition: background 100ms;
        }
        .group-header:hover { background: rgba(0,212,170,0.04); }
        .group-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .group-name {
          flex: 1;
          font-size: 10px; letter-spacing: 1.5px;
          color: #4a7a8a; text-transform: uppercase;
        }
        .group-count {
          font-size: 10px; color: #4a7a8a;
        }
        .group-arrow {
          font-size: 10px; color: #4a7a8a;
          transition: transform 150ms;
        }
        .group-arrow.open { transform: rotate(90deg); }

        .group-items { overflow: hidden; }
        .group-items.collapsed { display: none; }

        .item {
          padding: 6px 12px 6px 28px;
          display: flex; align-items: center; gap: 8px;
          cursor: pointer;
          border-left: 2px solid transparent;
          font-size: 13px;
          color: var(--tlc-text, #b8e4f0);
          transition: background 100ms, border-color 100ms;
        }
        .item:hover {
          background: rgba(0,212,170,0.08);
          border-left-color: var(--tlc-accent, #00d4aa);
        }
        .item.fog-item { color: #4a7a8a; font-style: italic; }
        .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .note-badge { font-size: 11px; color: var(--tlc-accent, #00d4aa); flex-shrink: 0; }
        .visited-badge { font-size: 10px; color: #4a7a8a; flex-shrink: 0; }

        /* ── Keine Ergebnisse ── */
        .no-results {
          padding: 24px 16px;
          text-align: center;
          font-size: 12px; color: #4a7a8a;
        }

        /* ── Boot-Eingabe ── */
        .boat-section {
          padding: 10px 14px 12px;
          border-top: 1px solid var(--tlc-border, #1a4a5a);
          flex-shrink: 0;
        }
        .boat-label {
          font-size: 11px; letter-spacing: 1px;
          color: var(--tlc-text-dim, #4a7a8a);
          display: block; margin-bottom: 7px;
          text-transform: uppercase;
        }
        .boat-row { display: flex; gap: 5px; align-items: center; }
        .boat-row input {
          flex: 1; min-width: 0;
          background: rgba(0,0,0,0.5);
          border: 1px solid var(--tlc-border, #1a4a5a);
          border-radius: 3px;
          color: var(--tlc-warn, #ff6b35);
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
          font-size: 13px; padding: 6px 10px;
          outline: none; transition: border-color 120ms;
        }
        .boat-row input:focus { border-color: var(--tlc-warn, #ff6b35); }
        .boat-row input::placeholder { color: var(--tlc-text-dim, #4a7a8a); }
        .boat-row button {
          background: rgba(255,107,53,0.18);
          border: 1px solid var(--tlc-warn, #ff6b35);
          color: var(--tlc-warn, #ff6b35);
          border-radius: 3px;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
          font-size: 12px; cursor: pointer;
          padding: 5px 10px; white-space: nowrap;
          transition: background 120ms;
        }
        .boat-row button:hover { background: rgba(255,107,53,0.32); }
      </style>

      <!-- Top Bar -->
      <div class="top-bar">
        <button class="btn-back" id="btn-back">‹</button>
        <div class="bar-title" id="bar-title">Zonen</div>
        <div class="zone-badge" id="zone-badge"></div>
      </div>

      <!-- Suche (nur in locations-Phase) -->
      <div class="search-wrap" id="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="search-input" placeholder="Standort suchen...">
      </div>

      <!-- Inhalt -->
      <div id="sidebar-content"></div>

      <!-- Boot-Position -->
      <div class="boat-section">
        <span class="boat-label">⚓ Boot-Position</span>
        <div class="boat-row">
          <input id="boat-x" type="number" placeholder="X" step="0.5"/>
          <input id="boat-y" type="number" placeholder="Y" step="0.5"/>
          <button id="boat-set">SET</button>
        </div>
      </div>
    `;

    // Zonen bauen (oder warten bis tlc:ready)
    if (window.TLC_ZONES && window.TLC_LOCATIONS) {
      this._buildZones();
    }
  }

  /* ══════════════════════════════════════════════════════
     EVENTS
  ══════════════════════════════════════════════════════ */
  _bindEvents() {
    const sr = this.shadowRoot;

    // Zurück-Button
    sr.getElementById('btn-back').addEventListener('click', () => this._showZones());

    // Suche
    sr.getElementById('search-input').addEventListener('input', (e) => {
      this._searchQuery = e.target.value.trim().toLowerCase();
      this._buildList();
    });

    // Boot
    sr.getElementById('boat-set').addEventListener('click', () => this._setBoat());
    ['boat-x', 'boat-y'].forEach(id => {
      sr.getElementById(id).addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._setBoat();
      });
    });

    // Bootpos aus State laden
    window.addEventListener('tlc:ready', () => {
      const bp = window.TLC_STATE.get('boatPos');
      if (bp) {
        sr.getElementById('boat-x').value = bp.gx;
        sr.getElementById('boat-y').value = bp.gy;
      }
    });
  }

  /* ══════════════════════════════════════════════════════
     PHASE 1 — ZONEN
  ══════════════════════════════════════════════════════ */
  _buildZones() {
    this._page = 'zones';
    const sr = this.shadowRoot;
    const zones = window.TLC_ZONES || [];
    const locs  = window.TLC_LOCATIONS || [];

    sr.getElementById('btn-back').style.display  = 'none';
    sr.getElementById('bar-title').textContent   = 'Zonen';
    sr.getElementById('zone-badge').style.display = 'none';
    sr.getElementById('search-wrap').style.display = 'none';

    const content = sr.getElementById('sidebar-content');
    content.innerHTML = `<div class="zone-list">${
      zones.map(z => {
        const zoneLocs = locs.filter(l => l.zone === z.id);
        const visited  = zoneLocs.filter(l => {
          const nd = (window.TLC_STATE.get('nodeData') || {})[l.id] || {};
          return nd.visited;
        }).length;
        const [name, sub] = z.label.includes('—')
          ? z.label.split('—').map(s => s.trim())
          : [z.label, ''];
        return `
          <div class="zone-card" data-zone="${z.id}">
            <div class="zone-card-name">${name}</div>
            ${sub ? `<div class="zone-card-sub">${sub}</div>` : ''}
            <div class="zone-card-count">
              Standorte: <span>${zoneLocs.length}</span>
              &nbsp;·&nbsp; Besucht: <span>${visited}</span>
            </div>
          </div>`;
      }).join('')
    }</div>`;

    content.querySelectorAll('.zone-card').forEach(card => {
      card.addEventListener('click', () => this._selectZone(card.dataset.zone));
    });
  }

  _selectZone(zoneId) {
    this._activeZone = zoneId;
    const zone = (window.TLC_ZONES || []).find(z => z.id === zoneId);
    if (!zone) return;

    // Zone persistent speichern
    window.TLC_STATE.set('activeZone', zoneId);
    window.TLC_STATE.save();

    // Koordinatensystem umschalten + Map zentrieren
    if (window.TLC_COORDS?.setZone) window.TLC_COORDS.setZone(zone);
    window.dispatchEvent(new CustomEvent('tlc:zone-change', { detail: { zone } }));
    window.dispatchEvent(new CustomEvent('tlc:reset-view'));

    this._showLocations(zone);
  }

  /* ══════════════════════════════════════════════════════
     PHASE 2 — STANDORTE
  ══════════════════════════════════════════════════════ */
  _showLocations(zone) {
    this._page = 'locations';
    const sr   = this.shadowRoot;
    const [name] = zone.label.includes('—')
      ? zone.label.split('—').map(s => s.trim())
      : [zone.label];

    sr.getElementById('btn-back').style.display   = 'block';
    sr.getElementById('bar-title').textContent    = 'Standorte';
    sr.getElementById('zone-badge').style.display = 'block';
    sr.getElementById('zone-badge').textContent   = name;
    sr.getElementById('search-wrap').style.display = 'block';
    sr.getElementById('search-input').value = '';
    this._searchQuery = '';

    this._buildList();
  }

  _buildList() {
    const sr      = this.shadowRoot;
    const types   = window.TLC_LOCATION_TYPES;
    const allLocs = window.TLC_LOCATIONS;
    const state   = window.TLC_STATE;
    const content = sr.getElementById('sidebar-content');
    if (!content || !types || !allLocs) return;

    const activeZone = this._activeZone || (window.TLC_ZONES?.[0]?.id) || 'z1';
    let locs = allLocs.filter(l => l.zone === activeZone);

    // Suchfilter
    if (this._searchQuery) {
      locs = locs.filter(l => l.name.toLowerCase().includes(this._searchQuery));
    }

    if (locs.length === 0) {
      content.innerHTML = `<div class="no-results">Keine Standorte gefunden.</div>`;
      return;
    }

    // Gruppieren
    const groups = {};
    locs.forEach(loc => {
      const key = types[loc.type]?.label || loc.type;
      if (!groups[key]) groups[key] = { color: types[loc.type]?.color || '#fff', items: [] };
      groups[key].items.push(loc);
    });

    const fogActive = (state.get('visibility') || {}).fogOfWar !== false;

    content.innerHTML = '';
    Object.entries(groups).forEach(([groupName, group]) => {
      const isCollapsed = this._collapsed[groupName] === true;

      const gDiv = document.createElement('div');
      gDiv.className = 'group';
      gDiv.innerHTML = `
        <div class="group-header" data-group="${groupName}">
          <div class="group-dot" style="background:${group.color}"></div>
          <div class="group-name">${groupName}</div>
          <div class="group-count">${group.items.length}</div>
          <div class="group-arrow ${isCollapsed ? '' : 'open'}">›</div>
        </div>
        <div class="group-items ${isCollapsed ? 'collapsed' : ''}">
          ${group.items.map(loc => {
            const nd      = (state.get('nodeData') || {})[loc.id] || {};
            const color   = nd.color || group.color;
            const visited = nd.visited === true;
            const isFog   = fogActive && !visited;
            return `
              <div class="item ${isFog ? 'fog-item' : ''}" data-id="${loc.id}">
                <div class="dot" style="background:${isFog ? '#2a4a5a' : color}"></div>
                <span class="name">${isFog ? '???' : loc.name}</span>
                ${nd.note && !isFog ? `<span class="note-badge" title="${nd.note}">✎</span>` : ''}
                ${visited ? `<span class="visited-badge">✓</span>` : ''}
              </div>`;
          }).join('')}
        </div>`;

      // Gruppe einklappen
      gDiv.querySelector('.group-header').addEventListener('click', () => {
        this._collapsed[groupName] = !this._collapsed[groupName];
        this._buildList();
      });

      // Item klicken → zur Station navigieren
      gDiv.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', () => {
          const loc = allLocs.find(l => l.id === item.dataset.id);
          if (loc) window.dispatchEvent(new CustomEvent('tlc:pan-to', { detail: { loc } }));
        });
      });

      content.appendChild(gDiv);
    });
  }

  /* ══════════════════════════════════════════════════════
     HELFER
  ══════════════════════════════════════════════════════ */
  _showZones() {
    this._page = 'zones';
    this._buildZones();
  }

  _setBoat() {
    const sr = this.shadowRoot;
    const gx = parseFloat(sr.getElementById('boat-x').value);
    const gy = parseFloat(sr.getElementById('boat-y').value);
    if (isNaN(gx) || isNaN(gy)) {
      window.tlcNotify('Bitte gültige Koordinaten eingeben!', 'warn');
      return;
    }
    window.TLC_STATE.set('boatPos', { gx, gy });
    window.TLC_STATE.save();
    window.dispatchEvent(new CustomEvent('tlc:statechange', { detail: { key: 'boatPos' } }));
    window.tlcNotify(`⚓ Boot gesetzt: X ${gx}, Y ${gy}`);
  }
}

customElements.define('tlc-sidebar', TlcSidebar);
