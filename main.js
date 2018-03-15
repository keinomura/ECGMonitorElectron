// modules
'use strict'
const {app, Menu, BrowserWindow, ipcMain} = require('electron')

const path = require('path')
const url = require('url')

// main window
let mainWin

function createWindow () {
  var mainWin
  if (mainWin == null) {
    // create new main Window
    mainWin = new BrowserWindow({width: 1000, height: 700})

    // set main window URL
    mainWin.loadURL(url.format({
      pathname: path.join(__dirname, 'opeWin.html'),
      protocol: 'file:',
      slashes: true
    }))
  } else {
    mainWin.show()
  }
  // devTool
   mainWin.webContents.openDevTools()

  // when main window is closed
  mainWin.on('closed', function () {
    mainWin = null
  })
}

// sub window
let subWin

function createsubWindow () {
  if (subWin == null) {
    // create sub Window
    subWin = new BrowserWindow({width: 1200, height: 1000})

    // set sub window URL
    subWin.loadURL(url.format({
      pathname: path.join(__dirname, 'dispWin.html'),
      protocol: 'file:',
      slashes: true
    }))
  } else {
    subWin.show()
  }

  // devTool
  // subWin.webContents.openDevTools()

  // when sub window is closed
  subWin.on('closed', function () {
    subWin = null
  })
}

/*
let dataWin

function createdataWindow () {
  if (dataWin == null) {
    // create data Window
    dataWin = new BrowserWindow({width: 300, height: 300})

    // set data window URL
    dataWin.loadURL(url.format({
      pathname: path.join(__dirname, 'dataWin.html'),
      protocol: 'file:',
      slashes: true
    }))
  } else {
    dataWin.show()
  }
  

  // devTool
  dataWin.webContents.openDevTools()

  // when sub window is closed
  dataWin.on('closed', function () {
    dataWin = null
  })
  
}
*/

//  when finished init
// create two windows at start
app.on('ready', () => {
  createWindow()
  createsubWindow()
  //createdataWindow()
})

// All window were closed
app.on('window-all-closed', function () {
  // if runnning platform is not macOS
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// application active
app.on('activate', function () {
  /// if mainWin is not exist, create new.
  if (mainWin === null) {
    createWindow()
  }
})

/// /////////////////
// ipc
/// /////////////////

// ipc opeWin --> dispWin

ipcMain.on('switchOntoMain', (event, arg) => {
// console.log('received!')
// console.log(arg)
  subWin.webContents.send('switch-on', arg)
})

ipcMain.on('afOn', (event, arg) => {
  subWin.webContents.send('afOn', arg)
})

ipcMain.on('ataxiaOn', (event, arg) => {
  subWin.webContents.send('ataxiaOn', arg)
})

ipcMain.on('valChange', (event, arg) => {
  subWin.webContents.send('valChange', arg)
})

ipcMain.on('bPMesure', (event, arg) => {
  subWin.webContents.send('bPMesure', arg)
})

ipcMain.on('changeToNextValue', (event, arg) => {
  mainWin.webContents.send('changeToNextValue', arg)
  console.log('yes')
})

ipcMain.on('kickback', (event, arg) => {
  console.log(arg)
})

/// /////////////////
// application menu

app.on('ready', function () {
  installMenu()
})

function installMenu () {
  let template

  template = [
    {
      label: 'app-name',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function () { app.quit() }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'DisplayWindow',
          click: function () { createsubWindow() }
        },
        {
          label: 'OperationWindow',
          click: function () { createWindow() }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
