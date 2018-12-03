// ipc module

// call ipc module
const {ipcRenderer} = require('electron')
/* ========== IPC function ========== */
// ipc opeWin --> displayWindow

// ipc dataWin -- opeWin

ipcRenderer.on('changeToNextValue', (event, arg) => {
  changeToStanbyVal(arg)

  var anArry = createArrDataEachSec(arg)
  ipcRenderer.send('kickback', anArry)
}
)

/// //////////////
/// //////////////

function subWinWavDisp (arg, wavename) {
  var sendArg = arg.push(wavename)
  ipcRenderer.send('subWinWavDisp', arg)
}

function monitorClear(arg) {
  ipcRenderer.send('monitorClear', arg)
}

function displaySubWinVal (wavename, val) {
  ipcRenderer.send('displaySubWinVal', [wavename, val])
}
