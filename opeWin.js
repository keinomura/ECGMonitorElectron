// call ipc module
const {ipcRenderer} = require('electron')

/* ========== function of html button ========== */
/* ---------- general function---------- */
function displayVal (aVSign, aText) {
  var targetId = aVSign + 'small'
  document.getElementById(targetId).textContent = aText
}

/* ---------- BP mesure animation function---------- */
function mesureBP () {
  if (switchOn) {
    var sBP = document.getElementById('slider2').value
    var dBP = parseInt(0.0015 * sBP * sBP - 0.1698 * sBP + 77.319)

    var ipcData = { 'sBP': sBP, 'dBP': dBP }
    displayWindowIPC('bPMeasure', ipcData)
    bPMesureAtDispWinIPC([sBP, dBP]) //

    var blinkText = function (dispTimeMs, dispText) {
      setTimeout(function () {
        displayVal('bP', dispText)
      }, dispTimeMs)
    }

    var blinkTimes = 2
    var blinkDurationMs = 500

    // blink text
    var aay = ['--- / ---', ''] // Display text alternately
    for (var i = 0; i < blinkTimes * 2; i++) {
      var mo = i % 2
      blinkText(blinkDurationMs * i, aay[mo])
    }

    // finally show BPs
    var finalMs = blinkTimes * 2 * blinkDurationMs
    blinkText(finalMs, sBP + ' / ' + dBP)
  }
}

/* ---------- Monitor ON togleSwich function---------- */
// need to global var to clearTimeout
var timeoutid = null // timeoutId for ECG display
var timeoutid2 = null // timeoutId for resp display
var switchOn = false

function toggleOnOffSwitch () { // start drawing, ringing,
// => main.js => displayWindow
  switchOnIPC()
  switchOn = document.getElementById('switchBtn51').checked

  // clearTimeout
  clearTimeout(timeoutid)
  clearTimeout(timeoutid2)

  // toggle Switch function
  if (switchOn) {
  /// // start waves drawing /////
    window.requestAnimationFrame(draw) // ecg
    window.requestAnimationFrame(spO2draw)
    window.requestAnimationFrame(respdraw)

    /// / Wave drawind, Sound, Change Values

    controlECGWaveParametersAndSound()
    controlRespWaveAndValue()
  } else {
  /// // change values to default, stop waves drawing /////
    var aAry = ['hR', 'spO2', 'bP', 'rR']
    for (i = 0; i < aAry.length; i++) {
      displayVal(aAry[i], '--')
    }
  }
}

/// // ECG Wave drawind, Sound, Change Values function /////
var hRArray = []
function controlECGWaveParametersAndSound () {
// initial setting at start
  var waveOn
  if (waveOn) {
    return
  } else {
    waveOn = true; countFramesOfEachWave = 0
  }

  // Beep ECG Sound By SpO2 value
  var beepBySpO2 = function () {
    var dinum = document.getElementById('slider3').value
    // not to delay, read wav files directry
    var dinumplus = 'wav/' + dinum + '.wav'
    var sound = new Audio(dinumplus)
    sound.volume = document.getElementById('slider5').value
    sound.play()

    dinum = dinumplus = sound = null
    // document.getElementById(dinum).play()  //this handler makes some delay
  }
  beepBySpO2()

  // create HR rhythms
  function calcHR () {
    var ahRtext = document.getElementById('slider1').value
    var hr
    var afOn = document.getElementById('switchBtn1').checed
    if (afOn) {
      hr = ahRtext * 1 - 10 + Math.random() * 20
    } else {
      hr = ahRtext * 1
    }
    return hr * 1
  }
  var hRcalc = calcHR() * 1
  // display each last 3 hR average
  var displayHRAve = function () {
    hRArray.push(hRcalc)
    if (hRArray.length === 3) {
      var aveHR = (hRArray[0] + hRArray[1] + hRArray[2]) / 3
      displayVal('hR', parseInt(aveHR))
      var tempspO2 = document.getElementById('slider3').value
      displayVal('spO2', tempspO2)
      hRArray.length = 0
    }
  }
  displayHRAve()

  var calhR = calcHR() * 1
  // setNextWave
  var hRtime = (60000 / calhR * 1) // time to next fire()
  timeoutid = setTimeout(controlECGWaveParametersAndSound, hRtime)
};

