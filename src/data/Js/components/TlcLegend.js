'use strict';
/**
 * TlcLegend.js  — src/data/JS/components/TlcLegend.js
 * ─────────────────────────────────────────────────────────────────────
 * Custom Element: <tlc-legend>
 * Zeigt Farb-Legende und Tastenbelegung.
 * ─────────────────────────────────────────────────────────────────────
 */

class TlcLegend extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const types = window.TLC_LOCATION_TYPES || {};

    const rows = Object.values(types).map(t => `
      <div class="row">
        <div class="dot" style="background:${t.color}"></div>
        <span>${t.label}</span>
      </div>
    `).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: absolute;
          right: 14px;
          bottom: 14px;
          z-index: var(--z-legend, 70);
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
        }

        .panel {
          background: rgba(13, 31, 40, 0.96);
          border: 1px solid var(--tlc-border, #1a4a5a);
          border-radius: 6px;
          padding: 10px 14px;
          min-width: 160px;
        }

        h3 {
          font-family: var(--tlc-font-hud, 'Orbitron', sans-serif);
          font-size: 10px;
          letter-spacing: 2px;
          color: var(--tlc-accent, #00d4aa);
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--tlc-text, #b8e4f0);
          margin: 3px 0;
        }

        .dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .keys {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--tlc-border, #1a4a5a);
        }

        .key-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--tlc-text-dim, #4a7a8a);
          margin: 3px 0;
        }

        kbd {
          background: rgba(0,212,170,0.12);
          border: 1px solid var(--tlc-border, #1a4a5a);
          border-radius: 3px;
          padding: 1px 5px;
          color: var(--tlc-accent, #00d4aa);
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
          font-size: 12px;
          white-space: nowrap;
        }
      </style>

      <div class="panel">
        <h3>Legend</h3>

        
        <div class="keys">
          ${rows}
          <div class="key-row"><kbd>Colors</kbd>Can be Changed for each Position</div>
        </div>
        
        <div class="keys">
          <div class="key-row"><kbd>LMB</kbd> Navigate station & Drag</div>
          <div class="key-row"><kbd>MMB</kbd> Set Mark</div>
          <div class="key-row"><kbd>E</kbd>&nbsp;&nbsp;&nbsp; Waypoint ±</div>
          <div class="key-row"><kbd>RMB</kbd> Node-Info / Options</div>
          <div class="key-row"><kbd>Scroll</kbd> Zoom </div>
        </div>
      </div>
    `;
  }
}

customElements.define('tlc-legend', TlcLegend);
