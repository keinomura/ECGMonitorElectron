/* ---------- resp animation ---------- */
// default parameters
var respyVal, resplastYPosition
// var respWav1Count = 0
// var respWav2Count = 0
var respcountFramesOfEachWave
var respWaveOn = false
var respAtaxiaOn = false
var ataxicWavArray = []

// over all counter
var overAllCounter = 0

function respdraw () {
  overAllCounter += 1

  var respWav1dur, respWav2dur
  // set canvas drawing
  var aCanvas = document.getElementById('respCanvas')
  var ctx = aCanvas.getContext('2d') // draw on canvas
  // set x point
  var xPositionInCanvas = xVal % (aCanvas.width * 2) / 2 // xVal as loop in canvas width
  // set y point as baseLine
  var respbaserondomYPosition = Math.random() * 3

  // respyVal = setsRRYPoint()

  respyVal = respbaserondomYPosition + rmAF(setsRRYPoint())

  // draw graph
  var setColor = 'white'

  drawOrder(ctx, xPositionInCanvas, pxMoveXPerFrame / 2, resplastYPosition, respyVal, setColor, aCanvas)
  subWinWavDisp([xPositionInCanvas, pxMoveXPerFrame / 2, resplastYPosition, respyVal, setColor], 'rr')

  resplastYPosition = respyVal // set aVal for next line.

  rrdetection(respyVal, respcountFramesOfEachWave)

  respcountFramesOfEachWave += 1
  // draw next graph or not
  if (monitorSwitchOn) {
    window.requestAnimationFrame(respdraw)
  } else {
    ctx.clearRect(0, 0, aCanvas.width, aCanvas.height)
    resplastYPosition = null
    overAllCounter = 0
    return
  }

  xPositionInCanvas = ctx = aCanvas = null
}

var flatWavCounter = 0
var rrWavCounter = 0
var rrWaveOn = false
var wav1st, wav1dur, wav2st, wav2dur, waveStartframe

function setsRRYPoint () {
  // noise

  var wavVal

  // wav1 kyuuki, wav2 koki
  // [wav1st, wav1dur, wav2st, wav2dur, waveStartframe] = [0, 60, 72, 90, 90]
  var RR = document.getElementById('slider4').value

  if (wav1st === undefined) {
    [wav1st, wav1dur, wav2st, wav2dur, waveStartframe] = setWaveParam(RR)
  }
  // wave parameter set
  // [wav1st, wav1dur, wav2st, wav2dur, waveStartframe] = setWaveParam(RR)

  // start drawing RR wave
  if (flatWavCounter === waveStartframe) {
    rrWaveOn = true
    rrWavCounter = 0
    flatWavCounter = 0;
    [wav1st, wav1dur, wav2st, wav2dur, waveStartframe] = setWaveParam(RR)
  }

  // drawing RR wave Or not
  var respbaseYPosition = 120
  if (rrWaveOn) { // breathing
    rrWavCounter += 1
    wavVal = createRRWave(rrWavCounter, wav1st, wav1dur, wav2st, wav2dur)
  } else { // not breathing
    flatWavCounter += 1
    wavVal = respbaseYPosition
  }

  // end drawing RR wave
  if (rrWavCounter === wav2st + wav2dur) {
    rrWavCounter = 0
    rrWaveOn = false
    flatWavCounter = 0
  }

  return wavVal
}

function setWaveParam (RR) {
  var wav1st, wav1dur, wav2st, wav2dur, waveStartframe
  var endPointframe, restFrame
  var rtary = []
  if (RR <= 14) {
    // fix wave param, change rest time
    [wav1st, wav1dur, wav2st, wav2dur] = [0, 60, 72, 90]
    endPointframe = wav2st + wav2dur
    restFrame = 60 / RR * 60 - endPointframe
    return [wav1st, wav1dur, wav2st, wav2dur, restFrame]
  } else if (RR > 14 && RR <= 20) {
    // change wave and rest time equally without pose breathing time
    // [wav1st, wav1dur, wav2st, wav2dur, restFrame] = [0, a, a + 12, 3 / 2 * a, 3 / 2 * a]
    var a = (1 / 4) * ((60 / RR) - 0.2)
    var timeArry = [0, a, a + 0.2, 3 / 2 * a, 3 / 2 * a]
    rtary = timeArry.map(x => Math.round(x * 60))
    return rtary
  } else if (RR > 20 && RR <= 28) {
    // fix wave param, change rest time
    [wav1st, wav1dur, wav2st, wav2dur] = [0, 42, 54, 60]
    endPointframe = wav2st + wav2dur
    restFrame = Math.round(60 / RR * 60 - endPointframe)
    return [wav1st, wav1dur, wav2st, wav2dur, restFrame]
  } else if (RR > 28) {
    var baseFrameArry = [0, 42, 54, 60, 12]
    var baseoneCicle = 54 + 60 + 12 // Frame
    var keisuu = 60 / RR / (baseoneCicle) * 60
    rtary = baseFrameArry.map(x => Math.round(x * keisuu))
    return rtary
  }
}

function createRRWave (rrWavCounter, wav1st, wav1dur, wav2st, wav2dur) {
  var wavVal
  var thePeakVal = 120 - (-1 / 2) * ((1 / ((wav1st + wav1dur) / 60 + 1) / ((wav1st + wav1dur) / 60 + 1)) - 1) * 150
  if (rrWavCounter <= wav1st + wav1dur) { // inspiration
    wavVal = 120 - (-1 / 2) * ((1 / (rrWavCounter / 60 + 1) / (rrWavCounter / 60 + 1)) - 1) * 150
  } else if (rrWavCounter >= (wav1st + wav1dur) && rrWavCounter <= wav2st) {
    wavVal = thePeakVal
  } else if (rrWavCounter >= wav2st && rrWavCounter <= wav2st + wav2dur) {
    wavVal = thePeakVal + (-1 / 2) * ((1 / ((2 / 3) * (rrWavCounter - wav2st) / 60 + 1)) / ((2 / 3) * (rrWavCounter - wav2st) / 60 + 1) - 1) * 150
  }
  return wavVal
}

var ryValArry = []
// moving average filter
function rmAF (syVal) {
  var framecount = 20
  ryValArry.push(syVal)
  while (ryValArry.length > framecount) {
    ryValArry.shift()
  }
  if (ryValArry.length < framecount) {
    return 0
  } else {
    var sum = 0
    for (var j in ryValArry) {
      sum = sum + ryValArry[j]
    }
    return sum / framecount
  }
}