/// // resp Wave drawind, create ataxic resp waves, Change Values function /////
var rRArray = []
function controlRespWaveAndValue () {
  // reset resp wave parameter in
  if (respWaveOn) {
    return
  } else {
    respWaveOn = true
    respcountFramesOfEachWave = 0
  }

  // create resp rhythm and ataxic Wave if needed
  function calcRR () {
    var aRRVal = document.getElementById('slider4').value
    if (respAtaxiaOn) {
      ataxicWavArray = create5AtaxicResp()
      return aRRVal * 1 - 2 + Math.random() * 4
    } else {
      return aRRVal * 1
    }
  }
  var aRR = calcRR() * 1
  // display average hR
  var displayRRAve = function () {
    rRArray.push(aRR)
    if (rRArray.length === 2) {
      var aveRR = (rRArray[0] + rRArray[1]) / 2
      displayVal('rR', parseInt(aveRR))
      rRArray.length = 0 // reset array
    }
  }
  displayRRAve()
  // set Next resp Wave
  var rRtime = (60000 / aRR) * 1 // time to next wave
  timeoutid2 = setTimeout(controlRespWaveAndValue, rRtime)
  rRtime = aRR = null
};

/* ---------- random rhythm button ---------- */

function hRRhythmChangeSW () {
  var checkedValue = null
  checkedValue = document.getElementById('hRcheck').checked
  afOn = checkedValue // sinus true, Af false

  optionColorChange('optionalValaf', checkedValue)
  afOnIPC(checkedValue)

  checkedValue = null
}

function rRRhythmChangeSW () {
  var checkedValue = null
  checkedValue = document.getElementById('rRcheck').checked
  respAtaxiaOn = checkedValue

  optionColorChange('optionalValrR', checkedValue)
  respAtaxiaOnIPC(checkedValue)

  checkedValue = null
}

function cancelOtherSwitch (switchElement) {
  var swithcChildNodesArry = switchElement.parentNode.childNodes
  for (var i = 0; i < swithcChildNodesArry.length; i++) {
    var aNode = swithcChildNodesArry[i]
    console.log(aNode.nodeType)
    if (aNode.nodeType === 1) {
      aNode.checked = false
      aNode.style.opacity = 0.5
      aNode.style.color = 'white'
    }
    console.log(aNode, aNode.checked)
  }
}

function optionColorChange (targetId, aBool) {
  var target = document.getElementById(targetId)

  if (aBool) {
    target.style.color = 'blue'
  } else {
    target.style.color = 'lightgray'
  }

  target = null
}

/* ========== graph animation ========== */

/* ---------- ECG animation ---------- */
// default parameters
var xVal = 0
var yVal
var pxMoveXPerFrame
var baseLineVal = 85
// var waveOn
var countFramesOfEachWave = 0
// var pwCount, qRSCount, tCount
var lastYPosition = 120
var changeAfVal = true
// var afOn = false
// var randomCoefficient
var pWaveStartFrame, qrsWaveStartFrame, tWaveStartFrame, pqWaveDuration, tWaveDuration // hRCheck
var i = 0
var waveDrawingNow = false

