'use strict';
/**
 * TlcContextMenu.js  — src/data/JS/components/TlcContextMenu.js
 * ─────────────────────────────────────────────────────────────────────
 * Custom Element: <tlc-context-menu>
 * Opened programmatically via TlcContextMenu.show(x, y, items).
 *
 * items-Format:
 *   { icon, label, action }   → normal entry
 *   { type: 'sep' }           → dividing line
 *   { type: 'title', text }   → Label (not clickable)
 * ─────────────────────────────────────────────────────────────────────
 */

class TlcContextMenu extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._open = false;
  }

  connectedCallback() {
    this._render();
    /* Clicking outside closes the menu */
    this._outsideClick = (e) => {
      if (this._open) this.hide();
    };
    document.addEventListener('click',       this._outsideClick);
    document.addEventListener('contextmenu', this._outsideClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click',       this._outsideClick);
    document.removeEventListener('contextmenu', this._outsideClick);
  }

  /* ── Public API ──────────────────────────────────────── */

  /**
   * @param {number} x        – clientX
   * @param {number} y        – clientY
   * @param {Array}  items    – Menu entries
   */
  show(x, y, items) {
    const root  = this.shadowRoot;
    const menu  = root.getElementById('menu');

    menu.innerHTML = '';

    items.forEach(item => {
      if (item.type === 'sep') {
        const sep = document.createElement('div');
        sep.className = 'sep';
        menu.appendChild(sep);

      } else if (item.type === 'title') {
        const t = document.createElement('div');
        t.className = 'title';
        t.textContent = item.text;
        menu.appendChild(t);

      } else {
        const el = document.createElement('div');
        el.className = 'item';
        el.innerHTML = `<span class="item-icon">${item.icon || ''}</span><span class="item-label">${item.label}</span>`;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          this.hide();
          if (typeof item.action === 'function') item.action();
        });
        menu.appendChild(el);
      }
    });

    /* Calculate position, mirror at the screen edge */
    menu.style.display = 'block';
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mw = menu.offsetWidth  || 170;
    const mh = menu.offsetHeight || items.length * 34;

    menu.style.left = Math.min(x, vw - mw - 8) + 'px';
    menu.style.top  = Math.min(y, vh - mh - 8) + 'px';

    this._open = true;
  }

  hide() {
    const menu = this.shadowRoot.getElementById('menu');
    if (menu) menu.style.display = 'none';
    this._open = false;
  }

  /* ── Render ──────────────────────────────────────────── */
  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { position: fixed; inset: 0; pointer-events: none; z-index: 200; }

        #menu {
          position: absolute;
          display: none;
          pointer-events: all;
          background: rgba(13, 31, 40, 0.98);
          border: 1px solid var(--tlc-border, #1a4a5a);
          border-radius: 6px;
          min-width: 165px;
          overflow: hidden;
          box-shadow: 0 6px 24px rgba(0,0,0,0.65);
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
        }

        .title {
          padding: 6px 14px;
          font-size: 9px;
          color: var(--tlc-text-dim, #4a7a8a);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .sep {
          height: 1px;
          background: var(--tlc-border, #1a4a5a);
          margin: 2px 0;
        }

        .item {
          padding: 8px 14px;
          font-size: 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--tlc-text, #b8e4f0);
          transition: background 100ms;
        }
        .item:hover {
          background: rgba(0, 212, 170, 0.12);
        }
        .item-icon  { width: 16px; text-align: center; flex-shrink: 0; }
        .item-label { flex: 1; }
      </style>

      <div id="menu"></div>
    `;
  }
}

customElements.define('tlc-context-menu', TlcContextMenu);

/* Global reference for easy access */
window.addEventListener('DOMContentLoaded', () => {
  window.TLC_CTX_MENU = document.querySelector('tlc-context-menu');
});
