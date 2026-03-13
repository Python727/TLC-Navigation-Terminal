'use strict';
/**
 * TlcControls.js  — src/data/JS/components/TlcControls.js
 * ─────────────────────────────────────────────────────────────────────
 * Custom Element: <tlc-controls>
 * Zoom-In / Zoom-Out / Reset Buttons.
 * Kommuniziert via CustomEvents mit TlcMap.
 * ─────────────────────────────────────────────────────────────────────
 */

class TlcControls extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();

    this.shadowRoot.getElementById('btn-in')
      .addEventListener('click', () => window.dispatchEvent(new CustomEvent('tlc:zoom', { detail: { factor: 1.25 } })));

    this.shadowRoot.getElementById('btn-out')
      .addEventListener('click', () => window.dispatchEvent(new CustomEvent('tlc:zoom', { detail: { factor: 0.8  } })));

    this.shadowRoot.getElementById('btn-reset')
      .addEventListener('click', () => window.dispatchEvent(new CustomEvent('tlc:reset-view')));

    this.shadowRoot.getElementById('btn-settings')
      .addEventListener('click', () => window.dispatchEvent(new CustomEvent('tlc:toggle-settings')));
    this.shadowRoot.getElementById('btn-humancalc')
      .addEventListener('click', () => window.dispatchEvent(new CustomEvent('tlc:toggle-humancalc')));
    this.shadowRoot.getElementById('btn-saveslots')
      .addEventListener('click', () => {
        // Save current state then show slot screen
        TLC_STATE.save().then(() => {
          const el = document.createElement('tlc-save-slots');
          document.body.appendChild(el);
          // Hide map while slot screen is open
          const map = document.querySelector('tlc-map');
          if (map) map.style.display = 'none';
        });
      });
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: absolute;
          right: 14px;
          top: calc(var(--tlc-header-h, 42px) + 10px);
          z-index: var(--z-controls, 70);
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
        }

        button {
          width: 36px;
          height: 36px;
          background: rgba(13, 31, 40, 0.96);
          border: 1px solid var(--tlc-border, #1a4a5a);
          color: var(--tlc-text, #b8e4f0);
          border-radius: 4px;
          cursor: pointer;
          font-size: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 120ms, color 120ms;
        }
        button:hover {
          border-color: var(--tlc-accent, #00d4aa);
          color: var(--tlc-accent, #00d4aa);
        }
      </style>

      <button id="btn-in"    title="Zoom +">+</button>
      <button id="btn-out"   title="Zoom −">−</button>
      <button id="btn-reset" title="Reset view" style="font-size:14px;">⌂</button>
      <button id="btn-settings" title="Settings" style="font-size:15px;">⚙</button>
      <button id="btn-humancalc" title="Human Growth Calculator" style="font-size:15px;">🧬</button>
      <button id="btn-saveslots" title="Save / Load Game" style="font-size:15px;">💾</button>
    `;
  }
}

customElements.define('tlc-controls', TlcControls);
