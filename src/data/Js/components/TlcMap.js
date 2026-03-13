'use strict';
/**
 * TlcMap.js  — src/data/JS/components/TlcMap.js
 * ─────────────────────────────────────────────────────────────────────
 * Custom Element: <tlc-map>
 * Root component. Builds the entire layout and instantiates all components.
 * Sub-components. Contains the map rendering logic and all
 * interaction handlers (click, drag, scroll, keyboard, context menu).
 * ─────────────────────────────────────────────────────────────────────
 */

class TlcMap extends HTMLElement {

  constructor() {
    super();
    /* 
      No shadow DOM at the root level — we use light DOM
      so that CSS tokens can pass through and sub-elements can be found
      directly via querySelector.               
    */
    this._isDragging = false;
    this._dragStart  = null;
    this._panStart   = null;
  }

  /* ══════════════════════════════════════════════════════
     LIFECYCLE
  ══════════════════════════════════════════════════════ */
  connectedCallback() {
    this._buildShell();
    this._bindEvents();

    /* Wait until state is loaded */
    window.addEventListener('tlc:ready', () => {
      // Initialize coordinate system for zone 1
      const zones = window.TLC_ZONES;
      if (zones && zones[0]) window.TLC_COORDS.setZone(zones[0]);
      this._renderCanvas();
      this._resetView();
    });

    /* Zone change from sidebar */
    window.addEventListener('tlc:zone-change', (e) => {
      if (e.detail?.zone) window.TLC_COORDS.setZone(e.detail.zone);
      this._selectedLocId = null;
      this._renderCanvas();
      this._resetView();
    });

    /* State changes → Re-Render */
    window.addEventListener('tlc:statechange', () => {
      this._renderCanvas();
    });

    /* Zoom via Controls */
    window.addEventListener('tlc:zoom',       (e) => this._zoom(e.detail.factor));
    window.addEventListener('tlc:reset-view', ()  => this._resetView());

    /* Sidebar-Click → Pan-To */
    window.addEventListener('tlc:pan-to', (e) => this._panTo(e.detail.loc));
  }

  disconnectedCallback() {
    /* 
      Events would be GC-safely removed with AbortController,
      but since TlcMap is never removed, this is sufficient. 
    */
  }

  /* ══════════════════════════════════════════════════════
     SHELL — HTML framework with sub-elements
  ══════════════════════════════════════════════════════ */
  _buildShell() {
    this.style.cssText = 'display:block;position:fixed;inset:0;';
    this.innerHTML = `
      <!-- ── HUD Header ─────────────────────────────── -->
      <div id="tlc-header">
        <span class="hud-title">THE LAST CARETAKER</span>
        <span class="hud-sep">|</span>
        <span class="hud-sub">NAVIGATION TERMINAL v2.2</span>
        <span class="hud-sep">|</span>
        <span class="hud-coords-label">X</span>
        <span id="hud-mx">—</span>
        <span class="hud-coords-label">Y</span>
        <span id="hud-my">—</span>
      </div>

      <!-- ── Sidebar ────────────────────────────────── -->
      <tlc-sidebar></tlc-sidebar>

      <!-- ── Map Viewport ───────────────────────────── -->
      <div id="tlc-map-wrap">
        <!-- Ruler Top (X-Achse) -->
        <canvas id="tlc-ruler-x" class="tlc-ruler tlc-ruler-x"></canvas>
        <!-- Ruler Left (Y-Achse) -->
        <canvas id="tlc-ruler-y" class="tlc-ruler tlc-ruler-y"></canvas>
        <!-- Ecke Top-Left  -->
        <div id="tlc-ruler-corner"></div>
        <div id="tlc-map-canvas"></div>
        <!-- Boat-Mark  -->
        <div id="tlc-boat" style="display:none">
          <div class="boat-ring"></div>
          <div class="boat-inner">⚓</div>
        </div>
      </div>

      <!-- ── Controls ───────────────────────────────── -->
      <tlc-controls></tlc-controls>

      <!-- ── Settings Window ──────────────────────────── -->
      <div id="tlc-settings" class="settings-win" style="display:none">
        <div class="sw-header">
          <span class="sw-title">Settings</span>
          <button class="sw-close" id="sw-close">✕</button>
        </div>
        <div class="sw-body">

          <div class="sw-group-label">Data</div>
          <div class="sw-btn-row">
            <button id="sw-export" class="sw-btn sw-export">⬆ Export</button>
            <button id="sw-import" class="sw-btn sw-import">⬇ Import</button>
            <button id="sw-clear"  class="sw-btn sw-clear" >🗑 Delete</button>
          </div>
          <input type="file" id="sw-import-file" accept=".json" style="display:none">

          <div class="sw-group-label">Visibility</div>
          <label class="sw-check">
            <input type="checkbox" id="chk-hidden">
            <span>Hidden Locations</span>
          </label>
          <label class="sw-check">
            <input type="checkbox" id="chk-seedvault">
            <span>Seed Reserves (Last Listener)</span>
          </label>
          <label class="sw-check">
            <input type="checkbox" id="chk-caves">
            <span>Caves</span>
          </label>
          <label class="sw-check">
            <input type="checkbox" id="chk-labels" checked>
            <span>Place Names</span>
          </label>
          <label class="sw-check">
            <input type="checkbox" id="chk-fogOfWar" checked>
            <span>Fog of Unknown</span>
          </label>

        </div>
      </div>

      <!-- ── Legend ─────────────────────────────────── -->
      <tlc-legend></tlc-legend>

      <!-- ── Context Menu ───────────────────────────── -->
      <tlc-context-menu id="tlc-ctx"></tlc-context-menu>

      <!-- ── Modal ──────────────────────────────────── -->
      <tlc-modal id="tlc-modal"></tlc-modal>

      <!-- ── Notification ───────────────────────────── -->
      <tlc-notification></tlc-notification>

      <style>
        /* ── Header ── */
        #tlc-header {
          position: absolute;
          top: 0; right: 20px;   /* right top, near Ruler-Edge */
          z-index: 82;
          padding: 6px 18px;
          background: linear-gradient(180deg, rgba(6,13,16,.97) 0%, rgba(6,13,16,.75) 100%);
          border-bottom: 1px solid var(--tlc-border, #1a4a5a);
          border-left:   1px solid var(--tlc-border, #1a4a5a);
          border-right:  1px solid var(--tlc-border, #1a4a5a);
          border-radius: 0 0 8px 8px;
          display: flex; align-items: center; gap: 12px;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
          pointer-events: none;
        }
        .hud-coords-label {
          font-size: 9px;
          color: var(--tlc-text-dim, #4a7a8a);
          letter-spacing: 1px;
        }
        #hud-mx, #hud-my {
          font-size: 13px;
          color: var(--tlc-accent, #00d4aa);
          letter-spacing: 1px;
          min-width: 36px;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .hud-title {
          font-family: var(--tlc-font-hud, 'Orbitron', sans-serif);
          font-size: 14px; letter-spacing: 3px;
          color: var(--tlc-accent, #00d4aa);
        }
        .hud-sep   { color: var(--tlc-border, #1a4a5a); }
        .hud-sub   { font-size: 12px; color: var(--tlc-text-dim, #4a7a8a); }



        /* ── Ruler ── */
        .tlc-ruler {
          position: absolute;
          z-index: 78;
          background: rgba(6,13,16,0.95);
          pointer-events: none;
          display: block;
        }
        /* X-Ruler: top, Width+Height per JS set */
        .tlc-ruler-x {
          top: 0; left: 20px;
          height: 20px;  /* CSS-Height = canvas.height → no Stretch */
          border-bottom: 1px solid var(--tlc-border, #1a4a5a);
        }
        /* Y-Ruler: left, Width+Height per JS set */
        .tlc-ruler-y {
          left: 0; top: 20px;
          width: 20px;   /* CSS-Width = canvas.width → no Stretch */
          border-right: 1px solid var(--tlc-border, #1a4a5a);
        }
        /* Corner top-left */
        #tlc-ruler-corner {
          position: absolute; z-index: 79;
          top: 0; left: 0;
          width: 20px; height: 20px;
          background: rgba(6,13,16,0.95);
          border-right:  1px solid var(--tlc-border, #1a4a5a);
          border-bottom: 1px solid var(--tlc-border, #1a4a5a);
        }

        /* ── Map Wrap ── */
        #tlc-map-wrap {
          position: absolute;
          left: var(--tlc-sidebar-w, 248px);
          top: 0; right: 0; bottom: 0;
          overflow: hidden;
          cursor: crosshair;
        }

        /* ── Canvas ── */
        #tlc-map-canvas {
          position: absolute;
          /* 20px Offset für X+Y Ruler */
          left: 20px; top: 20px;
          transform-origin: 0 0;
        }

        /* ── Boat ── */
        #tlc-boat {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: var(--z-boat, 25);
          pointer-events: none;
        }
        .boat-ring {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 1px solid rgba(255,107,53,0.5);
          animation: boatRing 2s ease-in-out infinite;
        }
        .boat-inner {
          width: 20px; height: 20px;
          background: var(--tlc-warn, #ff6b35);
          border: 2px solid #fff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          box-shadow: 0 0 14px rgba(255,107,53,.8);
          animation: boatPulse 2s ease-in-out infinite;
        }
        @keyframes boatPulse {
          0%,100% { box-shadow: 0 0 12px rgba(255,107,53,.8); }
          50%      { box-shadow: 0 0 22px rgba(255,107,53,1), 0 0 40px rgba(255,107,53,.5); }
        }
        @keyframes boatRing {
          0%,100% { opacity:.5; inset:-10px; }
          50%      { opacity:.1; inset:-20px; }
        }

        /* ── Canvas Elemente ── */
        .tlc-node {
          position: absolute;
          transform: translate(-50%,-50%);
          cursor: pointer;
          z-index: var(--z-node, 15);
        }
        .node-circle {
          border-radius: 50%;
          border: none;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          transition: filter 180ms, transform 180ms;
          background: none;
          overflow: visible;
        }
        .node-icon {
          width: 100%; height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          display: block;
        }
        .node-circle::after {
          content: '';
          position: absolute; inset: -4px;
          border-radius: 50%;
          border: 1px solid currentColor;
          opacity: .3;
          transition: opacity 180ms, inset 180ms;
        }
        .tlc-node:hover .node-circle          { filter: brightness(1.45); transform: scale(1.15); }
        .tlc-node:hover .node-circle::after   { opacity: .7; inset: -7px; }

        .sz-lg .node-circle { width: 58px; height: 58px; }
        .sz-md .node-circle { width: 46px; height: 46px; }
        .sz-sm .node-circle { width: 36px; height: 36px; }

        /* ── Fog of Unknown ── */
        .node-fog {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
          border-radius: 50%;
          background: rgba(6,13,16,0.55);
          pointer-events: none;
        }
        .fog-eye {
          font-size: 13px;
          line-height: 1;
          opacity: 0.7;
          filter: grayscale(1);
        }
        .fog-q {
          font-size: 10px;
          color: #4a7a8a;
          font-family: var(--tlc-font-hud,'Orbitron',sans-serif);
          line-height: 1;
        }

        .node-label {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%; transform: translateX(-50%);
          font-size: 11px; white-space: nowrap;
          color: var(--tlc-text, #b8e4f0);
          pointer-events: none;
          text-shadow: 0 0 5px #060d10;
          letter-spacing: .4px;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
        }
        .node-note-badge {
          position: absolute;
          bottom: calc(100% + 5px);
          left: 50%; transform: translateX(-50%);
          font-size: 7px;
          white-space: nowrap;
          max-width: 120px;
          overflow: hidden; text-overflow: ellipsis;
          padding: 1px 5px;
          border-radius: 3px;
          border: 1px solid currentColor;
          background: rgba(6,13,16,.9);
          pointer-events: none;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
        }

        /* ── Waypoints ── */
        .tlc-waypoint {
          position: absolute;
          transform: translate(-50%, -100%);
          z-index: var(--z-waypoint, 20);
          cursor: pointer;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
        }
        .wp-label {
          position: absolute;
          bottom: calc(100% + 1px);
          left: 50%; transform: translateX(-50%);
          font-size: 11px; white-space: nowrap;
          background: rgba(6,13,16,.92);
          border: 1px solid var(--tlc-warn, #ff6b35);
          padding: 1px 5px; border-radius: 3px;
          color: var(--tlc-warn, #ff6b35);
          pointer-events: none;
        }
        .wp-head {
          width: 13px; height: 13px;
          background: var(--tlc-warn, #ff6b35);
          border: 2px solid #fff;
          border-radius: 50%;
          margin: 0 auto;
          box-shadow: 0 0 8px rgba(255,107,53,.6);
        }
        .wp-tail {
          width: 2px; height: 10px;
          background: var(--tlc-warn, #ff6b35);
          margin: 0 auto; opacity: .8;
        }

        /* ── User Markers ── */
        .tlc-user-marker {
          position: absolute;
          transform: translate(-50%,-50%);
          z-index: 18;
          cursor: pointer;
        }
        .um-dot {
          width: 11px; height: 11px;
          border-radius: 50%;
          border: 2px solid #fff;
          opacity: .9;
          transition: transform 120ms;
        }
        .tlc-user-marker:hover .um-dot { transform: scale(1.3); }
        .um-label {
          position: absolute;
          bottom: calc(100% + 3px);
          left: 50%; transform: translateX(-50%);
          font-size: 11px; white-space: nowrap;
          padding: 1px 6px; border-radius: 3px;
          border: 1px solid currentColor;
          background: rgba(6,13,16,.9);
          pointer-events: none;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
        }

        /* ── Settings Window ── */
        .settings-win {
          position: absolute;
          top: 30px; right: 60px;
          z-index: 90;
          width: 300px;
          background: rgba(10,22,30,0.97);
          border: 1px solid var(--tlc-border, #1a4a5a);
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
          overflow: hidden;
        }
        .sw-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px;
          background: rgba(0,212,170,0.07);
          border-bottom: 1px solid var(--tlc-border, #1a4a5a);
        }
        .sw-title {
          font-family: var(--tlc-font-hud, 'Orbitron', sans-serif);
          font-size: 11px; letter-spacing: 2px; color: var(--tlc-accent, #00d4aa);
        }
        .sw-close {
          background: none; border: none; color: #4a7a8a; cursor: pointer;
          font-size: 14px; padding: 0 2px; transition: color 120ms;
        }
        .sw-close:hover { color: #ff4060; }
        .sw-body { padding: 14px 16px 16px; }
        .sw-group-label {
          font-size: 10px; letter-spacing: 1px; color: #4a7a8a;
          text-transform: uppercase; margin: 14px 0 8px;
        }
        .sw-group-label:first-child { margin-top: 0; }
        .sw-btn-row { display: flex; gap: 8px; }
        .sw-btn {
          flex: 1; padding: 8px 4px; border-radius: 4px; border: 1px solid;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
          font-size: 11px; cursor: pointer; transition: all 120ms; text-align: center;
        }
        .sw-export { border-color: #00d4aa; color: #00d4aa; background: rgba(0,212,170,0.08); }
        .sw-export:hover { background: rgba(0,212,170,0.2); }
        .sw-import { border-color: #4a9aff; color: #4a9aff; background: rgba(74,154,255,0.08); }
        .sw-import:hover { background: rgba(74,154,255,0.2); }
        .sw-clear  { border-color: #ff4060; color: #ff4060; background: rgba(255,64,96,0.08); }
        .sw-clear:hover  { background: rgba(255,64,96,0.22); }
        .sw-check {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 2px; cursor: pointer;
          border-bottom: 1px solid rgba(26,74,90,0.35);
          font-size: 13px; color: #b8e4f0; transition: color 100ms;
        }
        .sw-check:last-child { border-bottom: none; }
        .sw-check:hover { color: #00d4aa; }
        .sw-check input[type=checkbox] {
          accent-color: var(--tlc-accent, #00d4aa);
          width: 16px; height: 16px; cursor: pointer; flex-shrink: 0;
        }

        /* ── Grid lines ── */
        .tlc-grid-v, .tlc-grid-h {
          position: absolute;
          background: rgba(0,212,170,0.05);
          pointer-events: none;
        }
        .tlc-grid-v { width: 1px; top: 0; bottom: 0; }
        .tlc-grid-h { height: 1px; left: 0; right: 0; }
        .tlc-grid-label {
          position: absolute;
          font-size: 8px;
          color: rgba(0,212,170,0.22);
          pointer-events: none;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
        }

        /* ── Range circles ── */
        .tlc-range-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(0,212,170,0.12);
          pointer-events: none;
          transform: translate(-50%,-50%);
        }

        /* ── Selected Node Ring ── */
        .node-select-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid currentColor;
          pointer-events: none;
          animation: selectPulse 1.4s ease-in-out infinite;
        }
        @keyframes selectPulse {
          0%,100% { opacity:1; inset:-8px; }
          50%      { opacity:0.4; inset:-13px; }
        }
      </style>
    `;

    /* Globale Referenz */
    window.TLC_MODAL    = this.querySelector('tlc-modal');
    window.TLC_CTX_MENU = this.querySelector('tlc-context-menu');
  }