function draw () {
 // var pWaveStartFrame, qrsWaveStartFrame, tWaveStartFrame, pqWaveDuration, tWaveDuration// , hRCheck

  // set canvas drawing
  var aCanvas = document.getElementById('hRCanvas')
  var ctx = aCanvas.getContext('2d') // draw on canvas

  // set x point
  pxMoveXPerFrame = 1 // x point move val interval as 1 frame
  var xPositionInCanvas = xVal % (aCanvas.width) // xVal as loop in canvas width
  var afOn = document.getElementById('switchBtn1').checked
  // console.log('afOn is ', afOn)
  // set y point as baseLine
  var baseYPosition, ecgBaseLine
  if (changeAfVal === undefined) { changeAfVal = true }
  if (afOn) {
    changeAfVal = !(changeAfVal) // too fine randam wave when each 1 frame draw, so set 2 frame
    baseYPosition = baseLineVal + Math.random() * 8
    if (changeAfVal) { // true > change Y position, false > stay Y position
      ecgBaseLine = baseYPosition
    } else {
      ecgBaseLine = lastYPosition
    }
  } else {
    baseYPosition = baseLineVal + Math.random() * 0.8 // baseLine with fractuate voltage
    ecgBaseLine = baseYPosition
  }
  /// // create waves /////
  // set wave y point, when pqrs wave start
  var waveOn = document.getElementById('switchBtn51').checked
  if (waveOn === true) {
    // set wave parameters at first
    if (waveDrawingNow === false) { // prevent to change the waveform values during drawing
      // set each wave parameters as each Hr
      var hRSlider = document.getElementById('slider1')
      var waveHR = hRSlider.value
      // var afOn = document.getElementById('switchBtn1').checked

      var wave
      [pWaveStartFrame, qrsWaveStartFrame, tWaveStartFrame, pqWaveDuration, tWaveDuration, hRCheck] =
                  (afOn) ? [0, 7, 14, 4, 8, 'af']
                    : (waveHR <= 80) ? [2, 12, 20, 4, 16, '-80']
                      : (waveHR <= 100) ? [1, 9, 17, 4, 13, '-100']
                        : [0, 7, 14, 4, 8, '120']

      // console.log('tWaveStartFrame is ', tWaveStartFrame, ' waveHR is ', waveHR)
      // console.log('afOn1 is', afOn1)
      waveDrawingNow = true
      var waveReset = function () {
        waveDrawingNow = false
        // waveOn = false
      }
      setTimeout(waveReset(), (60000 / waveHR))
    }
    // console.log('waveOn ', waveOn, ' waveDrawing ', waveDrawingNow)
    // countFramesOfEachWave is a wave timing, reset when fire() wave start;
    var pwaveVal
    // set y point of wave
    // console.log('countFramesOfEachWave is', countFramesOfEachWave, ' tWaveStartFrame is ', tWaveStartFrame, ' tWaveDuration is ', tWaveDuration)
    // console.log(countFramesOfEachWave <= (tWaveStartFrame + tWaveDuration))

    var tWaveEndFrame = tWaveStartFrame + tWaveDuration
    // console.log('contFrameWave is ', countFramesOfEachWave, ' tWaveEnd is ', tWaveEndFrame)
    if (countFramesOfEachWave <= (tWaveEndFrame)) {
      // p wave
      // console.log('afOn1 is ', afOn1)
      if (afOn) {
        pwaveVal = null
      } else {
        // console.log(pWaveStartFrame, pqWaveDuration)
        pwaveVal = createWave(pWaveStartFrame, pqWaveDuration, 3, 1, 0, 'p')
        // console.log('pwaveVal is ', pwaveVal)
      }
      // qrs, t waves
      var qrswaveVal = createWave(qrsWaveStartFrame, pqWaveDuration, 15, 3 / 2, 5, 'q')
      var twaveVal = createWave(tWaveStartFrame, tWaveDuration, 10, 1, 0, 't')
      // all waves
      yVal = baseYPosition + pwaveVal + qrswaveVal + twaveVal// to get x point from global var
    } else {
      yVal = ecgBaseLine
    }
    // console.log(pwaveVal)
    // waveOn reset when tWave is end.
    /*
    if (countFramesOfEachWave === (tWaveStartFrame + tWaveDuration)) {
      waveOn = false
      waveDrawingNow = false
    }
    */
  } else {
    // wave off, baseLines
    yVal = ecgBaseLine
    console.log('gg')
  }

  // add 1 point to x
  countFramesOfEachWave += 1
  // console.log(yVal)
  // console.log('waveOn ', waveOn, ' waveDrawing ', waveDrawingNow)

  // draw graph
  var setColor = 'lightgreen'
  drawOrder(ctx, xPositionInCanvas, pxMoveXPerFrame, lastYPosition, yVal, setColor, aCanvas)
  lastYPosition = yVal // set aVal for next line.
  xVal += pxMoveXPerFrame // needed to change xPositionInCanvas(x point in canvas)

  // draw next wave or not
  if (switchOn) {
    window.requestAnimationFrame(draw)
  } else {
    ctx.clearRect(0, 0, aCanvas.width, aCanvas.height)
    lastYPosition = null
    return
  }

  xPositionInCanvas = ctx = aCanvas = null
}

/* ---------- SpO2 animation ---------- */
// default parameters
var spyVal, splastYPosition, spPowVal, wavflat
// var wav1Count, wav2Count

