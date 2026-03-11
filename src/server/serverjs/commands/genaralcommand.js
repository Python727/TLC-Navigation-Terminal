const { ipcMain, app, Notification, BrowserWindow, clipboard, dialog } = require('electron');
const path = require('path');
const {
  writeFileSync, existsSync, readFileSync,
  copyFileSync, mkdirSync, lstatSync, unlinkSync, readdirSync
} = require('fs');
const { exec } = require('child_process');

global.WebSocket = require('ws');

const genaralcommand = {};
let _mainWindow = null;

// ── TLC-Map State Datei-Pfad ──────────────────────────────────────────
const TLC_STATE_PATH = path.join(app.getPath('userData'), 'tlcmap-state.json');

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

// ── TLC-Map: State laden ──────────────────────────────────────────────
genaralcommand["tlcmap:load-state"] = async function (_data) {
  try {
    if (!existsSync(TLC_STATE_PATH)) return { success: true, data: null };
    const raw = readFileSync(TLC_STATE_PATH, 'utf-8');
    return { success: true, data: raw };
  } catch (e) {
    console.error('[tlcmap:load-state]', e);
    return { success: false, error: e.message };
  }
};

// ── TLC-Map: State speichern ──────────────────────────────────────────
genaralcommand["tlcmap:save-state"] = async function (data) {
  try {
    const serialized = typeof data === 'string' ? data : JSON.stringify(data);
    writeFileSync(TLC_STATE_PATH, serialized, 'utf-8');
    return { success: true };
  } catch (e) {
    console.error('[tlcmap:save-state]', e);
    return { success: false, error: e.message };
  }
};

module.exports = {
  genaralcommand,
  setMainWindowGC: (mainWindow) => { _mainWindow = mainWindow; },
};
