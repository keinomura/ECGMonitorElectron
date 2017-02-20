//modules
"use strict";
const {app, Menu, BrowserWindow, ipcMain} = require('electron');

const path = require('path');
const url = require('url');

// main window
let main_Win;
 
function createWindow () {
  if (main_Win == null){
  // create new main Window
  main_Win = new BrowserWindow({width: 500, height: 700})

  // set main window URL
  main_Win.loadURL(url.format({
    pathname: path.join(__dirname, 'opeWin.html'),
    protocol: 'file:',
    slashes: true
  }))
  } else {
    main_Win.show();
  }
  // devTool
  //main_Win.webContents.openDevTools();
 
  // when main window is closed
  main_Win.on('closed', function () {
    main_Win = null
  })
}


// sub window
let sub_Win;

function createsubWindow () {
  if (sub_Win == null) {
    // create sub Window
    sub_Win = new BrowserWindow({width: 1200, height: 1000})

  // set sub window URL
    sub_Win.loadURL(url.format({
      pathname: path.join(__dirname, 'dispWin.html'),
      protocol: 'file:',
      slashes: true
    }))
  } else {
    sub_Win.show();
  }
 
// devTool
  //sub_Win.webContents.openDevTools();
 
  // when sub window is closed
  sub_Win.on('closed', function () {
    sub_Win = null
  })
}


 
//  when finished init
// create two windows at start 
app.on('ready', () => {
  createWindow();
  createsubWindow();
});

// All window were closed
app.on('window-all-closed', function () {
  // if runnning platform is not macOS
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// application active
app.on('activate', function () {
  /// if main_win is not exist, create new.
  if (main_Win === null) {
    createWindow();
  }
});


////////////////////
//ipc
////////////////////

ipcMain.on('switchOntoMain', (event, arg) =>{
console.log('received!');
console.log(arg);
sub_Win.webContents.send('switch-on', arg);

});

ipcMain.on('afOn', (event, arg) => {
  sub_Win.webContents.send('afOn', arg);
})

ipcMain.on('ataxiaOn', (event, arg) => {
  sub_Win.webContents.send('ataxiaOn', arg);
})

ipcMain.on('valChange', (event, arg) => {
  sub_Win.webContents.send('valChange', arg);
})

ipcMain.on('bPMesure', (event, arg) => {
  sub_Win.webContents.send('bPMesure', arg);
})


//////////////////
// アプリケーションメニュー設定


app.on('ready', function() {
  installMenu();
});

function installMenu() {
  let template;

template = [
  {
    label: 'app-name',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
      },
    ]
  },
  {
    label: 'Window',
    submenu: [
      {
        label: 'DisplayWindow',
        click: function() { createsubWindow(); }
      },
      {
        label: 'OperationWindow',
        click: function() { createWindow(); }
      },
    ]
  },
];

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);
}