function spO2draw () {
  // set canvas drawing
  var aCanvas = document.getElementById('spO2Canvas')
  var ctx = aCanvas.getContext('2d') // draw on canvas

  // set x point
  var xPositionInCanvas = xVal % (aCanvas.width) // (x point in canvas)

  // set y point as baseLine
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
  // wave
  if (countFramesOfEachWave < wav1st) { // before wave start
    spyVal = splastYPosition + spPowVal * Math.pow(3 / 15, (wavflat + 10) / 10)

    if (spyVal >= 149) { spyVal = 149 }
  } else if (countFramesOfEachWave <= (wav2st + wav2dur)) { // wave start
    // wav1, wav2 wave
    var wav1 = createWave(wav1st, wav1dur, 30, 1, 0, 'w1')
    var wav2 = createWave(wav2st, wav2dur, 15, 1, 0, 'w2')
    // all waves
    spyVal = spbaseYPosition + wav1 + wav2
  } else {
    spyVal = splastYPosition + spPowVal * Math.pow(3 / 15, (wavflat + 10) / 10)
    if (spyVal >= 149) { spyVal = 149 }
    wavflat += 1
  }

  if (countFramesOfEachWave === (wav2st + wav2dur)) {
    wavflat = 0
  }

  // draw graph
  var setColor = 'lightskyblue'
  drawOrder(ctx, xPositionInCanvas, pxMoveXPerFrame, splastYPosition, spyVal, setColor, aCanvas)
  splastYPosition = null
  splastYPosition = spyVal // set aVal for next line.

  // draw next wave or not
  if (switchOn) {
    window.requestAnimationFrame(spO2draw)
  } else {
    ctx.clearRect(0, 0, aCanvas.width, aCanvas.height)
    splastYPosition = null
    return
  }

  xPositionInCanvas = ctx = aCanvas = spyVal = null
}

/* ---------- resp animation ---------- */
// default parameters
var respyVal, resplastYPosition
// var respWav1Count = 0
// var respWav2Count = 0
var respcountFramesOfEachWave
var respWaveOn = false
var respAtaxiaOn = false
var ataxicWavArray = []

function respdraw () {
  var respWav1dur, respWav2dur
  // set canvas drawing
  var aCanvas = document.getElementById('respCanvas')
  var ctx = aCanvas.getContext('2d') // draw on canvas
  // set x point
  var xPositionInCanvas = xVal % (aCanvas.width * 2) / 2 // xVal as loop in canvas width
  // set y point as baseLine
  var respbaseYPosition = 120

  // /// create waves /////
  console.log(respWaveOn)
  if (respWaveOn) {
    // respWav2dur is kyuuki duration
    var aRR = (document.getElementById('rR').innerText)
    respWav2dur = parseInt(-1 * (4 / 3) * aRR + 88)
    respWav1dur = parseInt(respWav2dur * 0.8)
    aRR = null
    // max 30/min 1:1.5 timer:every 2sec
    // min 6/min 2sec:3sec timer every 10sec
    // ave 12/min 1.5sec:2.3sec timer every 5sec
    // 1sec = 60 frame

    if (respcountFramesOfEachWave <= respWav2dur) {
      var wav1 = createWave(0, respWav1dur, 50, 1, 0, 'rr')
      var wav2 = createWave(0, respWav2dur, 30, 1, 0, 'rr')
      // all waves
      respyVal = respbaseYPosition + wav1 + wav2
    } else {
      respyVal = 120 // respbaseYPosition;
    }

    if (respcountFramesOfEachWave === respWav2dur) {
      respWaveOn = false
    }
  } else {
    respyVal = 120 // respbaseYPosition;
  }

  // add 5 ataxic resp waves
  if (respAtaxiaOn) {
    var ataxicrr
    if (ataxicWavArray.length === 0) {
      ataxicrr = 0
    } else {
      var aArry = [ ]
      for (i = 0; i < 5; i++) {
        var aryW = ataxicWavArray[i]
        // dur, sT, Height
        var durT = aryW.durT
        var sT = aryW.sT
        var Height = aryW.Height
        var wave = createWave(sT, durT, Height, 1, 0, 'rr')

        aArry.push(wave)
      }

      var ataxicrr1 = function () {
        var a = 0
        for (i = 0; i < 5; i++) {
          a += aArry[i]
        }
        return a
      }

      ataxicrr = ataxicrr1() * 1
    };

    respyVal = respyVal + ataxicrr
  }

  // draw graph
  var setColor = 'white'
  drawOrder(ctx, xPositionInCanvas, pxMoveXPerFrame / 2, resplastYPosition, respyVal, setColor, aCanvas)
  resplastYPosition = respyVal // set aVal for next line.
  respcountFramesOfEachWave += 1
  var switchOn = document.getElementById('switchBtn51').checked
  // draw next graph or not
  if (switchOn) {
    window.requestAnimationFrame(respdraw)
  } else {
    ctx.clearRect(0, 0, aCanvas.width, aCanvas.height)
    resplastYPosition = null
    return
  }

  xPositionInCanvas = ctx = aCanvas = null
}

