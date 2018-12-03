
/* ========== function of html button ========== */
/* ---------- general function---------- */
function displayVal (aVSign, aText) {
  var targetId = aVSign + 'small'
  document.getElementById(targetId).textContent = aText
}

/* ---------- BP mesure animation function---------- */
function mesureBP () {
  if (monitorSwitchOn) {
    var sBP = document.getElementById('slider2').value
    var dBP = parseInt(0.0015 * sBP * sBP - 0.1698 * sBP + 77.319)

    var blinkText = function (dispTimeMs, dispText) {
      setTimeout(function () {
        displayVal('bP', dispText)
        displaySubWinVal('bP', dispText)
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
var monitorSwitchOn = false

// when BP measure, cancel Monitor Off function
function clickOnBPmonitor (DOM) {
  DOM.onclick = function (e) {
    if (monitorSwitchOn) {
      mesureBP()
    }
    e.stopImmediatePropagation() // stopPropagation() dosenot work first time
  }
}

function toggleOnOffSwitch () { // start drawing, ringing,
  // for BP measure area. it needs stoppropagation() no to work toggleSwich
  // if this lines dose not exit, click BP area result monitor stops.
  if (monitorSwitchOn === false) {
    var Dom = document.getElementById('bpValueBox')
    clickOnBPmonitor(Dom)
  }

  monitorSwitchOn = !monitorSwitchOn // toggle switch
  // clearTimeout
  clearTimeout(timeoutid)
  clearTimeout(timeoutid2)

  // toggle Switch function
  if (monitorSwitchOn) {
  // start waves drawing /////
    window.requestAnimationFrame(draw) // ecg (requestAnimationFrame() --> 60fps)
    window.requestAnimationFrame(spO2draw)
    window.requestAnimationFrame(respdraw)

    // Wave drawind, Sound, Change Values
    controlECGWaveParameters()
    // controlRespWaveAndValue()
  } else {
  // change values to default Strin '--' , when monitor turn off
    var aAry = ['hR', 'spO2', 'bP', 'rR']
    for (var i = 0; i < aAry.length; i++) {
      var aText = (aAry[i] === 'bP') ? '--- / ---' : '--'
      displayVal(aAry[i], aText)
      displaySubWinVal(aAry[i], aText)
    }
  }
}

/* ========== databox link function ========== */

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
  for (var i = 0; i < changeDurTime; i++) {
    var cHR = parseInt((i + 1) / changeDurTime * (finHR - stHR)) + stHR
    var cSpO2 = parseInt((i + 1) / changeDurTime * (finSpO2 - stSpO2)) + stSpO2
    var cRR = parseInt((i + 1) / changeDurTime * (finRR - stRR)) + stRR

    datePerSec.push([cHR, cSpO2, cRR])
  }

  return datePerSec
}

var cElapsedSec
// var toid = null
function newchangeToStandbyVal (datas) {
  // arg = [sBP,dBP,hR,spO2,rR, afOn, respAtaxiaOn, changeDurTime, changeTimeOn]
  // when monitor off
  if (document.getElementById('switchBtn51').checed === false) {
    datas.slow_change = false
  }
  // BP change
  document.getElementById('slider2').value = datas.sBP
  showValue(datas.sBP, 2, true)

  // af, ataxia button
  var afBtn = document.getElementById('switchBtn1')
  var dataAfBool = (datas.Af === 'true')
  if (afBtn.checked !== dataAfBool) { // af
    tggleButton(afBtn, 'afWave')
  }
  var rRataxiaBtn = document.getElementById('switchBtn41')
  var dataAtaxiBool = (datas.ataxia === 'true')
  if (rRataxiaBtn.checked !== dataAtaxiBool) { // ataxic resp
    tggleButton(rRataxiaBtn, 'ataxia')
  }

  // when change slowly
  if (datas.slow_change === 'true') {
    cElapsedSec = 0
    // make changing values arry / sec
    var cArg = newcreateArrDataEachSec(datas)
    // cArg = [[cHR, cSpO2, cRR], [cHR, cSpO2, cRR].....]

    var argLength = datas.time // times take change

    var changeVal = function () {

      if (cElapsedSec * 1 < argLength) {

        showValue(cArg[cElapsedSec][0], 1, true)
        showValue(cArg[cElapsedSec][1], 3, true)
        showValue(cArg[cElapsedSec][2], 4, true)
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
    showValue(datas.hR, 1, true)
    showValue(datas.spO2, 3, true)
    showValue(datas.rR, 4, true)
    document.getElementById('slider1').value = datas.hR
    document.getElementById('slider3').value = datas.spO2
    document.getElementById('slider4').value = datas.rR
  }
}
