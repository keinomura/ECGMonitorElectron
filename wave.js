/* ========== graph animation ========== */

/* ---------- ECG animation ---------- */
// default parameters
var xVal = 0
var pxMoveXPerFrame
var baseLineVal = 85
var countFramesOfEachWave //= 0

var lastYPosition //= 120

var changeAfVal = true
var pWaveStartFrame, qrsWaveStartFrame, tWaveStartFrame, pqWaveDuration, tWaveDuration // hRCheck

function draw () {
  // set canvas drawing
  var aCanvas = document.getElementById('hRCanvas')
  var ctx = aCanvas.getContext('2d') // draw on canvas

  // set x,y point
  pxMoveXPerFrame = 1 // x point move val interval as 1 frame
  var xPositionInCanvas = xVal % (aCanvas.width) // xVal as loop in canvas width

  var yVal = setYPoint()

  // draw graph
  var setColor = 'lightgreen'
  drawOrder(ctx, xPositionInCanvas, pxMoveXPerFrame, lastYPosition, yVal, setColor, aCanvas)
  subWinWavDisp([xPositionInCanvas, pxMoveXPerFrame, lastYPosition, yVal, setColor], 'ecg')

  lastYPosition = yVal // set aVal for next line.

  qrsdetection (yVal, countFramesOfEachWave)

  countFramesOfEachWave += 1 // add 1 count to each wave

  xVal += pxMoveXPerFrame // needed to change xPositionInCanvas(x point in canvas)

  // draw next wave or not
  var switchOn = document.getElementById('switchBtn51').checked
  if (switchOn) {
    window.requestAnimationFrame(draw)
  } else {
    ctx.clearRect(0, 0, aCanvas.width, aCanvas.height)
    monitorClear()
    lastYPosition = xPositionInCanvas = ctx = aCanvas = null
  }
}

function setYPoint () {
// af
  var afOn = document.getElementById('switchBtn1').checked

  // set y point as baseLine
  // ##ecgBaseLine? need?
  var baseYPosition, ecgBaseLine
  if (changeAfVal === undefined) { changeAfVal = true }
  if (afOn) {
    changeAfVal = !(changeAfVal) // too fine randam wave when each 1 frame draw, so set 2 frame
    baseYPosition = baseLineVal + Math.random() * 8 - 4
    if (changeAfVal) { // true > change Y position, false > stay Y position
      ecgBaseLine = baseYPosition
    } else {
      ecgBaseLine = (lastYPosition) || 120
    }
  } else {
    baseYPosition = baseLineVal + Math.random() * 0.8 // baseLine with fractuate voltage
    ecgBaseLine = baseYPosition
  }

  /// // create waves /////
  // set wave y point, when pqrs wave start
  // set wave parameters at first

  // set each wave parameters as each Hr at the start time countFramesOfEachWave == 0
  if (countFramesOfEachWave === 0) {
    var setHRValue = document.getElementById('slider1').value // hR slider
    var waveHR = (afOn) ? Math.round(setHRValue - 20 + Math.random() * 40)
      : setHRValue

;// need ; for next array
    [pWaveStartFrame, qrsWaveStartFrame, tWaveStartFrame, pqWaveDuration, tWaveDuration] =
                (afOn) ? [0, 7, 14, 4, 8]
                  : (waveHR <= 80) ? [2, 12, 20, 4, 16]
                    : (waveHR <= 100) ? [1, 9, 17, 4, 13]
                      : [0, 7, 14, 4, 8]
  }

  // create each Wave
  var pwaveVal = (afOn) ? null
    : createWave(pWaveStartFrame, pqWaveDuration, 'p')
  var qrswaveVal = createWave(qrsWaveStartFrame, pqWaveDuration, 'q')
  var twaveVal = createWave(tWaveStartFrame, tWaveDuration, 't')

  // sum all waves
  var yVal = baseYPosition + pwaveVal + qrswaveVal + twaveVal// to get x point from global var
  return yVal
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

function controlECGWaveParameters () {
  countFramesOfEachWave = 0

  // create HR rhythms
  function calcHR () {
    var ahRtext = document.getElementById('slider1').value
    var hr
    var afOn = document.getElementById('switchBtn1').checked
    if (afOn) {
      hr = ahRtext * 1 - 10 + Math.random() * 20
    } else {
      hr = ahRtext * 1
    }
    return hr * 1
  }

  var calhR = calcHR() * 1
  // setNextWave
  var hRtime = (60000 / calhR * 1) // time to next fire()
  timeoutid = setTimeout(controlECGWaveParameters, hRtime)
};

// create each wave shapes including 'resp wave'
function createWave (startFrame, durationtime, waveform) {
  var waveParamList = {
    p: [3, 1, 0],
    q: [15, 3 / 2, 5],
    t: [10, 1, 0],
    w1: [30, 1, 0],
    w2: [15, 1, 0]
  }
  var [strongHeight, pow, initialQSnotch] = waveParamList[waveform]

  var countFrameOfDetailElement, AcountFramesOfEachWave, wavVal
  if (waveform === 'rr') {
    countFrameOfDetailElement = respcountFramesOfEachWave - startFrame
    AcountFramesOfEachWave = respcountFramesOfEachWave
  } else {
    countFrameOfDetailElement = countFramesOfEachWave - startFrame
    AcountFramesOfEachWave = countFramesOfEachWave
  }

  if (startFrame <= AcountFramesOfEachWave && AcountFramesOfEachWave <= (startFrame + durationtime)) {
    // waves in display are reverse
    wavVal = initialQSnotch - Math.pow(Math.abs(strongHeight * Math.sin(Math.PI / (durationtime) * countFrameOfDetailElement)), pow)
  } else {
    wavVal = 0
  }
  return wavVal
}
