const { ipcMain, app, Notification, BrowserWindow, clipboard, dialog } = require('electron');
const path = require('path');
const {
  writeFileSync, existsSync, readFileSync,
  copyFileSync, mkdirSync, lstatSync, unlinkSync, readdirSync
} = require('fs');
const { exec } = require('child_process');

const genaralcommand = {};
let _mainWindow = null;

// ── TLC-Map Save-Slot Verzeichnis ─────────────────────────────────────
const TLC_SAVE_DIR = path.join(app.getPath('documents'), 'tlc-navigation-terminal');
if (!existsSync(TLC_SAVE_DIR)) mkdirSync(TLC_SAVE_DIR, { recursive: true });

function _slotPath(slot) {
  return path.join(TLC_SAVE_DIR, `save_${slot}.json`);
}

// ── Stop All ──────────────────────────────────────────────────────────
genaralcommand["Stop-All"] = async function () {};

// ── Push Message ──────────────────────────────────────────────────────
genaralcommand["push-message"] = async function (data) {
  new Notification({
    silent: data.silent,
    title:  data.title,
    body:   `${data.body}`,
    icon:   `./src/data/Images/tlcmap.png`,
  }).show();
};

// ── TLC-Map: State laden (Slot) ───────────────────────────────────────
genaralcommand["tlcmap:load-state"] = async function (data) {
  try {
    const slot = (data && data.slot != null) ? data.slot : 0;
    const p = _slotPath(slot);
    if (!existsSync(p)) return { success: true, data: null };
    const raw = readFileSync(p, 'utf-8');
    return { success: true, data: raw };
  } catch (e) {
    console.error('[tlcmap:load-state]', e);
    return { success: false, error: e.message };
  }
};

// ── TLC-Map: State speichern (Slot) ───────────────────────────────────
genaralcommand["tlcmap:save-state"] = async function (data) {
  try {
    const slot     = (data && data.slot != null) ? data.slot : 0;
    const payload  = data && data.payload !== undefined ? data.payload : data;
    const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
    writeFileSync(_slotPath(slot), serialized, 'utf-8');
    return { success: true };
  } catch (e) {
    console.error('[tlcmap:save-state]', e);
    return { success: false, error: e.message };
  }
};

// ── TLC-Map: Alle Slot-Infos laden (für Auswahlscreen) ────────────────
genaralcommand["tlcmap:list-slots"] = async function () {
  try {
    const slots = [];
    for (let i = 0; i < 8; i++) {
      const p = _slotPath(i);
      if (existsSync(p)) {
        try {
          const raw  = readFileSync(p, 'utf-8');
          const data = JSON.parse(raw);
          const stat = lstatSync(p);
          slots.push({
            slot:      i,
            exists:    true,
            name:      data._slotName || `Savegame ${i + 1}`,
            savedAt:   stat.mtimeMs,
            zone:      data.activeZone || null,
            waypoints: (data.waypoints || []).length,
            markers:   (data.userMarkers || []).length,
          });
        } catch {
          slots.push({ slot: i, exists: true, name: `Savegame ${i + 1}`, savedAt: 0 });
        }
      } else {
        slots.push({ slot: i, exists: false, name: `Savegame ${i + 1}` });
      }
    }
    return { success: true, slots };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

// ── TLC-Map: Slot löschen ─────────────────────────────────────────────
genaralcommand["tlcmap:delete-slot"] = async function (data) {
  try {
    const slot = data && data.slot != null ? data.slot : 0;
    const p    = _slotPath(slot);
    if (existsSync(p)) unlinkSync(p);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

// ── TLC-Map: Slot umbenennen ───────────────────────────────────────────
genaralcommand["tlcmap:rename-slot"] = async function (data) {
  try {
    const slot = data.slot;
    const p    = _slotPath(slot);
    if (!existsSync(p)) return { success: false, error: 'Slot not found' };
    const raw     = readFileSync(p, 'utf-8');
    const parsed  = JSON.parse(raw);
    parsed._slotName = data.name;
    writeFileSync(p, JSON.stringify(parsed), 'utf-8');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

module.exports = {
  genaralcommand,
  setMainWindowGC: (mainWindow) => { _mainWindow = mainWindow; },
};