  /* ══════════════════════════════════════════════════════
     EVENTS
  ══════════════════════════════════════════════════════ */
  _bindEvents() {
    // Reference map-wrap directly — register events ONLY there
    // so that the sidebar can have its own scroll event unhindered
    const mapWrap = this.querySelector('#tlc-map-wrap');

    /* ── Wheel Zoom ── only on map wrap, not on the entire TLC map */
    mapWrap.addEventListener('wheel', (e) => {
      e.preventDefault();
      const f      = e.deltaY < 0 ? 1.12 : 0.89;
      const r      = mapWrap.getBoundingClientRect();
      const ROFF   = 20;
      const mx     = e.clientX - r.left - ROFF;
      const my     = e.clientY - r.top  - ROFF;
      const s      = window.TLC_STATE;
      const oldSc  = s.get('scale');
      const newSc  = Math.max(0.25, Math.min(9, oldSc * f));
      const realF  = newSc / oldSc;  
      s.set('panX',  mx - (mx - s.get('panX')) * realF);
      s.set('panY',  my - (my - s.get('panY')) * realF);
      s.set('scale', newSc);
      this._applyTransform();
      this._updateBoat();
    }, { passive: false });

    /* ── Drag Pan ── mousedown only start on map wrap */
    mapWrap.addEventListener('mousedown', (e) => {
      if (e.button === 1) e.preventDefault();
      if (e.button !== 0 && e.button !== 1) return;
      this._dragStart = { x: e.clientX, y: e.clientY };
      this._panStart  = { x: window.TLC_STATE.get('panX'), y: window.TLC_STATE.get('panY') };
      this._hasMoved  = false;
      this._isDragging = false;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      const r    = mapWrap.getBoundingClientRect();
      const s    = window.TLC_STATE;
      const ROFF = 20;
      const [cx, cy] = window.TLC_COORDS.screenToCanvas(
        e.clientX - ROFF, e.clientY - ROFF, r, s.get('panX'), s.get('panY'), s.get('scale')
      );
      this._hoverGx = Math.round(window.TLC_COORDS.pxToGx(cx));
      this._hoverGy = Math.round(window.TLC_COORDS.pyToGy(cy));
      const hudX = this.querySelector('#hud-mx');
      const hudY = this.querySelector('#hud-my');
      if (hudX) hudX.textContent = this._hoverGx;
      if (hudY) hudY.textContent = this._hoverGy;

      /* Drag is only considered "real drag" from a movement of 6px upwards. */
      if (this._dragStart) {
        const dx = Math.abs(e.clientX - this._dragStart.x);
        const dy = Math.abs(e.clientY - this._dragStart.y);
        if (dx > 6 || dy > 6) {
          this._isDragging = true;
          this._hasMoved   = true;
        }
        if (this._isDragging) {
          s.set('panX', this._panStart.x + (e.clientX - this._dragStart.x));
          s.set('panY', this._panStart.y + (e.clientY - this._dragStart.y));
          this._applyTransform();
          this._updateBoat();
        }
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (!this._dragStart) return;         
      const wasRealClick = !this._hasMoved;  
      this._isDragging = false;
      this._dragStart  = null;
      this._hasMoved   = false;

      if (e.button === 1) {
        // Middle click → Set marker (no drag check needed)
        const r = mapWrap.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right ||
            e.clientY < r.top  || e.clientY > r.bottom) return;
        this._handleMapClick(e);
      }
    });

    /* ── Right click ── */
    mapWrap.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this._openMapCtx(e);
    });

    /* ── E-Key: Waypoint ── */
    document.addEventListener('keydown', (e) => {
      // No map shortcuts when the focus is in an input field or modal
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.target.closest('tlc-modal, [role="dialog"], .modal-content, #tlc-modal')) return;
      if (e.key === 'e' || e.key === 'E') {
        this._toggleWaypoint(this._hoverGx || 0, this._hoverGy || 0);
      }
    });

    /* ── Resize ── */
    window.addEventListener('resize', () => {
      this._updateBoat();
      this._drawRulers();
    });

    /* ── Settings Window ── */
    window.addEventListener('tlc:toggle-settings', () => this._toggleSettings());
    window.addEventListener('tlc:toggle-humancalc', () => this._toggleHumanCalc());

    /* ── Reset header coordinates when mouse leaves map wrap ── */
    mapWrap.addEventListener('mouseleave', () => {
      const hudX = this.querySelector('#hud-mx');
      const hudY = this.querySelector('#hud-my');
      if (hudX) hudX.textContent = '—';
      if (hudY) hudY.textContent = '—';
    });
  }

  /* ══════════════════════════════════════════════════════
     CANVAS RENDERING
  ══════════════════════════════════════════════════════ */
  _renderCanvas() {
    const canvas = this.querySelector('#tlc-map-canvas');
    if (!canvas) return;
    canvas.innerHTML = '';

    const C = window.TLC_COORDS;
    const { MAP_W, MAP_H, gxToPx, gyToPy } = C;

    // Set canvas size
    canvas.style.width  = MAP_W + 'px';
    canvas.style.height = MAP_H + 'px';

    /* ── Ozean-Background ── */
    const ocean = document.createElement('div');
    ocean.style.cssText = `position:absolute;inset:0;
      background: radial-gradient(ellipse 70% 70% at 50% 50%,
        #0a1e2d 0%, #061018 55%, #030c14 100%);`;
    canvas.appendChild(ocean);

    /* ── Playing area limitation at ±5000 ── */
    const wb = C.getWorldBorderPx();
    const border = document.createElement('div');
    border.style.cssText = `
      position:absolute;
      left:${wb.x}px; top:${wb.y}px;
      width:${wb.w}px; height:${wb.h}px;
      border: 2px solid rgba(255,100,60,0.3);
      box-shadow: inset 0 0 200px rgba(255,80,40,0.03);
      pointer-events:none; border-radius:4px;`;
    canvas.appendChild(border);

    /* ── Grid (every 50 units, from -600 to +600) ── */
    const gStep  = 50;
    const gRange = C.ORIGIN_PX / C.PX_PER_UNIT; 

    for (let gx = -gRange; gx <= gRange; gx += gStep) {
      const px = gxToPx(gx);
      const l  = document.createElement('div');
      l.className = 'tlc-grid-v';
      l.style.cssText = `left:${px}px; top:0; height:${MAP_H}px;`;
      canvas.appendChild(l);
    }
    for (let gy = -gRange; gy <= gRange; gy += gStep) {
      const py = gyToPy(gy);
      const l  = document.createElement('div');
      l.className = 'tlc-grid-h';
      l.style.cssText = `top:${py}px; left:0; width:${MAP_W}px;`;
      canvas.appendChild(l);
    }

    /* ── Axis lines (0,0) ── */
    const axX = document.createElement('div');
    axX.style.cssText = `position:absolute;top:${gyToPy(0)}px;left:0;width:${MAP_W}px;
      height:1px;background:rgba(0,212,170,0.18);pointer-events:none;`;
    canvas.appendChild(axX);
    const axY = document.createElement('div');
    axY.style.cssText = `position:absolute;left:${gxToPx(0)}px;top:0;height:${MAP_H}px;
      width:1px;background:rgba(0,212,170,0.18);pointer-events:none;`;
    canvas.appendChild(axY);

    /* ── NavBeacon range circles ── */
    window.TLC_LOCATIONS
      .filter(l => l.radarRadius)
      .forEach(l => {
        const rPx = l.radarRadius * C.PX_PER_UNIT;
        const rc  = document.createElement('div');
        rc.className = 'tlc-range-circle';
        // left/top = center of the beacon; transform:translate(-50%,-50%) in CSS centers the circle
        rc.style.cssText = `
          left:${gxToPx(l.gx)}px; top:${gyToPy(l.gy)}px;
          width:${rPx*2}px; height:${rPx*2}px;`;
        canvas.appendChild(rc);
      });

    /* ── Locations ── */
    const activeZone = this._activeZone || (window.TLC_ZONES && window.TLC_ZONES[0]?.id) || 'z1';
    const vis = window.TLC_STATE.get('visibility') || {};
    window.TLC_LOCATIONS
      .filter(l => {
        if (l.zone !== activeZone) return false;
        if (l.hidden                    && !vis.hidden)   return false;
        if (l.type === 'SeedVault' && l.gameid !== 'SeedVaultA' && !vis.seedvault) return false;
        if (l.type === 'Cave'           && !vis.caves)    return false;
        return true;
      })
      .forEach(loc => this._renderNode(loc, canvas));

    /* ── User Markers ── */
    (window.TLC_STATE.get('userMarkers') || []).forEach((m, i) => {
      this._renderUserMarker(m, i, canvas);
    });

    /* ── Waypoints ── */
    (window.TLC_STATE.get('waypoints') || []).forEach((w, i) => {
      this._renderWaypoint(w, i, canvas);
    });

    this._applyTransform();
    this._updateBoat();
    this._drawRulers();
  }

  /* ── Node ── */
  _renderNode(loc, canvas) {
    const types = window.TLC_LOCATION_TYPES;
    const type  = types[loc.type];
    if (!type) return;

    const _savedNd  = (window.TLC_STATE.get('nodeData') || {})[loc.id];
    const _defaults = loc.defaults || {};
    // Defaults nur anwenden wenn noch kein gespeicherter Eintrag existiert
    const nd = _savedNd ? _savedNd : (() => {
      if (!loc.defaults) return {};
      // Defaults einmalig in nodeData schreiben damit sie persistent werden
      const nodeData = Object.assign({}, window.TLC_STATE.get('nodeData') || {});
      const base = {};
      if (_defaults.color)     base.color    = _defaults.color;
      if (_defaults.visited)   base.visited  = _defaults.visited;
      if (_defaults.notes)     base.notes    = _defaults.notes.map(text => ({
        text, ts: new Date().toISOString().slice(0,10)
      }));
      if (_defaults.resources) base.resources = _defaults.resources;
      if (_defaults.tanks)     base.tanks     = _defaults.tanks;
      nodeData[loc.id] = base;
      window.TLC_STATE.set('nodeData', nodeData);
      window.TLC_STATE.save();
      return base;
    })();
    const color = nd.color || type.color;

    const iconPath = `../../data/Images/${type.icon}.png`;

    const el = document.createElement('div');
    el.className = `tlc-node sz-${type.size}`;
    el.style.cssText = `left:${window.TLC_COORDS.gxToPx(loc.gx)}px;top:${window.TLC_COORDS.gyToPy(loc.gy)}px;`;

    const isSelected = this._selectedLocId === loc.id;


    const vis2 = window.TLC_STATE.get('visibility') || {};
    const fogActive = vis2.fogOfWar !== false;
    const fogExempt = loc.gameid === 'SanctuaryDock37';
    const visited = !fogActive || fogExempt || nd.visited === true;
    const showLabels = (window.TLC_STATE.get('visibility') || {}).labels !== false;

    el.innerHTML = `
      <div class="node-circle" style="background:none;border:none;">
        <img src="${iconPath}" class="node-icon"
             style="${this._colorToFilter(color, isSelected)}${!visited ? ';filter:blur(3px) brightness(0.3) grayscale(1);opacity:0.5;' : ''}"
             draggable="false" alt="">
        ${!visited ? `<div class="node-fog" title="Unvisted Location">
          <span class="fog-eye">👁</span>
          <span class="fog-q">?</span>
        </div>` : ''}
      </div>
      ${isSelected ? `<div class="node-select-ring" style="border-color:${color};box-shadow:0 0 10px ${color}66;"></div>` : ''}
      ${showLabels ? `<div class="node-label" style="color:${visited ? color : '#4a7a8a'};${!visited ? 'filter:blur(3.5px);user-select:none;' : ''}${isSelected ? 'font-weight:bold;text-shadow:0 0 8px '+color+'88;' : ''}">${loc.name}</div>` : ''}
      ${nd.note ? `<div class="node-note-badge" style="color:${color};">${nd.note}</div>` : ''}
    `;

    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._openNodeCtx(e, loc);
    });
    /* LMB → navigate to station (highlight + center) */
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this._panTo(loc);
    });

    canvas.appendChild(el);
  }

  /* ── User Marker ── */
  _renderUserMarker(m, idx, canvas) {
    const el = document.createElement('div');
    el.className = 'tlc-user-marker';
    el.style.cssText = `left:${window.TLC_COORDS.gxToPx(m.gx)}px;top:${window.TLC_COORDS.gyToPy(m.gy)}px;`;
    el.innerHTML = `
      <div class="um-dot" style="background:${m.color||'#00d4aa'};
        box-shadow:0 0 6px ${m.color||'#00d4aa'}55;"></div>
      ${m.note ? `<div class="um-label" style="color:${m.color||'#00d4aa'};">${m.note}</div>` : ''}
    `;
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault(); e.stopPropagation();
      this._openUserMarkerCtx(e, idx);
    });
    el.addEventListener('click', (e) => e.stopPropagation());
    canvas.appendChild(el);
  }

  /* ── Waypoint ── */
  _renderWaypoint(w, idx, canvas) {
    const el = document.createElement('div');
    el.className = 'tlc-waypoint';
    el.style.cssText = `left:${window.TLC_COORDS.gxToPx(w.gx)}px;top:${window.TLC_COORDS.gyToPy(w.gy)}px;`;
    el.innerHTML = `
      <div class="wp-label">${w.label || 'WP ' + (idx + 1)}</div>
      <div class="wp-head"></div>
      <div class="wp-tail"></div>
    `;
    el.title = `Klick zum Entfernen: ${w.label || 'WP ' + (idx + 1)}`;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this._removeWaypoint(idx);
    });
    canvas.appendChild(el);
  }

  /* ══════════════════════════════════════════════════════
     TRANSFORM / BOAT
  ══════════════════════════════════════════════════════ */
  _applyTransform() {
    const canvas = this.querySelector('#tlc-map-canvas');
    if (!canvas) return;
    const s = window.TLC_STATE;
    canvas.style.transform = `translate(${s.get('panX')}px,${s.get('panY')}px) scale(${s.get('scale')})`;
    this._drawRulers();
  }

  /* ── Ruler zeichnen ─────────────────────────────────────────────── */
  _drawRulers() {
    const wrap  = this.querySelector('#tlc-map-wrap');
    const rxCvs = this.querySelector('#tlc-ruler-x');
    const ryCvs = this.querySelector('#tlc-ruler-y');
    if (!wrap || !rxCvs || !ryCvs) return;

    const ROFF = 20;
    const s    = window.TLC_STATE;
    const panX = s.get('panX');
    const panY = s.get('panY');
    const sc   = s.get('scale');
    const C    = window.TLC_COORDS;

    // Available area (excluding ruler corner)
    const aW = wrap.clientWidth  - ROFF;
    const aH = wrap.clientHeight - ROFF;

    // Set the canvas width/height attributes (determines the canvas area)
    // UND CSS-Größe explizit setzen (verhindert Browser-Skalierung/Stretch)
    if (rxCvs.width !== aW || rxCvs.height !== ROFF) {
      rxCvs.width  = aW;   rxCvs.height = ROFF;
      rxCvs.style.width  = aW + 'px';
      rxCvs.style.height = ROFF + 'px';
    }
    if (ryCvs.width !== ROFF || ryCvs.height !== aH) {
      ryCvs.width  = ROFF; ryCvs.height = aH;
      ryCvs.style.width  = ROFF + 'px';
      ryCvs.style.height = aH + 'px';
    }

    const BG     = 'rgba(6,13,16,0.95)';
    const LINE   = '#1a3a4a';
    const TICK   = '#4a7a8a';
    const ZERO   = '#00d4aa';
    const LABEL  = '#6a9aaa';
    const FONT   = '9px "Share Tech Mono", monospace';

    // ── Step based on zoom ─────────────────────────────────────────────
    // Goal: ~60–120 Screen-px between ticks
    const rawStep = 60 / sc / C.PX_PER_UNIT;   // in game units
    const steps   = [1,2,5,10,20,25,50,100,200,500,1000,2500,5000];
    const step    = steps.find(s => s >= rawStep) || 5000;
    const labelStep = step * 2;  // Numbers only at every 2nd tick

    // ── X-Ruler ───────────────────────────────────────────────────────
    {
      const ctx = rxCvs.getContext('2d');
      ctx.clearRect(0, 0, aW, ROFF);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, aW, ROFF);

      // Visible game coordinate range on X-axis
      const gxLeft  = C.pxToGx(-panX / sc);
      const gxRight = C.pxToGx((aW - panX) / sc);
      const first   = Math.ceil(gxLeft / step) * step;

      ctx.font      = FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let gx = first; gx <= gxRight + step; gx += step) {
        // Screen-X relative to the ruler canvas (which starts at wrap.left+ROFF)
        const screenX = C.gxToPx(gx) * sc + panX;
        if (screenX < 0 || screenX > aW) continue;

        const isZero = gx === 0;
        const showLabel = (gx % labelStep === 0) || isZero;
        const tickH  = isZero ? ROFF - 1 : showLabel ? 10 : 5;
        const col    = isZero ? ZERO : TICK;

        ctx.strokeStyle = col;
        ctx.lineWidth   = isZero ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.moveTo(screenX + 0.5, ROFF);
        ctx.lineTo(screenX + 0.5, ROFF - tickH);
        ctx.stroke();

        if (showLabel) {
          ctx.fillStyle = isZero ? ZERO : LABEL;
          ctx.fillText(String(gx), screenX, 1);
        }
      }

      // dividing line below
      ctx.strokeStyle = LINE;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(0, ROFF - 0.5);
      ctx.lineTo(aW, ROFF - 0.5);
      ctx.stroke();
    }

    // ── Y-Ruler ───────────────────────────────────────────────────────
    {
      const ctx = ryCvs.getContext('2d');
      ctx.clearRect(0, 0, ROFF, aH);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, ROFF, aH);

      const gyTop    = C.pyToGy(-panY / sc);
      const gyBottom = C.pyToGy((aH - panY) / sc);
      const first    = Math.ceil(Math.min(gyTop, gyBottom) / step) * step;
      const last     = Math.ceil(Math.max(gyTop, gyBottom) / step) * step;

      ctx.font         = FONT;
      ctx.textBaseline = 'middle';

      for (let gy = first; gy <= last + step; gy += step) {
        const screenY = C.gyToPy(gy) * sc + panY;
        if (screenY < 0 || screenY > aH) continue;

        const isZero    = gy === 0;
        const showLabel = (gy % labelStep === 0) || isZero;
        const tickW     = isZero ? ROFF - 1 : showLabel ? 10 : 5;
        const col       = isZero ? ZERO : TICK;

        ctx.strokeStyle = col;
        ctx.lineWidth   = isZero ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.moveTo(ROFF, screenY + 0.5);
        ctx.lineTo(ROFF - tickW, screenY + 0.5);
        ctx.stroke();

        if (showLabel) {
          ctx.save();
          ctx.fillStyle = isZero ? ZERO : LABEL;
          ctx.textAlign = 'center';
          
          ctx.translate(ROFF / 2, screenY);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(String(gy), 0, 0);
          ctx.restore();
        }
      }

      
      ctx.strokeStyle = LINE;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(ROFF - 0.5, 0);
      ctx.lineTo(ROFF - 0.5, aH);
      ctx.stroke();
    }
  }

  _toggleHumanCalc() {
    const existing = document.querySelector('tlc-human-calc');
    if (existing) { existing.remove(); return; }
    const calc = document.createElement('tlc-human-calc');
    document.body.appendChild(calc);
  }

  _toggleSettings() {
    const win = this.querySelector('#tlc-settings');
    if (!win) return;
    const visible = win.style.display !== 'none';
    win.style.display = visible ? 'none' : 'block';
    if (!visible) this._initSettings();
  }

  _initSettings() {
    const vis = window.TLC_STATE.get('visibility') || {};
    const checks = { hidden: false, seedvault: false, caves: false, labels: true, fogOfWar: true };
    Object.keys(checks).forEach(key => {
      const el = this.querySelector('#chk-' + key);
      if (el) el.checked = (vis[key] !== undefined) ? vis[key] : checks[key];
    });

    
    Object.keys(checks).forEach(key => {
      const el = this.querySelector('#chk-' + key);
      if (!el || el._swBound) return;
      el._swBound = true;
      el.addEventListener('change', () => {
        const v = Object.assign({}, window.TLC_STATE.get('visibility') || {});
        v[key] = el.checked;
        window.TLC_STATE.set('visibility', v);
        window.TLC_STATE.save();
      });
    });

    
    const closeBtn = this.querySelector('#sw-close');
    if (closeBtn && !closeBtn._swBound) {
      closeBtn._swBound = true;
      closeBtn.addEventListener('click', () => {
        this.querySelector('#tlc-settings').style.display = 'none';
      });
    }

    
    const exportBtn = this.querySelector('#sw-export');
    if (exportBtn && !exportBtn._swBound) {
      exportBtn._swBound = true;
      exportBtn.addEventListener('click', () => this._exportData());
    }

    
    const importBtn = this.querySelector('#sw-import');
    const importFile = this.querySelector('#sw-import-file');
    if (importBtn && !importBtn._swBound) {
      importBtn._swBound = true;
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => this._importData(ev.target.result);
        reader.readAsText(file);
        e.target.value = '';
      });
    }

    
    const clearBtn = this.querySelector('#sw-clear');
    if (clearBtn && !clearBtn._swBound) {
      clearBtn._swBound = true;
      clearBtn.addEventListener('click', () => {
        if (!confirm('Delete all local data? Irreversible!')) return;
        ['waypoints','userMarkers','nodeData','boatPos','visibility'].forEach(k => {
          window.TLC_STATE.set(k, k === 'nodeData' ? {} : k === 'boatPos' ? null : []);
        });
        window.TLC_STATE.save();
        window.tlcNotify('Data deleted', 'warn');
      });
    }
  }

  _exportData() {
    const s = window.TLC_STATE;
    const data = {
      version: 1, exported: new Date().toISOString(),
      waypoints:   s.get('waypoints')   || [],
      userMarkers: s.get('userMarkers') || [],
      nodeData:    s.get('nodeData')    || {},
      boatPos:     s.get('boatPos'),
      visibility:  s.get('visibility')  || {},
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'tlc-map-' + new Date().toISOString().slice(0,10) + '.json';
    a.click(); URL.revokeObjectURL(url);
    window.tlcNotify('Export successful ✓');
  }

  _importData(jsonStr) {
    let data;
    try { data = JSON.parse(jsonStr); } catch { window.tlcNotify('Invalid file', 'error'); return; }
    if (!data.version) { window.tlcNotify('Unknown format', 'error'); return; }
    const s = window.TLC_STATE;
    if (data.waypoints)   s.set('waypoints',   data.waypoints);
    if (data.userMarkers) s.set('userMarkers', data.userMarkers);
    if (data.nodeData)    s.set('nodeData',    data.nodeData);
    if (data.boatPos)     s.set('boatPos',     data.boatPos);
    if (data.visibility)  s.set('visibility',  data.visibility);
    s.save();
    window.tlcNotify('Import successful ✓');
  }

  _updateBoat() {
    const boat = this.querySelector('#tlc-boat');
    const wrap = this.querySelector('#tlc-map-wrap');
    if (!boat || !wrap) return;
    const bp = window.TLC_STATE.get('boatPos');
    if (!bp) { boat.style.display = 'none'; return; }

    const s  = window.TLC_STATE;
    const r  = wrap.getBoundingClientRect();
    const cx = window.TLC_COORDS.gxToPx(bp.gx);
    const cy = window.TLC_COORDS.gyToPy(bp.gy);
    const RULER_OFF = 20;
    const sx = cx * s.get('scale') + s.get('panX') + RULER_OFF;
    const sy = cy * s.get('scale') + s.get('panY') + RULER_OFF;

    boat.style.display = 'block';
    boat.style.left    = sx + 'px';
    boat.style.top     = sy + 'px';
  }

  /* ══════════════════════════════════════════════════════
     VIEW
  ══════════════════════════════════════════════════════ */
  _resetView() {
    const wrap = this.querySelector('#tlc-map-wrap');
    if (!wrap) return;
    const s    = window.TLC_STATE;
    const C    = window.TLC_COORDS;
    const ROFF = 20;

    // True location bounds with buffer
    const PAD  = 20;   
    const lonMin = -10 - PAD, lonMax = 160 + PAD;
    const latMin = -82 - PAD, latMax =  78 + PAD;
    const areaW  = (lonMax - lonMin) * C.PX_PER_UNIT;
    const areaH  = (latMax - latMin) * C.PX_PER_UNIT;

    // Available viewport (without ruler)
    const vpW = wrap.clientWidth  - ROFF;
    const vpH = wrap.clientHeight - ROFF;

    // Scale: Area should fill 85% of the viewport
    const scX = vpW * 0.85 / areaW;
    const scY = vpH * 0.85 / areaH;
    const sc  = Math.max(0.01, Math.min(4, Math.min(scX, scY)));

    // Center of the area in the middle of the available viewport
    const cx  = C.gxToPx((lonMin + lonMax) / 2);
    const cy  = C.gyToPy((latMin + latMax) / 2);

    s.set('scale', sc);
    s.set('panX',  vpW / 2 - cx * sc);
    s.set('panY',  vpH / 2 - cy * sc);
    this._applyTransform();
    this._updateBoat();
  }

  _zoom(factor) {
    const wrap = this.querySelector('#tlc-map-wrap');
    if (!wrap) return;
    const s      = window.TLC_STATE;
    const oldSc  = s.get('scale');
    const newSc  = Math.max(0.25, Math.min(9, oldSc * factor));
    // True factor calculate — limited by Min/Max
    // Without that the map would jump when scale is already at the limit
    const realF  = newSc / oldSc;
    const mx     = wrap.clientWidth  / 2;
    const my     = wrap.clientHeight / 2;
    s.set('panX',  mx - (mx - s.get('panX')) * realF);
    s.set('panY',  my - (my - s.get('panY')) * realF);
    s.set('scale', newSc);
    this._applyTransform();
    this._updateBoat();
  }

  _panTo(loc) {
    const wrap = this.querySelector('#tlc-map-wrap');
    if (!wrap) return;
    const s  = window.TLC_STATE;
    const cx = window.TLC_COORDS.gxToPx(loc.gx);
    const cy = window.TLC_COORDS.gyToPy(loc.gy);
    const sc   = Math.max(s.get('scale'), 0.08);
    const ROFF = 20;
    s.set('panX', (wrap.clientWidth  - ROFF) / 2 - cx * sc);
    s.set('panY', (wrap.clientHeight - ROFF) / 2 - cy * sc);
    this._applyTransform();
    this._updateBoat();
    // Highlight: Remember active station + re-render canvas
    this._selectedLocId = loc.id;
    this._renderCanvas();
  }

  /* ══════════════════════════════════════════════════════
     CLICK HANDLER
  ══════════════════════════════════════════════════════ */
  _handleMapClick(e) {
    const wrap = this.querySelector('#tlc-map-wrap');
    if (!wrap) return;
    const r       = wrap.getBoundingClientRect();
    const s       = window.TLC_STATE;
    const [cx,cy] = window.TLC_COORDS.screenToCanvas(
      e.clientX - 20, e.clientY - 20, r, s.get('panX'), s.get('panY'), s.get('scale')
    );

    
    /* Node nearby? → no marker */
    const nearNode = window.TLC_LOCATIONS.find(l => {
      return window.TLC_COORDS.distPx(
        window.TLC_COORDS.gxToPx(l.gx), window.TLC_COORDS.gyToPy(l.gy), cx, cy
      ) < 18;
    });
    if (nearNode) return;

    const gx = Math.round(window.TLC_COORDS.pxToGx(cx));
    const gy = Math.round(window.TLC_COORDS.pyToGy(cy));
    this._openUserMarkerModal(gx, gy);
  }

  /* ══════════════════════════════════════════════════════
     CONTEXT MENUS
  ══════════════════════════════════════════════════════ */
  _toggleVisited(loc) {
    const nodeData = Object.assign({}, window.TLC_STATE.get('nodeData') || {});
    const nd = Object.assign({}, nodeData[loc.id] || {});
    nd.visited = !nd.visited;
    nodeData[loc.id] = nd;
    window.TLC_STATE.set('nodeData', nodeData);
    window.TLC_STATE.save();
  }

  _openNodeCtx(e, loc) {
    const nd2    = (window.TLC_STATE.get('nodeData') || {})[loc.id] || {};
    const visited2 = nd2.visited === true;
    window.TLC_CTX_MENU.show(e.clientX, e.clientY, [
      { type: 'title', text: loc.name },
      { type: 'sep' },
      { icon: visited2 ? '🙈' : '✅', label: visited2 ? 'Mark as Unvisited' : 'Mark as Visited',
        action: () => this._toggleVisited(loc) },
      { icon: 'ℹ️', label: 'Open Info & Note',  action: () => this._openNodeInfoModal(loc) },
      { icon: '📌', label: 'Set Waypoint',       action: () => this._openWaypointModal(loc.gx, loc.gy, loc.name) },
    ]);
  }

  _openMapCtx(e) {
    const wrap = this.querySelector('#tlc-map-wrap');
    if (!wrap) return;
    const r       = wrap.getBoundingClientRect();
    const s       = window.TLC_STATE;
    const [cx,cy] = window.TLC_COORDS.screenToCanvas(
      e.clientX - 20, e.clientY - 20, r, s.get('panX'), s.get('panY'), s.get('scale')
    );
    const gx = Math.round(window.TLC_COORDS.pxToGx(cx));
    const gy = Math.round(window.TLC_COORDS.pyToGy(cy));

    window.TLC_CTX_MENU.show(e.clientX, e.clientY, [
      { type: 'title', text: `X: ${gx}   Y: ${gy}` },
      { type: 'sep' },
      { icon: '📍', label: 'Add Marker',     action: () => this._openUserMarkerModal(gx, gy) },
      { icon: '⚑',  label: 'Set Waypoint',            action: () => this._openWaypointModal(gx, gy) },
      { icon: '⚓', label: 'Set Boat Position',  action: () => {
          window.TLC_STATE.set('boatPos', { gx, gy });
          window.TLC_STORAGE.save();
          const bx = this.querySelector('#boat-x');
          const by = this.querySelector('#boat-y');
          if (bx) bx.value = gx;
          if (by) by.value = gy;
          this._updateBoat();
          tlcNotify(`⚓ Boat: X ${gx}, Y ${gy}`);
        }},
    ]);
  }

  _openUserMarkerCtx(e, idx) {
    const m = (window.TLC_STATE.get('userMarkers') || [])[idx];
    if (!m) return;
    window.TLC_CTX_MENU.show(e.clientX, e.clientY, [
      { type: 'title', text: m.note || 'Own Marker' },
      { type: 'sep' },
      { icon: '✏️', label: 'Edit', action: () => this._editUserMarkerModal(idx) },
      { icon: '🗑️', label: 'Delete',    action: () => {
          const markers = window.TLC_STATE.get('userMarkers');
          markers.splice(idx, 1);
          window.TLC_STATE.set('userMarkers', markers);
          window.TLC_STORAGE.save();
          tlcNotify('Marker removed.');
        }},
    ]);
  }

  /* ══════════════════════════════════════════════════════
     MODALS
  ══════════════════════════════════════════════════════ */

  /* ── Palette ── */
  static get _PALETTE() {
    return ['#00d4aa','#00a8e8','#f0c040','#ff6b35','#e060e0',
            '#60e060','#ff4060','#a0a0ff','#ffffff','#c04000'];
  }

  _swatchRow(selected) {
    return `<div class="color-row" id="swatch-row">
      ${TlcMap._PALETTE.map(c =>
        `<div class="swatch ${c === selected ? 'active' : ''}"
              style="background:${c}" data-color="${c}"></div>`
      ).join('')}
      <input type="color" id="custom-color" value="${selected||'#00d4aa'}"
        style="width:22px;height:22px;border:none;border-radius:4px;cursor:pointer;padding:0;flex-shrink:0;">
    </div>`;
  }

  _bindSwatches(root, onChange) {
    root.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        root.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        const cc = root.querySelector('#custom-color');
        if (cc) cc.value = sw.dataset.color;
        if (onChange) onChange(sw.dataset.color);
      });
    });
    const cc = root.querySelector('#custom-color');
    if (cc) cc.addEventListener('input', () => {
      root.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      if (onChange) onChange(cc.value);
    });
  }

  /* Hex color → Hue level for CSS hue-rotate() filter */
  _colorToFilter(hex, isSelected) {
    // For white PNGs: brightness(0) makes white→black, invert(1) makes black→white,
    // then sepia+hue-rotate+saturate for the target color
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex.split('').map(function(x){return x+x;}).join('');
    const r = parseInt(hex.slice(0,2),16)/255;
    const g = parseInt(hex.slice(2,4),16)/255;
    const b = parseInt(hex.slice(4,6),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max-min;
    // Calculate Hue
    let h = 0;
    if (d > 0) {
      h = max===r ? (g-b)/d%6 : max===g ? (b-r)/d+2 : (r-g)/d+4;
      h = Math.round(h*60+360)%360;
    }
    const sat = max < 0.1 ? 0 : (d / max);
    const brightnessBoost = (1.0 + max * 0.4).toFixed(2);
    const saturateVal = sat < 0.1 ? 2 : Math.round(5 + sat * 8);
    let f = 'brightness(0) invert(1) sepia(1) hue-rotate(' + h + 'deg) saturate(' + saturateVal + ') brightness(' + brightnessBoost + ')';
    if (isSelected) {
      f += ' drop-shadow(0 0 5px #' + hex + ') drop-shadow(0 0 10px #' + hex + '88)';
    }
    return '-webkit-filter:' + f + '; filter:' + f + ';';
  }

  _colorToHue(hex) {
    // White (#ffffff) as base → hue-rotate rotates into the desired spectrum
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex.split('').map(x=>x+x).join('');
    const r = parseInt(hex.slice(0,2),16)/255;
    const g = parseInt(hex.slice(2,4),16)/255;
    const b = parseInt(hex.slice(4,6),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max-min;
    if (d === 0) return 0;
    let h = max===r ? (g-b)/d%6 : max===g ? (b-r)/d+2 : (r-g)/d+4;
    return Math.round(h*60+360)%360;
  }

  _getSelectedColor(root) {
    const active = root.querySelector('.swatch.active');
    return active ? active.dataset.color : (root.querySelector('#custom-color')?.value || '#00d4aa');
  }

  /* ── Node Info Modal ── */
  _openNodeInfoModal(loc, focusColor = false) {
    const _savedNd  = (window.TLC_STATE.get('nodeData') || {})[loc.id];
    const _defaults = loc.defaults || {};
    // Defaults nur anwenden wenn noch kein gespeicherter Eintrag existiert
    const nd = _savedNd ? _savedNd : (() => {
      if (!loc.defaults) return {};
      // Defaults einmalig in nodeData schreiben damit sie persistent werden
      const nodeData = Object.assign({}, window.TLC_STATE.get('nodeData') || {});
      const base = {};
      if (_defaults.color)     base.color    = _defaults.color;
      if (_defaults.visited)   base.visited  = _defaults.visited;
      if (_defaults.notes)     base.notes    = _defaults.notes.map(text => ({
        text, ts: new Date().toISOString().slice(0,10)
      }));
      if (_defaults.resources) base.resources = _defaults.resources;
      if (_defaults.tanks)     base.tanks     = _defaults.tanks;
      nodeData[loc.id] = base;
      window.TLC_STATE.set('nodeData', nodeData);
      window.TLC_STATE.save();
      return base;
    })();
    const color = nd.color || window.TLC_LOCATION_TYPES[loc.type]?.color || '#00d4aa';

    // ── Resource types with capacities ─────────────────────────────
    const RES_TYPES = [
      { key: 'battery', label: 'Battery',   unit: 'kW',  cap: 6000,  icon: '🔋' },
      { key: 'oil',     label: 'Oil',          unit: 'L',   cap: 2000,  icon: '🛢️' },
      { key: 'diesel',  label: 'Diesel',      unit: 'L',   cap: 2000,  icon: '⛽' },
      { key: 'petrol',  label: 'Petrol',      unit: 'L',   cap: 2000,  icon: '🔴' },
      { key: 'oxygen',  label: 'Oxygen',  unit: 'L',   cap: 12000, icon: '💨' },
      { key: 'methane', label: 'Methane',      unit: 'L',   cap: 9000,  icon: '🔥' },
      { key: 'co2',     label: 'Carbon Dioxide', unit: 'L',   cap: 9000,  icon: '🌫️' },
      { key: 'water',   label: 'Fresh Water',   unit: 'L',   cap: 2000,  icon: '💧' },
    ];

    const tanks  = nd.tanks  || {};   // { battery: { count:2, current:4500 }, ... }
    const notes  = nd.notes  || [];   // [{ text, ts }]

    // ── Notizen HTML ──────────────────────────────────────────────────
    const notesHTML = () => (notes.length === 0)
      ? `<div class="empty-hint">No notes yet</div>`
      : notes.map((n, i) => `
          <div class="note-item">
            <div class="note-text">${n.text.replace(/\n/g,'<br>')}</div>
            <div class="note-meta">
              <span class="note-ts">${n.ts || ''}</span>
              <button class="note-del" data-idx="${i}" title="Delete">✕</button>
            </div>
          </div>`).join('');

    // ── Ressourcen-Rechner HTML ───────────────────────────────────────
    /* Enemies aus loc.enemies — gruppiert nach Kategorie
     * Format: { category:'Large Enemies', entries:[{name:'Roller Boi', count:2}] }
     * oder flach: { name:'Sweetheart', count:1, category:'Small Enemies' }
     */
    const ENEMY_CATEGORIES = ['Hazards', 'Small Enemies', 'Large Enemies'];
    const enemiesHTML = () => {
      const raw     = loc.enemies || [];
      if (!raw.length) return `<div class="empty-hint">No enemies defined for this location.</div>`;
      const cleared = nd.enemiesCleared || {};
      // Gruppieren
      const cats = {};
      raw.forEach((e, i) => {
        const cat = e.category || 'Sonstige';
        if (!cats[cat]) cats[cat] = [];
        cats[cat].push({ ...e, _idx: i });
      });
      const order = [...ENEMY_CATEGORIES, ...Object.keys(cats).filter(k => !ENEMY_CATEGORIES.includes(k))];
      return order.filter(cat => cats[cat]?.length).map(cat => `
        <div class="enemy-cat">
          <div class="enemy-cat-title">${cat}</div>
          ${cats[cat].map(e => {
            const isCleared = (e._idx in cleared) ? !!cleared[e._idx] : e.count === 0;
            return `
            <div class="enemy-row ${isCleared ? 'cleared' : ''}" data-enemy-idx="${e._idx}" title="${isCleared ? 'Click to reset' : 'Click to mark as cleared'}">
              <div class="enemy-name">${e.name}</div>
              <div class="enemy-count">${e.count != null ? '×' + e.count : '—'}</div>
              <div class="enemy-status">${isCleared ? '✓' : ''}</div>
            </div>`;
          }).join('')}
        </div>`).join('');
    };

    const calcHTML = () => RES_TYPES.map(rt => {
      const t = tanks[rt.key] || { count: 0, current: 0 };
      const maxCap    = t.count * rt.cap;
      const totalCur  = (t.current || 0) * (t.count || 0);
      const pct       = maxCap > 0 ? Math.min(100, Math.round((totalCur / maxCap) * 100)) : 0;
      const barColor = pct > 60 ? '#00d4aa' : pct > 30 ? '#f0c040' : '#ff6b35';
      return `
        <div class="calc-row" data-key="${rt.key}">
          <div class="calc-icon">${rt.icon}</div>
          <div class="calc-info">
            <div class="calc-label">${rt.label}</div>
            <div class="calc-sub">${rt.cap.toLocaleString()} ${rt.unit} / Tank</div>
          </div>
          <div class="calc-inputs">
            <div class="calc-inp-group">
              <label>Count</label>
              <input class="calc-count" type="number" min="0" max="99" value="${t.count}"
                data-key="${rt.key}" placeholder="0" style="width:54px;">
            </div>
            <div class="calc-inp-group">
              <label>Per Tank (${rt.unit})</label>
              <input class="calc-current" type="number" min="0" max="${rt.cap}" value="${t.current}"
                data-key="${rt.key}" placeholder="0" style="width:80px;">
            </div>
          </div>
          <div class="calc-result">
            <div class="calc-max">${maxCap > 0 ? totalCur.toLocaleString() + ' / ' + maxCap.toLocaleString() + ' ' + rt.unit : '—'}</div>
            <div class="calc-bar-wrap">
              <div class="calc-bar" style="width:${pct}%;background:${barColor};"></div>
            </div>
            <div class="calc-pct" style="color:${barColor};">${maxCap > 0 ? pct + '%' : '—'}</div>
          </div>
        </div>`;
    }).join('');

    // ── CSS (nur einmal injizieren) ───────────────────────────────────
    const extraCSS = `
      <style id="node-modal-css">
        .tab-bar { display:flex; gap:0; border-bottom:1px solid #1a4a5a; margin-bottom:18px; overflow-x:auto; flex-shrink:0; }
        .tab-bar::-webkit-scrollbar { display:none; }
        .tab-btn {
          padding:9px 14px; font-size:11px; cursor:pointer; letter-spacing:0.5px;
          background:none; border:none; color:#4a7a8a; border-bottom:2px solid transparent;
          font-family:'Share Tech Mono',monospace; transition:all 120ms; text-transform:uppercase;
          flex:1; text-align:center; white-space:nowrap; min-width:fit-content;
        }
        .tab-btn:hover { color:#b8e4f0; }
        .tab-btn.active { color:${color}; border-bottom-color:${color}; background:rgba(0,212,170,0.04); }
        .tab-panel { display:none; min-height:280px; }
        .tab-panel.active { display:block; }

        /* Notizen */
        .note-item {
          background:rgba(0,0,0,0.3); border:1px solid #1a4a5a; border-radius:4px;
          padding:8px 10px; margin-bottom:6px;
        }
        .note-text { font-size:11px; color:#b8e4f0; line-height:1.55; word-break:break-word; }
        .note-meta { display:flex; justify-content:space-between; align-items:center; margin-top:5px; }
        .note-ts   { font-size:9px; color:#4a7a8a; }
        .note-del  { background:none;border:none;color:#4a7a8a;cursor:pointer;font-size:11px;padding:0; }
        .note-del:hover { color:#ff4060; }
        .note-add-row { display:flex; gap:6px; margin-top:8px; }
        .note-add-row textarea {
          flex:1; background:rgba(0,0,0,0.4); border:1px solid #1a4a5a; border-radius:4px;
          color:#b8e4f0; font-family:'Share Tech Mono',monospace; font-size:11px;
          padding:6px 8px; outline:none; resize:vertical; min-height:52px;
        }
        .note-add-row textarea:focus { border-color:${color}; }
        .note-add-row button {
          align-self:flex-end; padding:6px 12px; background:rgba(0,212,170,0.15);
          border:1px solid ${color}; color:${color}; border-radius:4px;
          font-family:'Share Tech Mono',monospace; font-size:10px; cursor:pointer; white-space:nowrap;
        }
        .empty-hint { font-size:10px; color:#4a7a8a; padding:8px 0; }

        /* ── Enemies ── */
        .enemy-cat { margin-bottom:14px; }
        .enemy-cat-title {
          font-size:9px; letter-spacing:1.5px; text-transform:uppercase;
          color:#4a7a8a; padding:4px 0 6px;
          border-bottom:1px solid #1a4a5a; margin-bottom:4px;
        }
        .enemy-row {
          display:flex; align-items:center;
          padding:6px 8px;
          border-radius:3px;
          transition:background 80ms;
        }
        .enemy-row:hover { background:rgba(255,64,96,0.07); }
        .enemy-name  { flex:1; font-size:12px; color:#b8e4f0; }
        .enemy-count {
          font-family:'Orbitron',sans-serif; font-size:11px;
          color:#ff4060; flex-shrink:0;
        }
        .enemy-status { width:16px; text-align:center; font-size:11px; color:#00d4aa; flex-shrink:0; }
        .enemy-row { cursor:pointer; }
        .enemy-row.cleared .enemy-name  { text-decoration:line-through; color:#2a5a6a; }
        .enemy-row.cleared .enemy-count { color:#2a5a6a; }
        .enemy-row.cleared .enemy-status { color:#00d4aa; }
        .enemy-row.cleared { background:rgba(0,0,0,0.15); }

        /* Ressourcen-Rechner */
        .calc-row {
          display:grid; grid-template-columns:28px 1fr auto auto;
          gap:10px; align-items:center;
          padding:8px 0; border-bottom:1px solid #0f2e3a;
        }
        .calc-row:last-child { border-bottom:none; }
        .calc-icon  { font-size:18px; text-align:center; }
        .calc-label { font-size:11px; color:#b8e4f0; }
        .calc-sub   { font-size:9px;  color:#4a7a8a; margin-top:1px; }
        .calc-inputs { display:flex; gap:8px; }
        .calc-inp-group { display:flex; flex-direction:column; gap:3px; }
        .calc-inp-group label { font-size:8px; color:#4a7a8a; letter-spacing:1px; text-transform:uppercase; }
        .calc-inp-group input {
          background:rgba(0,0,0,0.45); border:1px solid #1a4a5a; border-radius:3px;
          color:#b8e4f0; font-family:'Share Tech Mono',monospace; font-size:11px;
          padding:4px 7px; outline:none;
        }
        .calc-inp-group input:focus { border-color:${color}; }
        .calc-result { text-align:right; min-width:80px; }
        .calc-max  { font-size:10px; color:#4a7a8a; margin-bottom:4px; }
        .calc-bar-wrap { height:4px; background:#0f2e3a; border-radius:2px; overflow:hidden; width:80px; margin-left:auto; }
        .calc-bar  { height:100%; border-radius:2px; transition:width 300ms; }
        .calc-pct  { font-size:11px; font-weight:bold; margin-top:3px; }

        /* Resource list (buildings) */
        .res-row { display:flex;align-items:center;gap:6px;margin:4px 0;font-size:11px; }
        .res-icon { width:20px;text-align:center;flex-shrink:0; }
        .res-label { flex:1; color:#b8e4f0; }
        .res-value { color:#4a7a8a;font-size:10px;min-width:30px; }
        .res-del { background:none;border:none;color:#4a7a8a;cursor:pointer;font-size:12px;padding:0 3px; }
        .res-del:hover { color:#ff4060; }
        .swatch { width:22px;height:22px;border-radius:4px;cursor:pointer;border:2px solid transparent;flex-shrink:0;transition:transform 120ms,border-color 120ms; }
        .swatch:hover { transform:scale(1.15); }
        .swatch.active { border-color:#fff; }
        .color-row { display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin-top:4px; }
        .field { margin-bottom:14px; }
        label { display:block;font-size:9px;letter-spacing:1px;color:#4a7a8a;margin-bottom:4px;text-transform:uppercase; }
        input,textarea,select {
          width:100%;background:rgba(0,0,0,0.45);border:1px solid #1a4a5a;border-radius:4px;
          color:#b8e4f0;font-family:'Share Tech Mono',monospace;font-size:11px;
          padding:6px 10px;outline:none;box-sizing:border-box;transition:border-color 120ms;
        }
        input:focus,textarea:focus { border-color:${color}; }
        textarea { resize:vertical;min-height:56px; }
        input::placeholder,textarea::placeholder { color:#4a7a8a; }
      </style>`;

    // ── Modal HTML ────────────────────────────────────────────────────
    const resHTML = () => (nd.resources || []).map((r, i) => `
      <div class="res-row">
        <span class="res-icon">${r.icon||'●'}</span>
        <span class="res-label">${r.label}</span>
        <span class="res-value">${r.value||''}</span>
        <button class="res-del" data-idx="${i}" title="Delete">✕</button>
      </div>`).join('') || `<div class="empty-hint">No Structures</div>`;

    window.TLC_MODAL.open({
      title: 'LOCATION INFO',
      body: `
        ${extraCSS}

        <!-- Location Header -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <div style="width:14px;height:14px;border-radius:50%;background:${color};flex-shrink:0;box-shadow:0 0 8px ${color}88;"></div>
          <div style="flex:1;">
            <div style="font-family:'Orbitron',sans-serif;font-size:12px;color:${color};">${loc.name}</div>
            <div style="font-size:9px;color:#4a7a8a;margin-top:2px;">
              ${window.TLC_LOCATION_TYPES[loc.type]?.label||''} &nbsp;·&nbsp; X: ${loc.gx} / Y: ${loc.gy}
            </div>
          </div>
        </div>

        ${loc.underwater ? `
        <div style="
          display:flex; align-items:center; gap:8px;
          background:rgba(0,168,232,0.1);
          border:1px solid rgba(0,168,232,0.35);
          border-radius:4px;
          padding:7px 12px;
          margin-bottom:12px;
        ">
          <span style="font-size:15px;">🤿</span>
          <div>
            <div style="font-size:11px;color:#00a8e8;letter-spacing:0.5px;">Underwater loot available</div>
            <div style="font-size:10px;color:#4a7a8a;margin-top:2px;">This location contains accessible loot points underwater.</div>
          </div>
        </div>` : ''}

        <!-- Tab Bar -->
        <div class="tab-bar">
          <button class="tab-btn active" data-tab="info">Color & Info</button>
          <button class="tab-btn" data-tab="notes">Notes</button>
          <button class="tab-btn" data-tab="calc">Resources</button>
          <button class="tab-btn" data-tab="buildings">Structures</button>
          <button class="tab-btn" data-tab="enemies">Enemies</button>
        </div>

        <!-- Tab: Color -->
        <div class="tab-panel active" id="tab-info">
          <div class="field">
            <label>Color</label>
            ${this._swatchRow(color)}
          </div>
          ${(() => {
            const infos = Array.isArray(loc.info) ? loc.info : (loc.info ? [loc.info] : []);
            if (!infos.length) return '';
            return `<div class="field">
              <label>Info</label>
              ${infos.map(line => `
                <div style="font-size:13px;color:#b8e4f0;line-height:1.7;
                  border-left:2px solid ${color}55;padding:6px 10px;
                  background:rgba(0,0,0,0.25);border-radius:0 4px 4px 0;
                  margin-bottom:6px;">
                  ${line}
                </div>`).join('')}
            </div>`;
          })()}
        </div>

        <!-- Tab: Notes -->
        <div class="tab-panel" id="tab-notes">
          <div id="notes-list">${notesHTML()}</div>
          <div class="note-add-row">
            <textarea id="note-input" placeholder="Add new note..." rows="3"></textarea>
            <button id="note-add-btn">+ Add</button>
          </div>
        </div>

        <!-- Tab: Resources Calculator -->
        <div class="tab-panel" id="tab-calc">
          <div style="font-size:9px;color:#4a7a8a;margin-bottom:10px;letter-spacing:0.5px;">
            Enter the number of tanks/batteries → Total capacity and fill level will be calculated.
          </div>
          <div id="calc-list">${calcHTML()}</div>
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid #1a4a5a;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:9px;color:#4a7a8a;letter-spacing:1px;">TOTAL CAPACITY</span>
            <span id="calc-total" style="font-size:12px;color:${color};font-family:'Orbitron',sans-serif;">—</span>
          </div>
        </div>

        <!-- Tab: Buildings -->
        <div class="tab-panel" id="tab-buildings">
          <div id="res-list">${resHTML()}</div>
          <div style="display:flex;gap:5px;margin-top:10px;">
            <input id="res-icon"  type="text" placeholder="🔋" style="width:46px;" maxlength="2">
            <input id="res-label" type="text" placeholder="Solar Panel" style="flex:1;">
            <input id="res-value" type="text" placeholder="×3" style="width:54px;">
            <button class="btn-ghost" id="res-add" style="padding:4px 10px;font-size:10px;background:none;border:1px solid #1a4a5a;border-radius:4px;color:#b8e4f0;cursor:pointer;">+</button>
          </div>
        </div>

        <!-- Tab: Enemies -->
        <div class="tab-panel" id="tab-enemies">
          ${enemiesHTML()}
        </div>
      `,
      footer: `
        <button class="btn-danger"  id="btn-reset">Reset</button>
        <button class="btn-ghost"   id="btn-cancel">Cancel</button>
        <button class="btn-primary" id="btn-save">Save</button>
      `,
      onOpen: (sr) => {
        this._bindSwatches(sr);

        // ── Tab-Switching ─────────────────────────────────────────────
        sr.querySelectorAll('.tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            sr.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            sr.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            sr.getElementById('tab-' + btn.dataset.tab).classList.add('active');
          });
        });

        // ── Notizen ───────────────────────────────────────────────────
        const refreshNotes = () => {
          const ndNow = (window.TLC_STATE.get('nodeData') || {})[loc.id] || {};
          sr.getElementById('notes-list').innerHTML = (ndNow.notes || []).length === 0
            ? `<div class="empty-hint">No new notes</div>`
            : (ndNow.notes || []).map((n, i) => `
                <div class="note-item">
                  <div class="note-text">${n.text.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
                  <div class="note-meta">
                    <span class="note-ts">${n.ts || ''}</span>
                    <button class="note-del" data-idx="${i}" title="Delete">✕</button>
                  </div>
                </div>`).join('');
        };

        sr.getElementById('notes-list').addEventListener('click', (e) => {
          const btn = e.target.closest('.note-del');
          if (!btn) return;
          const ndNow = (window.TLC_STATE.get('nodeData') || {})[loc.id] || {};
          ndNow.notes = ndNow.notes || [];
          ndNow.notes.splice(parseInt(btn.dataset.idx), 1);
          window.TLC_STATE.merge('nodeData', { [loc.id]: ndNow });
          refreshNotes();
        });

        sr.getElementById('note-add-btn').addEventListener('click', () => {
          const text = sr.getElementById('note-input').value.trim();
          if (!text) return;
          const ndNow = (window.TLC_STATE.get('nodeData') || {})[loc.id] || {};
          ndNow.notes = ndNow.notes || [];
          const ts = new Date().toLocaleString('de-DE', { day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit' });
          ndNow.notes.unshift({ text, ts });
          window.TLC_STATE.merge('nodeData', { [loc.id]: ndNow });
          sr.getElementById('note-input').value = '';
          refreshNotes();
        });

        // ── Resource calculator ────────────────────────────────────────
        const RES_TYPES = [
          { key:'battery', cap:6000  },
          { key:'oil',     cap:2000  },
          { key:'diesel',  cap:2000  },
          { key:'petrol',  cap:2000  },
          { key:'oxygen',  cap:12000 },
          { key:'methane', cap:9000  },
        ];

        const updateCalc = () => {
          let totalMax = 0, totalCurAll = 0;
          RES_TYPES.forEach(rt => {
            const countEl   = sr.querySelector(`.calc-count[data-key="${rt.key}"]`);
            const currentEl = sr.querySelector(`.calc-current[data-key="${rt.key}"]`);
            if (!countEl) return;
            const count      = parseInt(countEl.value)   || 0;
            const currentPer = parseFloat(currentEl.value) || 0; // pro Tank
            const maxCap     = count * rt.cap;
            const totalCur   = currentPer * count;               // Gesamt aktuell
            totalMax    += maxCap;
            totalCurAll += totalCur;
            const pct      = maxCap > 0 ? Math.min(100, Math.round((totalCur / maxCap) * 100)) : 0;
            const barColor = pct > 60 ? '#00d4aa' : pct > 30 ? '#f0c040' : '#ff6b35';
            const row = sr.querySelector(`.calc-row[data-key="${rt.key}"]`);
            if (!row) return;
            row.querySelector('.calc-max').textContent  = maxCap > 0
              ? totalCur.toLocaleString() + ' / ' + maxCap.toLocaleString() : '—';
            row.querySelector('.calc-bar').style.width       = pct + '%';
            row.querySelector('.calc-bar').style.background  = barColor;
            row.querySelector('.calc-pct').textContent       = maxCap > 0 ? pct + '%' : '—';
            row.querySelector('.calc-pct').style.color       = barColor;
          });
          const totalEl = sr.getElementById('calc-total');
          if (totalEl) totalEl.textContent = totalMax > 0
            ? totalCurAll.toLocaleString() + ' / ' + totalMax.toLocaleString() : '—';
        };

        sr.getElementById('calc-list').addEventListener('input', updateCalc);
        updateCalc(); // Initial

        // ── Enemies — Bereinigt Toggle ────────────────────────────────
        const enemyTab = sr.getElementById('tab-enemies');
        if (enemyTab) {
          enemyTab.addEventListener('click', (e) => {
            const row = e.target.closest('[data-enemy-idx]');
            if (!row) return;
            const idx  = parseInt(row.dataset.enemyIdx);
            const nodeData = Object.assign({}, window.TLC_STATE.get('nodeData') || {});
            const entry    = Object.assign({}, nodeData[loc.id] || {});
            const cleared  = Object.assign({}, entry.enemiesCleared || {});
            // Aktuellen Zustand ermitteln: explizit gespeichert oder count===0 default
            const loc_enemies = loc.enemies || [];
            const enemy = loc_enemies[idx];
            const currentState = (idx in cleared) ? !!cleared[idx] : (enemy?.count === 0);
            cleared[idx] = !currentState; // immer explizit speichern, nie löschen
            entry.enemiesCleared = cleared;
            nodeData[loc.id] = entry;
            window.TLC_STATE.set('nodeData', nodeData);
            window.TLC_STATE.save();
            // UI sofort updaten ohne Modal neu zu öffnen
            row.classList.toggle('cleared', !!cleared[idx]);
            row.querySelector('.enemy-name').style.textDecoration = cleared[idx] ? 'line-through' : '';
            row.querySelector('.enemy-count').style.color = cleared[idx] ? '#2a5a6a' : '#ff4060';
            row.querySelector('.enemy-status').textContent = cleared[idx] ? '✓' : '';
          });
        }

        // ── Buildings / Resources List ─────────────────────────────────
        sr.getElementById('res-list').addEventListener('click', (e) => {
          const btn = e.target.closest('.res-del');
          if (!btn) return;
          const ndNow = (window.TLC_STATE.get('nodeData') || {})[loc.id] || {};
          if (!ndNow.resources) return;
          ndNow.resources.splice(parseInt(btn.dataset.idx), 1);
          window.TLC_STATE.merge('nodeData', { [loc.id]: ndNow });
          sr.getElementById('res-list').innerHTML = resHTML();
        });

        sr.getElementById('res-add').addEventListener('click', () => {
          const icon  = sr.getElementById('res-icon').value || '●';
          const label = sr.getElementById('res-label').value.trim();
          if (!label) { tlcNotify('Please enter a label.', 'warn'); return; }
          const value = sr.getElementById('res-value').value.trim();
          const ndNow = (window.TLC_STATE.get('nodeData') || {})[loc.id] || {};
          if (!ndNow.resources) ndNow.resources = [];
          ndNow.resources.push({ icon, label, value });
          window.TLC_STATE.merge('nodeData', { [loc.id]: ndNow });
          sr.getElementById('res-list').innerHTML = resHTML();
          sr.getElementById('res-icon').value  = '';
          sr.getElementById('res-label').value = '';
          sr.getElementById('res-value').value = '';
        });

        // ── Speichern ─────────────────────────────────────────────────
        sr.getElementById('btn-save').addEventListener('click', () => {
          const noteEl   = sr.getElementById('node-note');
          const note      = noteEl ? noteEl.value.trim() : (nd.note || '');

          const color = this._getSelectedColor(sr);
          // Tanks aus Rechner speichern
          const saveTanks = {};
          RES_TYPES.forEach(rt => {
            const countEl   = sr.querySelector(`.calc-count[data-key="${rt.key}"]`);
            const currentEl = sr.querySelector(`.calc-current[data-key="${rt.key}"]`);
            saveTanks[rt.key] = {
              count:   parseInt(countEl?.value)   || 0,
              current: parseFloat(currentEl?.value) || 0,
            };
          });
          const ndNow = (window.TLC_STATE.get('nodeData') || {})[loc.id] || {};
          window.TLC_STATE.merge('nodeData', { [loc.id]: { ...ndNow, note, color, tanks: saveTanks } });
          window.TLC_STORAGE.save();
          window.TLC_MODAL.close();
          tlcNotify('✓ Saved');
        });

        // ── Reset ──────────────────────────────────────────────
        sr.getElementById('btn-reset').addEventListener('click', () => {
          const nd2 = window.TLC_STATE.get('nodeData') || {};
          delete nd2[loc.id];
          window.TLC_STATE.set('nodeData', nd2);
          window.TLC_STORAGE.save();
          window.TLC_MODAL.close();
          tlcNotify('Data reset');
        });

        sr.getElementById('btn-cancel').addEventListener('click', () => window.TLC_MODAL.close());

        // Tab via Parameter
        if (focusColor) {
          const colorBtn = sr.querySelector('.tab-btn[data-tab="info"]');
          if (colorBtn) colorBtn.click();
        }
      },
    });
  }

    /* ── Waypoint Modal ── */
  _openWaypointModal(gx, gy, defaultName = '') {
    window.TLC_MODAL.open({
      title: 'SET WAYPOINT',
      body: `
        <div class="field">
          <label>NAME</label>
          <input id="wp-label" type="text" placeholder="Waypoint name..." value="${defaultName}">
        </div>
        <div style="font-size:10px;color:#4a7a8a;">Position: X ${gx} / Y ${gy}</div>
      `,
      footer: `
        <button class="btn-ghost"   id="btn-cancel">Cancel</button>
        <button class="btn-primary" id="btn-save">Set</button>
      `,
      onOpen: (sr) => {
        sr.getElementById('btn-save').addEventListener('click', () => {
          const label = sr.getElementById('wp-label').value.trim() || `WP ${(window.TLC_STATE.get('waypoints')||[]).length + 1}`;
          const wps = window.TLC_STATE.get('waypoints') || [];
          wps.push({ gx, gy, label });
          window.TLC_STATE.set('waypoints', wps);
          window.TLC_STORAGE.save();
          window.TLC_MODAL.close();
          tlcNotify(`⚑ Waypoint "${label}" set at X:${gx} Y:${gy}`);
        });
        sr.getElementById('btn-cancel').addEventListener('click', () => window.TLC_MODAL.close());
        sr.getElementById('wp-label').addEventListener('keydown', (e) => {
          if (e.key === 'Enter') sr.getElementById('btn-save').click();
        });
      },
    });
  }

  /* ── Toggle Waypoint via E-Key ── */
  _toggleWaypoint(gx, gy) {
    const THRESH = 8;
    const wps    = window.TLC_STATE.get('waypoints') || [];
    const idx    = wps.findIndex(w => Math.abs(w.gx - gx) < THRESH && Math.abs(w.gy - gy) < THRESH);
    if (idx >= 0) {
      this._removeWaypoint(idx);
    } else {
      this._openWaypointModal(gx, gy);
    }
  }

  _removeWaypoint(idx) {
    const wps = window.TLC_STATE.get('waypoints') || [];
    const w   = wps[idx];
    wps.splice(idx, 1);
    window.TLC_STATE.set('waypoints', wps);
    window.TLC_STORAGE.save();
    tlcNotify(`Waypoint "${w?.label || idx + 1}" entfernt`);
  }

  /* ── User Marker Modal ── */
  _openUserMarkerModal(gx, gy, existing = null) {
    const isEdit = existing !== null;
    window.TLC_MODAL.open({
      title: isEdit ? 'EDIT MARKER' : 'ADD MARKER',
      body: `
        <div class="field">
          <label>NOTIZ (optional)</label>
          <input id="um-note" type="text" placeholder="Description..." value="${isEdit ? (existing.note||'') : ''}">
        </div>
        <div class="field">
          <label>FARBE</label>
          ${this._swatchRow(isEdit ? existing.color : '#00d4aa')}
        </div>
        <div style="font-size:10px;color:#4a7a8a;">Position: X ${gx} / Y ${gy}</div>
      `,
      footer: `
        ${isEdit ? '<button class="btn-danger" id="btn-del">Delete</button>' : ''}
        <button class="btn-ghost"   id="btn-cancel">Cancel</button>
        <button class="btn-primary" id="btn-save">${isEdit ? 'Save' : 'Set'}</button>
      `,
      onOpen: (sr) => {
        this._bindSwatches(sr);

        sr.getElementById('btn-save').addEventListener('click', () => {
          const note  = sr.getElementById('um-note').value.trim();
          const color = this._getSelectedColor(sr);
          const markers = window.TLC_STATE.get('userMarkers') || [];
          if (isEdit) {
            existing.note  = note;
            existing.color = color;
          } else {
            markers.push({ gx, gy, note, color });
            window.TLC_STATE.set('userMarkers', markers);
          }
          window.TLC_STORAGE.save();
          window.TLC_MODAL.close();
          tlcNotify(isEdit ? '✓ Mark Saved' : '📍 Marker Set');
        });

        sr.getElementById('btn-cancel').addEventListener('click', () => window.TLC_MODAL.close());

        if (isEdit) {
          sr.getElementById('btn-del').addEventListener('click', () => {
            const markers = window.TLC_STATE.get('userMarkers') || [];
            const idx = markers.indexOf(existing);
            if (idx >= 0) markers.splice(idx, 1);
            window.TLC_STATE.set('userMarkers', markers);
            window.TLC_STORAGE.save();
            window.TLC_MODAL.close();
            tlcNotify('Marker Removed.');
          });
        }
      },
    });
  }

  _editUserMarkerModal(idx) {
    const markers = window.TLC_STATE.get('userMarkers') || [];
    const m = markers[idx];
    if (!m) return;
    this._openUserMarkerModal(m.gx, m.gy, m);
  }
}

customElements.define('tlc-map', TlcMap);
