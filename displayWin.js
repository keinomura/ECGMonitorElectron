// call ipc module
const {ipcRenderer} = require('electron')

//
// function

function displayVal (aVSign, aText) {
  var vSignTransList = { bP: 'sub_BPDisplay', hR: 'hR2', spO2: 'spO22', rR: 'rR2' }
  var targetId = vSignTransList[aVSign]
  document.getElementById(targetId).textContent = aText
}

function getCanvas (aVSign) {
  var vSignTransList = { hR: 'hRCanvas2', spO2: 'spO2Canvas2', rR: 'respCanvas2' }
  var targetId = vSignTransList[aVSign]
  return document.getElementById(targetId)
}

function drawOrder (ctx, xPositionInCanvas, pxMoveXPerFrame, lastYPosition, yVal, setColor, aCanvas) {
  ctx.beginPath()
  ctx.moveTo(xPositionInCanvas - pxMoveXPerFrame, lastYPosition) // line start point, the point before this.
  ctx.lineTo(xPositionInCanvas, yVal) // lineTo
  ctx.strokeStyle = setColor
  ctx.stroke()

  if (xPositionInCanvas === 1) {
    ctx.clearRect(0, 0, 30, aCanvas.height)
  } else {
    ctx.clearRect(xPositionInCanvas + 1, 0, 30, aCanvas.height)
  }
}

/* ---------- IPC ---------- */

ipcRenderer.on('subWinWavDisp', (event, arg) => {
  // arg = [xPositionInCanvas, pxMoveXPerFrame, lastYPosition, yVal, setColor, waveName]
  var wavDisplayList = { ecg: 'hR', spO2: 'spO2', rr: 'rR' }
  var aCanvas = getCanvas(wavDisplayList[arg[5]])
  var ctx = aCanvas.getContext('2d')
  drawOrder(ctx, arg[0], arg[1], arg[2], arg[3], arg[4], aCanvas)
})

ipcRenderer.on('monitorClear', (event, arg) => {
  var wavDisplayList = ['hR', 'spO2', 'rR']
  var clearMonitor = function () {
    for (var i in wavDisplayList) {
      var aCanvas = getCanvas(wavDisplayList[i])
      var ctx = aCanvas.getContext('2d')
      ctx.clearRect(0, 0, aCanvas.width, aCanvas.height)
    }
  }
  setTimeout(clearMonitor, 100) // to fix stroke line and clear ctx timerag
})

ipcRenderer.on('displaySubWinVal', (event, arg) => {
  // arg = [waveName, val]
  displayVal(arg[0], arg[1])
})
