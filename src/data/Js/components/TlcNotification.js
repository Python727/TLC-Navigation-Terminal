'use strict';
/**
 * TlcNotification.js  — src/data/JS/components/TlcNotification.js
 * ─────────────────────────────────────────────────────────────────────
 * Custom Element: <tlc-notification>
 * Displays toast notifications triggered by the window event 'tlc:notify'.
 * ─────────────────────────────────────────────────────────────────────
 */

class TlcNotification extends HTMLElement {

  constructor() {
    super();
    this._timer = null;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();
    this._boundHandler = (e) => this._show(e.detail.message, e.detail.type);
    window.addEventListener('tlc:notify', this._boundHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('tlc:notify', this._boundHandler);
  }

  /* ── Render ──────────────────────────────────────────── */
  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 64px;
          right: 14px;
          z-index: 400;
          pointer-events: none;
          font-family: var(--tlc-font-mono, 'Share Tech Mono', monospace);
        }

        .toast {
          background: rgba(13, 31, 40, 0.97);
          border: 1px solid var(--tlc-accent, #00d4aa);
          border-radius: 6px;
          padding: 8px 14px;
          font-size: 11px;
          color: var(--tlc-accent, #00d4aa);
          min-width: 180px;
          max-width: 320px;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 240ms ease, transform 240ms ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toast.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .toast.warn   { border-color: var(--tlc-warn, #ff6b35);   color: var(--tlc-warn,   #ff6b35); }
        .toast.danger { border-color: var(--tlc-danger, #ff4060); color: var(--tlc-danger, #ff4060); }

        .icon { font-size: 13px; flex-shrink: 0; }
        .msg  { flex: 1; word-break: break-word; }
      </style>

      <div class="toast" id="toast">
        <span class="icon" id="icon">ℹ</span>
        <span class="msg"  id="msg"></span>
      </div>
    `;
  }

  _show(message, type = 'info') {
    const toast = this.shadowRoot.getElementById('toast');
    const icon  = this.shadowRoot.getElementById('icon');
    const msg   = this.shadowRoot.getElementById('msg');

    const icons = { info: 'ℹ', warn: '⚠', danger: '✕' };

    toast.className = `toast ${type}`;
    icon.textContent = icons[type] || 'ℹ';
    msg.textContent  = message;

    /* Reflow-Trick for Animation-Restart */
    toast.classList.remove('visible');
    void toast.offsetWidth;
    toast.classList.add('visible');

    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }
}

customElements.define('tlc-notification', TlcNotification);
