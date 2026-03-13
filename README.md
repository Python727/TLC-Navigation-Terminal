# TLC — Navigation Terminal

An interactive map and planning tool for **The Last Caretaker**, built with Electron.

![App](https://i.postimg.cc/DfRy75NF/tlcmap.png)

---
![Navigation Terminal](https://i.postimg.cc/mrR36665/Screenshot-3.png)
![Navigation Terminal](https://i.postimg.cc/nctbdW5G/Screenshot-3.png)

---

![Navigation Terminal](https://i.postimg.cc/G3gTGkSj/Screenshot-4.png)

---

![Navigation Terminal](https://i.postimg.cc/j5dCJ5HG/Screenshot-5.png)
![Navigation Terminal](https://i.postimg.cc/QNzVHjFM/Screenshot-6.png)
![Navigation Terminal](https://i.postimg.cc/GmFp7YzW/Screenshot-7.png)
![Navigation Terminal](https://i.postimg.cc/fLLTRPZT/Screenshot-8.png)
![Navigation Terminal](https://i.postimg.cc/BnBK8dWK/Screenshot-9.png)

---
 --
 
## Features
 
- **Interactive Map** — Navigate stations and locations across zones with drag & zoom
- **Location Info** — View details, resources, enemies and notes for each station
- **Waypoints & Markers** — Set custom waypoints and color-coded markers
- **Fog of Unknown** — Toggle visibility of unexplored areas
- **Human Growth Calculator** — Plan which memories and food items to use for growing humans, with inventory tracking and auto-allocation
- **Persistent State** — All progress, notes and inventory saved automatically
 
---
 
## Download & Install
 
### Option A — Prebuilt .exe (recommended)
 
No Node.js required. Just download and run:
 
👉 **[Latest release](https://github.com/Python727/TLC-Navigation-Terminal/releases/latest)**
 
1. Download the `.exe` installer
2. Run and install
3. Launch the app — done
 
---
 
### Option B — Run from source
 
Requires [Node.js](https://nodejs.org/) v18 or newer.
 
```bash
# 1. Clone the repository
git clone https://github.com/Python727/TLC-Navigation-Terminal.git
cd tlc-map
 
# 2. Install dependencies
npm install
 
# 3. Start the app
npm start
```
 
---
 
## Controls
 
| Input | Action |
|-------|--------|
| Left Mouse + Drag | Navigate / Move map |
| Middle Mouse | Set mark |
| Right Mouse | Node info & options |
| Scroll | Zoom in / out |
| `E` | Place waypoint |
 
---
 
## Project Structure
 
```
src/
├── index.js                  # Electron main process
├── preload.js                # IPC bridge
├── applicationmenu.js        # App menu
├── commands/
│   └── genaralcommand.js     # IPC command handlers
├── server/
│   ├── serverhtml/index.html # Main UI
│   └── serverjs/             # Server connection
└── data/
    ├── CSS/                  # Stylesheets
    ├── Images/               # UI assets
    └── JS/
        ├── data/
        │   ├── locations.js  # All map locations & enemy data
        │   └── state.js      # State management & persistence
        ├── utils/
        │   ├── coords.js     # Coordinate system
        │   ├── storage.js    # File I/O helpers
        │   └── notify.js     # Notification utilities
        └── components/
            ├── TlcMap.js           # Main map component
            ├── TlcSidebar.js       # Location sidebar
            ├── TlcControls.js      # Map control buttons
            ├── TlcLegend.js        # Map legend
            ├── TlcModal.js         # Info modals
            ├── TlcContextMenu.js   # Right-click menus
            ├── TlcNotification.js  # Toast notifications
            └── TlcHumanCalc.js     # Human Growth Calculator
```
 
---
 
## Human Growth Calculator
 
Open the calculator via the **🧬** button in the toolbar.
 
- **Inventory Tab** — Track how many of each memory and food item you own
- **Available Humans Tab** — Browse all growable human types filtered by tier
- Green glow = growable with your current inventory
- Right-click a human card to mark as **Owned** or **To Grow**
- Click a card to open the detail view with auto-allocation of required items
 
---
 
## State & Save Data
 
The app saves automatically to Electron's `userData` directory:
 
| OS | Path |
|----|------|
| Windows | `%APPDATA%\tlc-map\tlcmap-state.json` |
| macOS | `~/Library/Application Support/tlc-map/tlcmap-state.json` |
| Linux | `~/.config/tlc-map/tlcmap-state.json` |


Or you can go to Settings and export your data :)
 
---
 
## Dependencies
 
| Package | Purpose |
|---------|---------|
| `electron` | Desktop app framework |
| `electron-store` | Persistent state storage |
| `electron-squirrel-startup` | Windows installer support |
 
---
 
## License
 
This project is a fan-made tool for *The Last Caretaker*. Not affiliated with the game developers.
