var yValArry = []
var beepOK = true
var beepCount = 0

function qrsdetection (yVal, xVal) {
  // first step -> square yVal
  var syVal = (yVal - 85) * (yVal - 85) / 10
  // drawOrder(ctx, xPositionInCanvas, pxMoveXPerFrame, lastsYPosition, syVal, 'yellow', aCanvas)    // square yVal
  // lastsYPosition = syVal

  // second step -> moving average Filter
  var myVal = mAF(syVal)

  // var cutOffPoint = 50
  /*
  var myValColor = 'white'
  if (myVal < cutOffPoint) {
    myValColor = 'red'
  }
  */
  // drawOrder(ctx, xPositionInCanvas, pxMoveXPerFrame, lastmYPosition, myVal, myValColor, aCanvas)  // square + moving Average Filter yVal
  // lastmYPosition = myVal

  // third step -> beep

  // Beep ECG Sound By SpO2 value
  var beepBySpO2 = function () {
    // avoid to make delay, read wav files directry
    var spO2Val = document.getElementById('slider3').value
    var spO2Sound = 'wav/' + spO2Val + '.wav'
    var sound = new Audio(spO2Sound)
    sound.volume = document.getElementById('slider5').value
    sound.play()

    spO2Val = spO2Sound = sound = null
    // document.getElementById(dinum).play()  //this handler makes some delay
  }

  // avoid beep all frames of one wave with value over 50
  if (myVal <= 50) {
    beepOK = true
  }
  if (myVal > 50 && beepOK === true) {
    beepBySpO2()
    beepOK = false
    qrsTimeArray.push(Date.now())
    displayHRAve()
  }
}

// moving average filter
function mAF (syVal) {
  var framecount = 5
  yValArry.push(syVal)
  while (yValArry.length > framecount) {
    yValArry.shift()
  }
  if (yValArry.length < framecount) {
    return 0
  } else {
    var sum = 0
    for (var j in yValArry) {
      sum = sum + yValArry[j]
    }
    return sum / framecount
  }
}

var qrsTimeArray = []
function displayHRAve () {
  if (qrsTimeArray.length < 4) {
    return
  }
  while (qrsTimeArray.length > 4) {
    qrsTimeArray.shift()
  }
  var hRsum

  for (var i = 0; i < 3; i++) {
    var j = 3 - i
    var hR = Math.round(60000 / (qrsTimeArray[j] - qrsTimeArray[j - 1]))
    if (hRsum) {
      hRsum = hRsum + hR
    } else {
      hRsum = hR
    }
  }

  var aveHR = hRsum / 3

  displayVal('hR', parseInt(aveHR))
  var tempspO2 = document.getElementById('slider3').value
  displayVal('spO2', tempspO2)
}
