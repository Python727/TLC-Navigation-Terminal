// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcMain, ipcRenderer} = require('electron')


contextBridge.exposeInMainWorld('GeneralApi', {
  GeneralCommand: (data) => {
    return ipcRenderer.invoke("GENERAL_COMMANDS", data);
  },

})