// --------- subfunction for wave drawing ------
function create5AtaxicResp () {
  ataxicWavArray.length = 0
  var aWave = function (durT, sT, Height) {
    this.durT = durT
    this.sT = sT
    this.Height = Height
  }

  for (i = 0; i < 5; i++) {
    var durTimeFrame = Math.floor(Math.random() * 30) + 30 // 30-60 frame
    var startTimeFrame = Math.floor(Math.random() * 840) + 60 // 60-900 frame
    var strongHeight = Math.floor(Math.random() * 10) + 20 // 20-30 times
    var randomWave = new aWave(durTimeFrame, startTimeFrame, strongHeight)
    ataxicWavArray.push(randomWave)
  }
  return ataxicWavArray
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

// create each wave shapes including 'resp wave'
function createWave (startFrame, durationtime, strongHeight, pow, initialQSnotch, waveform) {
  var countFrameOfDetailElement, AcountFramesOfEachWave, wavVal
  if (waveform === 'rr') {
    countFrameOfDetailElement = respcountFramesOfEachWave - startFrame
    AcountFramesOfEachWave = respcountFramesOfEachWave
  } else {
    countFrameOfDetailElement = countFramesOfEachWave - startFrame
    AcountFramesOfEachWave = countFramesOfEachWave
  }

  // console.log('startFrame is ', startFrame, 'AcountFramesOfEachWave is ', AcountFramesOfEachWave, 'durationtime is ', durationtime)
  // console.log(startFrame <= AcountFramesOfEachWave && AcountFramesOfEachWave <= (startFrame + durationtime))
  if (startFrame <= AcountFramesOfEachWave && AcountFramesOfEachWave <= (startFrame + durationtime)) {
    wavVal = initialQSnotch - Math.pow(Math.abs(strongHeight * Math.sin(Math.PI / (durationtime) * countFrameOfDetailElement)), pow)
    // console.log(wavVal, 'initialQSnotch is ', initialQSnotch)
  } else {
    wavVal = 0
  }
  // console.log(wavVal)
  return wavVal
}

/* ========== databox link function ========== */
/*
function createArrDataEachSec (arg) {
  // arg = [sBP,dBP,hR,spO2,rR, afOn, respAtaxiaOn, changeDurTime, changeTimeOn]
  var finHR = arg[2] * 1
  var finSpO2 = arg[3] * 1
  var finRR = arg[4] * 1

  var stHR = document.getElementById('hRSliderSide').value * 1
  var stSpO2 = document.getElementById('spO2SliderSide').value * 1
  var stRR = document.getElementById('rRSliderSide').value * 1

  var changeDurTime = arg[7]

  var datePerSec = []
  for (i = 0; i < changeDurTime; i++) {
    var cHR = parseInt((i + 1) / changeDurTime * (finHR - stHR)) + stHR
    var cSpO2 = parseInt((i + 1) / changeDurTime * (finSpO2 - stSpO2)) + stSpO2
    var cRR = parseInt((i + 1) / changeDurTime * (finRR - stRR)) + stRR

    datePerSec.push([cHR, cSpO2, cRR])
  }

  return datePerSec
}
*/

function newcreateArrDataEachSec (datas) {
  // arg = [sBP,dBP,hR,spO2,rR, afOn, respAtaxiaOn, changeDurTime, changeTimeOn]
  var finHR = datas.hR
  var finSpO2 = datas.spO2
  var finRR = datas.rR

  var stHR = document.getElementById('slider1').value * 1
  var stSpO2 = document.getElementById('slider3').value * 1
  var stRR = document.getElementById('slider4').value * 1

  var changeDurTime = datas.time

  var datePerSec = []
  for (i = 0; i < changeDurTime; i++) {
    var cHR = parseInt((i + 1) / changeDurTime * (finHR - stHR)) + stHR
    var cSpO2 = parseInt((i + 1) / changeDurTime * (finSpO2 - stSpO2)) + stSpO2
    var cRR = parseInt((i + 1) / changeDurTime * (finRR - stRR)) + stRR

    datePerSec.push([cHR, cSpO2, cRR])
  }

  return datePerSec
}

var cElapsedSec
// var toid = null
function newchangeToStanbyVal (datas) {
  // arg = [sBP,dBP,hR,spO2,rR, afOn, respAtaxiaOn, changeDurTime, changeTimeOn]
  // when monitor off
  if (document.getElementById('switchBtn51').checed === false) {
    datas.slow_change = false
  }
  // BP change
  document.getElementById('slider2').value = datas.sBP
  showValue (datas.sBP, 2, true)

  var afBtn = document.getElementById('switchBtn1')
  if (afBtn.checked !== datas.Af) { // af
    tggleButton(afBtn, 'afWave')
  }
  var rRataxiaBtn = document.getElementById('switchBtn41')
  if (rRataxiaBtn.checked !== datas.ataxia) { // ataxic resp
    tggleButton(rRataxiaBtn, 'ataxia')
  }

  // when change slowly
  console.log('slow is ', datas.slow_change)
  if (datas.slow_change === true) {
    cElapsedSec = 0
    // make changing values arry / sec
    var cArg = newcreateArrDataEachSec(datas)
    // cArg = [[cHR, cSpO2, cRR], [cHR, cSpO2, cRR].....]

    var argLength = datas.time // times take change
    // console.log('arg.length is', argLength)
    console.log('arg is', cArg)
    // console.log('cElapsedSec is', cElapsedSec)

    var changeVal = function () {
      console.log('inner cElapsedSec is', cElapsedSec)

      if (cElapsedSec * 1 < argLength) {
        console.log('cArg is', cArg)
        console.log(cArg[0][0])
        console.log('in-in-in')

        showValue (cArg[cElapsedSec][0], 1, true)
        showValue (cArg[cElapsedSec][1], 3, true)
        showValue (cArg[cElapsedSec][2], 4, true)
        document.getElementById('slider1').value = cArg[cElapsedSec][0]
        document.getElementById('slider3').value = cArg[cElapsedSec][1]
        document.getElementById('slider4').value = cArg[cElapsedSec][2]

        cElapsedSec++
        // setTimeout(changeVal(arg, cElapsedSec), 1000)
        // var id = setTimeout(changeVal(arg, cElapsedSec), 1000)
        // id;
        setTimeout(changeVal, 1000)
      }
    }
    changeVal()
  } else {

    showValue (datas.hR, 1, true)
    showValue (datas.spO2, 3, true)
    showValue (datas.rR, 4, true)
    document.getElementById('slider1').value = datas.hR
    document.getElementById('slider3').value = datas.spO2
    document.getElementById('slider4').value = datas.rR
  }
}

/*
function changeToStanbyVal (arg) {
  // arg = [sBP,dBP,hR,spO2,rR, afOn, respAtaxiaOn, changeDurTime, changeTimeOn]
  if (document.getElementById('switchBtn51').checed === false) {
    arg[8] = false
  }
  // document.getElementById('bPslider').value = arg[0]
  //document.getElementById('sBP').value = arg[0]
  document.getElementById('slider2').value = arg[0]
  var sBP = document.getElementById('slider2').value
  parseInt(72.811 * Math.log(sBP) - 300) = arg[1]

  //document.getElementById('dBP').value = arg[1]

  if (document.getElementById('hRcheck').checked !== arg[5]) { // af
    document.getElementById('hRcheck').checked = arg[5]
    hRRhythmChangeSW()
  }
  if (document.getElementById('rRcheck').checked !== arg[6]) { // ataxic resp
    document.getElementById('rRcheck').checked = arg[6]
    rRRhythmChangeSW()
  }

  var changeTimeOn = arg[8]
  if (changeTimeOn === true) {
    cElapsedSec = 0
    var cArg = createArrDataEachSec(arg)
    // cArg = [[cHR, cSpO2, cRR], [cHR, cSpO2, cRR].....]

    var argLength = cArg.length
    console.log('arg.length is', argLength)
    console.log('arg is', cArg)
    console.log('cElapsedSec is', cElapsedSec)

    var changeVal = function () {
      console.log('inner cElapsedSec is', cElapsedSec)

      if (cElapsedSec * 1 < argLength) {
        console.log('cArg is', cArg)
        console.log(cArg[0][0])
        console.log('in-in-in')

        document.getElementById('hRSliderSide').value = cArg[cElapsedSec][0]
        document.getElementById('spO2SliderSide').value = cArg[cElapsedSec][1]
        document.getElementById('rRSliderSide').value = cArg[cElapsedSec][2]
       // document.getElementById('hRSlider').value = cArg[cElapsedSec][0]
        document.getElementById('slider1').value = cArg[cElapsedSec][0]

        document.getElementById('spO2Slider').value = cArg[cElapsedSec][1]
        //document.getElementById('rRSlider').value = cArg[cElapsedSec][2]
        document.getElementById('slider4').value = cArg[cElapsedSec][2]

        changeSliderBox(document.getElementById('spO2SliderSide'))
        changeSliderBox(document.getElementById('hRSliderSide'))
        changeSliderBox(document.getElementById('rRSliderSide'))

        cElapsedSec++
        // setTimeout(changeVal(arg, cElapsedSec), 1000)
        // var id = setTimeout(changeVal(arg, cElapsedSec), 1000)
        // id;
        setTimeout(changeVal, 1000)
      }
    }
    changeVal()
  } else {
    document.getElementById('hRSliderSide').value = arg[2]
    document.getElementById('spO2SliderSide').value = arg[3]
    document.getElementById('rRSliderSide').value = arg[4]
    // document.getElementById('hRSlider').value = arg[2]
    document.getElementById('slider1').value = arg[2]

    document.getElementById('spO2Slider').value = arg[3]
    // document.getElementById('rRSlider').value = arg[4]
    document.getElementById('slider4').value = arg[4]

    changeSliderBox(document.getElementById('spO2SliderSide'))
    changeSliderBox(document.getElementById('hRSliderSide'))
    changeSliderBox(document.getElementById('rRSliderSide'))
  }
}
*/

/* ========== IPC function ========== */
// ipc opeWin --> displayWindow

function displayWindowIPC (orderName, data) {
  ipcRenderer.send(orderName, data)
}

// var switchOn = false, sBP, dBP, hR, rR, spO2, afOn, respAtaxiaOn;

function switchOnIPC () {
  var switchOn = document.getElementById('switchBtn51').checked
  var sBP = document.getElementById('slider2').value
  var dBP = parseInt(0.0015 * sBP * sBP - 0.1698 * sBP + 77.319)
  var hR = document.getElementById('slider1').value
  var rR = document.getElementById('slider4').value
  var spO2 = document.getElementById('slider3').value
  var afOn = document.getElementById('switchBtn1').checked
  var respAtaxiaOn = document.getElementById('switchBtn41').checked

  var aArray = [switchOn, sBP, dBP, hR, rR, spO2, afOn, respAtaxiaOn]
  ipcRenderer.send('switchOntoMain', aArray)
}

function afOnIPC (bool) {
  ipcRenderer.send('afOn', bool)
}

function respAtaxiaOnIPC (bool) {
  ipcRenderer.send('ataxiaOn', bool)
}

function hRSpO2RRChangeIPC (arg) {
  // arg = [mainItem, aVal]
  ipcRenderer.send('valChange', arg)
  // console.log(arg)
}

function bPMesureAtDispWinIPC (arg) {
  // arg = [sBP, dBP]
  ipcRenderer.send('bPMesure', arg)
}

// ipc dataWin -- opeWin

ipcRenderer.on('changeToNextValue', (event, arg) =>{
  console.log('recieved!')
  console.log(arg)
  changeToStanbyVal(arg)

  var anArry = createArrDataEachSec(arg)
  ipcRenderer.send('kickback', anArry)
}
)
