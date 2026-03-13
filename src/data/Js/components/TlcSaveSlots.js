'use strict';
/**
 * TlcSaveSlots.js
 * ─────────────────────────────────────────────────────────────────────
 * Fullscreen Save-Slot Auswahl beim App-Start.
 * 8 Slots wie im Spiel, mit Speichern/Löschen/Umbenennen.
 * Löst 'tlc:slot-selected' aus wenn ein Slot gewählt wird.
 */

class TlcSaveSlots extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this._slots = [];
    this._render();
    this._loadSlots();
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed; inset: 0; z-index: 9999;
          background: #060d10;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          font-family: 'Share Tech Mono', monospace;
        }
        .title {
          font-family: 'Orbitron', sans-serif;
          font-size: 13px; letter-spacing: 4px;
          color: #00d4aa; text-transform: uppercase;
          margin-bottom: 6px; opacity: 0.6;
        }
        .headline {
          font-family: 'Orbitron', sans-serif;
          font-size: 28px; font-weight: 900;
          color: #b8e4f0; letter-spacing: 6px;
          margin-bottom: 40px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(4, 260px);
          grid-template-rows: repeat(2, auto);
          gap: 16px;
        }
        .slot {
          background: #0d1f28;
          border: 1px solid #1a3a4a;
          border-radius: 6px;
          padding: 20px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          position: relative;
          min-height: 120px;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .slot:hover { border-color: #00d4aa; background: #102030; }
        .slot.empty { opacity: 0.5; }
        .slot.empty:hover { opacity: 1; }
        .slot-num {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px; color: #4a7a8a;
          letter-spacing: 2px; margin-bottom: 8px;
        }
        .slot-name {
          font-size: 15px; color: #b8e4f0;
          font-weight: bold; margin-bottom: 10px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .slot-name input {
          background: none; border: none; border-bottom: 1px solid #00d4aa;
          color: #b8e4f0; font-family: 'Share Tech Mono', monospace;
          font-size: 15px; width: 100%; outline: none;
        }
        .slot-meta {
          font-size: 11px; color: #4a7a8a; line-height: 1.6;
        }
        .slot-meta span { color: #00d4aa; }
        .slot-actions {
          display: flex; gap: 6px; margin-top: 12px;
        }
        .btn {
          background: none; border: 1px solid #1a3a4a;
          color: #4a7a8a; font-family: 'Share Tech Mono', monospace;
          font-size: 10px; padding: 3px 8px; border-radius: 3px;
          cursor: pointer; letter-spacing: 1px; transition: all 0.1s;
        }
        .btn:hover { border-color: #00d4aa; color: #00d4aa; }
        .btn.danger:hover { border-color: #ff4060; color: #ff4060; }
        .btn.primary {
          border-color: #00d4aa44; color: #00d4aa;
          flex: 1;
        }
        .btn.primary:hover { background: #00d4aa22; }
        .empty-label {
          font-size: 12px; color: #2a5a6a;
          text-align: center; padding: 10px 0;
        }
        .new-badge {
          position: absolute; top: 10px; right: 10px;
          font-size: 9px; color: #00d4aa; letter-spacing: 1px;
          border: 1px solid #00d4aa44; padding: 2px 6px; border-radius: 2px;
        }
        .loading { color: #4a7a8a; font-size: 13px; }
        .save-path {
          margin-top: 32px;
          font-size: 10px; color: #2a5a6a; letter-spacing: 1px;
        }
        .save-path span { color: #4a7a8a; }
      </style>

      <div class="title">THE LAST CARETAKER</div>
      <div class="headline">NAVIGATION TERMINAL</div>

      <div class="grid" id="grid">
        <div class="loading">Loading save data...</div>
      </div>

      <div class="save-path">
        Saves: <span>Documents / tlc-navigation-terminal</span>
      </div>
    `;
  }

  async _loadSlots() {
    const res = await window.TLC_SERVER.listSlots();
    this._slots = (res && res.slots) ? res.slots : [];
    this._renderGrid();
  }

  _renderGrid() {
    const grid = this.shadowRoot.getElementById('grid');
    grid.innerHTML = '';

    this._slots.forEach(s => {
      const card = document.createElement('div');
      card.className = 'slot' + (s.exists ? '' : ' empty');
      card.dataset.slot = s.slot;

      if (s.exists) {
        const date = s.savedAt ? new Date(s.savedAt).toLocaleString() : '—';
        card.innerHTML = `
          <div>
            <div class="slot-num">SLOT ${s.slot + 1}</div>
            <div class="slot-name" id="name-${s.slot}">${this._esc(s.name)}</div>
            <div class="slot-meta">
              ${s.zone ? `Zone: <span>${this._esc(String(s.zone))}</span><br>` : ''}
              Waypoints: <span>${s.waypoints || 0}</span> &nbsp;·&nbsp;
              Markers: <span>${s.markers || 0}</span><br>
              Saved: <span>${date}</span>
            </div>
          </div>
          <div class="slot-actions">
            <button class="btn primary" data-action="load" data-slot="${s.slot}">▶ LOAD</button>
            <button class="btn" data-action="rename" data-slot="${s.slot}">✎</button>
            <button class="btn danger" data-action="delete" data-slot="${s.slot}">✕</button>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="new-badge">EMPTY</div>
          <div>
            <div class="slot-num">SLOT ${s.slot + 1}</div>
            <div class="empty-label">— New Game —</div>
          </div>
          <div class="slot-actions">
            <button class="btn primary" data-action="load" data-slot="${s.slot}">▶ START</button>
          </div>
        `;
      }

      grid.appendChild(card);
    });

    // Event delegation
    grid.addEventListener('click', e => this._handleClick(e));
  }

  async _handleClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const slot   = parseInt(btn.dataset.slot);

    if (action === 'load') {
      await this._selectSlot(slot);
    } else if (action === 'delete') {
      if (confirm(`Delete Slot ${slot + 1}? This cannot be undone.`)) {
        await window.TLC_SERVER.deleteSlot({ slot });
        await this._loadSlots();
      }
    } else if (action === 'rename') {
      const card     = btn.closest('.slot');
      const nameDiv  = card.querySelector('.slot-name');
      const current  = this._slots[slot]?.name || `Savegame ${slot + 1}`;
      nameDiv.innerHTML = `<input type="text" value="${this._esc(current)}" maxlength="32" />`;
      const input = nameDiv.querySelector('input');
      input.focus();
      input.select();
      const finish = async () => {
        const newName = input.value.trim() || current;
        await window.TLC_SERVER.renameSlot({ slot, name: newName });
        await this._loadSlots();
      };
      input.addEventListener('blur', finish);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
    }
  }

  async _selectSlot(slot) {
    await TLC_STATE.load(slot);
    window.dispatchEvent(new CustomEvent('tlc:slot-selected', { detail: { slot } }));
    this.remove();
  }

  _esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}

customElements.define('tlc-save-slots', TlcSaveSlots);
