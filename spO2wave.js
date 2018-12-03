/* ========== graph animation ========== */

/* ---------- SpO2 animation ---------- */
// default parameters
var spyVal, splastYPosition, spPowVal, wavflat

function spO2draw () {
  // set canvas drawing
  var aCanvas = document.getElementById('spO2Canvas')
  var ctx = aCanvas.getContext('2d') // draw on canvas

  // set x, y point
  var xPositionInCanvas = xVal % (aCanvas.width) // (x point in canvas)
  var yVal = setspO2YPoint()

  // draw graph
  var setColor = 'lightskyblue'
  drawOrder(ctx, xPositionInCanvas, pxMoveXPerFrame, splastYPosition, yVal, setColor, aCanvas)
  subWinWavDisp([xPositionInCanvas, pxMoveXPerFrame, splastYPosition, yVal, setColor], 'spO2')

  splastYPosition = yVal// set aVal for next line.
  // draw next wave or not
  if (monitorSwitchOn) {
    window.requestAnimationFrame(spO2draw)
  } else {
    ctx.clearRect(0, 0, aCanvas.width, aCanvas.height)
    splastYPosition = yVal = null
  }
}

function setspO2YPoint () {
  var spbaseYPosition = baseLineVal - 20 + Math.random() * 0.8 // baseLine with fractuate voltage

  /// // create waves /////
  // set each wave parameters as each Hr
  // var hRSlider = document.getElementById('hRSlider')
  var hRSlider = document.getElementById('slider1')
  var afOn = document.getElementById('switchBtn1')
  var wav1st, wav1dur, wav2st, wav2dur;
  [wav1st, wav1dur, wav2st, wav2dur, spPowVal] =
            (afOn) ? [10, 10, 13, 8, 40]
              : (hRSlider.value <= 80) ? [14, 15, 20, 13, 35]
                : (hRSlider.value <= 100) ? [10, 13, 16, 13, 40]
                  : [10, 10, 13, 8, 40]

  wavflat += 1
  if (countFramesOfEachWave === (wav2st + wav2dur)) {
    wavflat = 0
  }

  var wav1 = createWave(wav1st, wav1dur, 'w1')
  var wav2 = createWave(wav2st, wav2dur, 'w2')

  // sum all waves
  spyVal = ((wav1 + wav2) === 0) ? (splastYPosition + spPowVal * Math.pow(3 / 15, (wavflat + 10) / 10)) : spbaseYPosition + wav1 + wav2 - 20
  return spyVal
}
