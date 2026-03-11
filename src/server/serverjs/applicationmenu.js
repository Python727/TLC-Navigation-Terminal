const { app, BrowserWindow, dialog, ipcMain, Menu, clipboard, session } = require('electron');
const path = require('path');

let _mainWindow = null;
                                                                                                                                                                          
var template =
    [

        {
                label: "Actions",
                submenu: [
                    {
                        label: "Reload",
                        role: 'reload'
                    },

                    // { type: 'separator' },

                    // {
                    //     label: 'DevTools',
                    //     role: 'toggleDevTools'
                    // },

                    { type: 'separator' },
                    
                    {
                        label: "Fullscreen",
                        role: 'togglefullscreen'
                    },

                ]
                
            }

    ]



//achtung ##################################################################################################
//achtung ##################################################################################################
//achtung ##################################################################################################


//achtung ##################################################################################################
//achtung ##################################################################################################
//achtung ##################################################################################################
function setMainWindow(mainWindow){
    _mainWindow = mainWindow;
}

// appMenu als Getter: buildFromTemplate erst nach app.ready aufrufen
module.exports = {
  get appMenu() { return Menu.buildFromTemplate(template); },
  setMainWindow: setMainWindow,
};
