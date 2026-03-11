'use strict';
/**
 * TlcModal.js  — src/data/JS/components/TlcModal.js
 * ─────────────────────────────────────────────────────────────────────
 * Custom Element: <tlc-modal>
 *
 * Open:
 *   document.querySelector('tlc-modal').open({
 *     title:  'Titel',
 *     body:   '<div>...HTML...</div>',
 *     footer: '<button class="tlc-btn tlc-btn-primary" id="save-btn">Save</button>',
 *     onOpen: (modalEl) => { /* Event-Listener set *\/ },
 *   });
 *
 * Close:
 *   document.querySelector('tlc-modal').close();
 * ─────────────────────────────────────────────────────────────────────
 */

class TlcModal extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();
    const overlay = this.shadowRoot.getElementById('overlay');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { this.close(); return; }
      // All other keys stop when the modal is open — prevents map shortcuts
      if (this._isOpen) e.stopPropagation();
    });
  }

  /* ── Public API ──────────────────────────────────────── */

  /**
   * @param {{ title, body, footer, onOpen }} config
   */
  open(config = {}) {
    this._isOpen = true;
    const overlay = this.shadowRoot.getElementById('overlay');
    const title   = this.shadowRoot.getElementById('modal-title');
    const body    = this.shadowRoot.getElementById('modal-body');
    const footer  = this.shadowRoot.getElementById('modal-footer');

    title.textContent = config.title  || '';
    body.innerHTML    = config.body   || '';
    footer.innerHTML  = config.footer || '';

    overlay.classList.add('open');

    if (typeof config.onOpen === 'function') {
      /* Slight delay so that innerHTML is processed */
      requestAnimationFrame(() => config.onOpen(this.shadowRoot));
    }
  }

  close() {
    this._isOpen = false;
    const overlay = this.shadowRoot.getElementById('overlay');
    overlay.classList.remove('open');
    /* Custom event for external listeners */
    this.dispatchEvent(new CustomEvent('tlc:modalclose', { bubbles: true }));
  }

  /* ── Render ──────────────────────────────────────────── */
  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace); }

        #overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.72);
          z-index: 300;
          display: none;
          align-items: center;
          justify-content: center;
        }
        #overlay.open { display: flex; }

        /* ── Modal Box ── */
        .modal {
          background: var(--tlc-panel, #0d1f28);
          border: 1px solid var(--tlc-border, #1a4a5a);
          border-radius: 8px;
          width: 860px;
          max-width: calc(100vw - 32px);
          max-height: calc(100vh - 40px);
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 48px rgba(0,0,0,0.85);
          overflow: hidden;
        }

        /* ── Header ── */
        .modal-header {
          padding: 14px 20px;
          border-bottom: 1px solid var(--tlc-border, #1a4a5a);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        #modal-title {
          font-family: var(--tlc-font-hud, 'Orbitron', sans-serif);
          font-size: 11px;
          letter-spacing: 2px;
          color: var(--tlc-accent, #00d4aa);
        }
        .close-btn {
          background: none;
          border: none;
          color: var(--tlc-text-dim, #4a7a8a);
          font-size: 18px;
          cursor: pointer;
          line-height: 1;
          padding: 0 2px;
          transition: color 120ms;
        }
        .close-btn:hover { color: var(--tlc-danger, #ff4060); }

        /* ── Body ── */
        #modal-body {
          padding: 16px 20px;
          overflow-y: auto;
          flex: 1;
          color: var(--tlc-text, #b8e4f0);
          font-size: 11px;
        }
        #modal-body::-webkit-scrollbar       { width: 4px; }
        #modal-body::-webkit-scrollbar-track { background: var(--tlc-bg, #060d10); }
        #modal-body::-webkit-scrollbar-thumb { background: var(--tlc-border, #1a4a5a); }

        /* ── Form elements in the body ── */
        #modal-body label {
          display: block;
          font-size: 9px;
          letter-spacing: 1px;
          color: var(--tlc-text-dim, #4a7a8a);
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        #modal-body .field { margin-bottom: 14px; }

        #modal-body input,
        #modal-body textarea,
        #modal-body select {
          width: 100%;
          background: rgba(0,0,0,0.45);
          border: 1px solid var(--tlc-border, #1a4a5a);
          border-radius: 4px;
          color: var(--tlc-text, #b8e4f0);
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
          font-size: 11px;
          padding: 6px 10px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 120ms;
        }
        #modal-body input:focus,
        #modal-body textarea:focus   { border-color: var(--tlc-accent, #00d4aa); }
        #modal-body textarea         { resize: vertical; min-height: 64px; }
        #modal-body input::placeholder,
        #modal-body textarea::placeholder { color: var(--tlc-text-dim, #4a7a8a); }

        /* Color row within modal */
        .color-row {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          align-items: center;
          margin-top: 4px;
        }
        .swatch {
          width: 22px; height: 22px;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          flex-shrink: 0;
          transition: transform 120ms, border-color 120ms;
        }
        .swatch:hover  { transform: scale(1.15); }
        .swatch.active { border-color: #fff; }

        /* Resource row */
        .res-row {
          display: flex;
          gap: 6px;
          align-items: center;
          margin: 4px 0;
          font-size: 11px;
        }
        .res-icon  { width: 20px; text-align: center; flex-shrink: 0; }
        .res-label { flex: 1; }
        .res-value { color: var(--tlc-text-dim, #4a7a8a); font-size: 10px; min-width: 30px; }
        .res-del {
          background: none; border: none; color: var(--tlc-text-dim, #4a7a8a);
          cursor: pointer; font-size: 12px; padding: 0 3px;
          transition: color 120ms;
        }
        .res-del:hover { color: var(--tlc-danger, #ff4060); }

        /* ── Footer ── */
        #modal-footer {
          padding: 12px 20px;
          border-top: 1px solid var(--tlc-border, #1a4a5a);
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          flex-shrink: 0;
        }

        /* Buttons in the footer (inline styles from outside via innerHTML) */
        #modal-footer button {
          padding: 6px 16px;
          border-radius: 4px;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
          font-size: 11px;
          cursor: pointer;
          border: 1px solid;
          transition: filter 120ms, background 120ms;
        }
        #modal-footer .btn-primary {
          background: var(--tlc-accent, #00d4aa);
          border-color: var(--tlc-accent, #00d4aa);
          color: var(--tlc-bg, #060d10);
          font-weight: bold;
        }
        #modal-footer .btn-primary:hover { filter: brightness(1.2); }
        #modal-footer .btn-ghost {
          background: transparent;
          border-color: var(--tlc-border, #1a4a5a);
          color: var(--tlc-text, #b8e4f0);
        }
        #modal-footer .btn-ghost:hover { border-color: var(--tlc-accent, #00d4aa); color: var(--tlc-accent, #00d4aa); }
        #modal-footer .btn-danger {
          background: transparent;
          border-color: var(--tlc-danger, #ff4060);
          color: var(--tlc-danger, #ff4060);
        }
        #modal-footer .btn-danger:hover { background: rgba(255,64,96,0.15); }
      </style>

      <div id="overlay">
        <div class="modal">
          <div class="modal-header">
            <span id="modal-title"></span>
            <button class="close-btn" id="close-btn">✕</button>
          </div>
          <div id="modal-body"></div>
          <div id="modal-footer"></div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('close-btn').addEventListener('click', () => this.close());
  }
}

customElements.define('tlc-modal', TlcModal);

/* Globale Referenz */
window.addEventListener('DOMContentLoaded', () => {
  window.TLC_MODAL = document.querySelector('tlc-modal');
});
