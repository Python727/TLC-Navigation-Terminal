const { app, BrowserWindow, clipboard, ipcMain, Menu, nativeTheme, dialog, Tray } = require('electron');
const { appMenu, setMainWindow } = require("./applicationmenu");  // setMainUpdater existiert nicht → entfernt
const path = require('path');
const os   = require('os');
const fs   = require('fs');
const ElectronStore = require("electron-store");
const store = new ElectronStore();

const { genaralcommand, setMainWindowGC } = require("./commands/genaralcommand");

// ── Squirrel (Windows Installer) ─────────────────────────────────────
if (require('electron-squirrel-startup')) {
  genaralcommand["Stop-All"]();
  app.quit();
}

let tray   = null;
let win    = null;
let splash = null;

// ══════════════════════════════════════════════════════════════════════
// SPLASH + MAIN WINDOW
// ══════════════════════════════════════════════════════════════════════
function showSplashAndMainWindow() {
  splash = new BrowserWindow({
    width: 600,
    height: 550,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    icon: path.resolve(__dirname, '../../data/Images/tlcmap.ico'),
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const iconPath = path.resolve(__dirname, '../../data/Images/tlcmap.png');
  let splashIconBase64 = '';
  try {
    splashIconBase64 = fs.readFileSync(iconPath).toString('base64');
  } catch (e) {
    console.error('Splash PNG nicht gefunden:', iconPath);
  }

  const welcomeMessage_t = "Welcome to TLC Navigation Terminal";
  const startingMessage_t = "Starting Navigation";

  const splashHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Navigation Terminal Loading .....</title>
      <style>
        html, body { background: #181818; color: #fff; margin: 0; padding: 0; height: 100vh; width: 100vw; overflow: hidden; }
        #splashimg {
          position: absolute; top: 0; left: 0;
          width: 100vw; height: 100vh;
          object-fit: contain; z-index: 1;
          opacity: 1; transition: opacity 1s;
        }
        .text    { position: absolute; bottom: 32px; left: 0; right: 0; text-align: center; font-size: 2em; opacity: 1; transition: opacity 0.8s; z-index: 2; }
        .welcome { position: absolute; bottom: 32px; left: 0; right: 0; text-align: center; font-size: 2em; opacity: 0; transition: opacity 0.8s; z-index: 2; }
        body { position: relative; }
      </style>
    </head>
    <body>
      <img id="splashimg" src="data:image/png;base64,${splashIconBase64}" alt="App Icon">
      <div class="text"    id="text"></div>
      <div class="welcome" id="welcome"></div>
      <script>
        let count = 3;
        const welcome        = document.getElementById('welcome');
        const text           = document.getElementById('text');
        const welcomeMessage = ${JSON.stringify(welcomeMessage_t)};
        const startingMessage = ${JSON.stringify(startingMessage_t)};
        const interval = setInterval(() => {
          count--;
          if      (count === 2)  { text.textContent = "Loading Resources"; }
          else if (count === 1)  { text.textContent = "Initializing Modules"; }
          else if (count === 0)  { text.textContent = startingMessage + " ..."; }
          else if (count === -1) {
            text.textContent = "";
            text.style.opacity = 0;
            welcome.textContent = welcomeMessage + " !";
            welcome.style.opacity = 1;
          }
          else if (count === -3) { clearInterval(interval); }
        }, 900);
      </script>
    </body>
    </html>
  `;

  splash.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(splashHTML));
  splash.center();

  setTimeout(() => {
    let opacity = 1.0;
    const fade = setInterval(() => {
      opacity -= 0.05;
      if (opacity <= 0) {
        clearInterval(fade);
        if (splash) { splash.close(); splash = null; }
        createWindow(true);
      } else {
        if (splash) splash.setOpacity(opacity);
      }
    }, 80);
  }, 4000);
}

// ══════════════════════════════════════════════════════════════════════
// IPC HANDLERS
// ══════════════════════════════════════════════════════════════════════
ipcMain.handle("GENERAL_COMMANDS", async (_event, data) => {
  try {
    const idata   = (typeof data === 'string') ? JSON.parse(data) : data;
    const handler = genaralcommand[idata.command];
    if (typeof handler !== 'function') {
      console.error('GENERAL_COMMANDS: unknown command:', idata && idata.command);
      return { success: false, error: 'Unknown command' };
    }
    const res = await handler(idata.data);
    JSON.stringify(res);
    return res;
  } catch (err) {
    console.error('Error in GENERAL_COMMANDS:', err, '| rawData:', data);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('dialog:info', async (_event, message) => {
  await dialog.showMessageBox({ type: 'none', buttons: ['OK'], message, title: 'Info' });
});

ipcMain.handle('dialog:confirm', async (_event, message) => {
  const result = await dialog.showMessageBox({
    type: 'none', buttons: ['Yes', 'No'],
    defaultId: 0, cancelId: 1,
    message, title: 'Please Confirm',
  });
  return result.response === 0;
});

// ══════════════════════════════════════════════════════════════════════
// CREATE WINDOW
// ══════════════════════════════════════════════════════════════════════
const createWindow = async (fromSplash = false) => {
  const bounds = store.get("windowBounds-MainWindow") || {};

  win = new BrowserWindow({
    x:         bounds.x      ?? 0,
    y:         bounds.y      ?? 0,
    width:     bounds.width  ?? 1920,
    height:    bounds.height ?? 1080,
    minWidth:  1200,
    minHeight: 700,
    icon:  path.join(__dirname, '../../data/Images/tlcmap.ico'),
    show:  fromSplash ? false : true,
    webPreferences: {
      nodeIntegration:       true,
      preload:               path.join(__dirname, 'preload.js'),
      webSecurity:           false,
      backgroundThrottling:  false,
    },
  });

  let saveTimeout;
  const saveBounds = () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => store.set("windowBounds-MainWindow", win.getBounds()), 1000);
  };
  win.on("resize", saveBounds);
  win.on("move",   saveBounds);


  win.on('close', async (e) => {
    store.set("windowBounds-MainWindow", win.getBounds());
    e.preventDefault();
    realy_close("Min");
  });

  win.loadFile('src/server/serverhtml/index.html');

  if (fromSplash) {
    win.show();
    win.focus();
  }

  nativeTheme.themeSource = 'dark';

  setMainWindow(win);
  setMainWindowGC(win);

  Menu.setApplicationMenu(appMenu);

  win.setTitle('TLC Navigation Terminal');

  // ── Tray ────────────────────────────────────────────────────────────
  try {
    tray = new Tray(path.join(__dirname, '../../data/Images/tlcmap.ico'));
    tray.setToolTip('TLC-Navigation-Terminal');
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Open', click: () => win.show() },
      { label: 'Quit', click: () => realy_close("Quit") },
    ]));
    tray.on('click', () => win.isVisible() ? win.hide() : win.show());
  } catch (e) {
    console.warn('Tray konnte nicht erstellt werden:', e.message);
  }
};

// ══════════════════════════════════════════════════════════════════════
// CLOSE HANDLER
// ══════════════════════════════════════════════════════════════════════
async function realy_close(yip_) {

  if (yip_ === "Quit") {
    const result = await dialog.showMessageBox({
      type: 'none', buttons: ["Yes", "No"],
      defaultId: 0, cancelId: 1,
      message: "Are you sure you want to quit?",
      title: "Confirm Quit",
    });
    if (result.response === 0) {
      genaralcommand["Stop-All"]();
      win.destroy();
      app.quit();           
    }
  }

  if (yip_ === "Min") {
    const result = await dialog.showMessageBox({
      type: 'none', buttons: ["Minimize to Tray", "Quit", "Cancel"],
      defaultId: 0, cancelId: 2,
      message: "What would you like to do?",
      title: "Close TLC Navigation Terminal",
    });
    if (result.response === 0) {
      win.hide();           
    } else if (result.response === 1) {
      genaralcommand["Stop-All"]();
      win.destroy();
      app.quit();
    }
    
  }
}

// ══════════════════════════════════════════════════════════════════════
// APP EVENTS
// ══════════════════════════════════════════════════════════════════════
app.on("ready", () => {
  showSplashAndMainWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) showSplashAndMainWindow();
});

app.on('before-quit', () => {
  genaralcommand["Stop-All"]();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
