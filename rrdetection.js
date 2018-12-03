var rryValArry = []
var rrDetection = false

function rrdetection (yVal, xVal) {
  // first step -> square yVal
  var syVal = (yVal - 85) * (yVal - 85) / 10
  // drawOrder(ctx, xPositionInCanvas, pxMoveXPerFrame, lastsYPosition, syVal, 'yellow', aCanvas)    // square yVal
  // lastsYPosition = syVal

  // second step -> moving average Filter
  var myVal = rrmAF(syVal)

  // var cutOffPoint = 50
  /*
  var myValColor = 'white'
  if (myVal < cutOffPoint) {
    myValColor = 'red'
  }
  */
  // drawOrder(ctx, xPositionInCanvas, pxMoveXPerFrame, lastmYPosition, myVal, myValColor, aCanvas)  // square + moving Average Filter yVal
  // lastmYPosition = myVal

  // avoid beep all frames of one wave with value over 50
  var cutpoint = 90
  if (myVal <= cutpoint) {
    rrDetection = true
  }
  if (myVal > cutpoint && rrDetection === true) {
    rrDetection = false
    rrTimeArray.push(Date.now())
    console.log(rrTimeArray)
    displayrRAve()
  }
}

// moving average filter
function rrmAF (syVal) {
  var framecount = 10
  rryValArry.push(syVal)
  while (rryValArry.length > framecount) {
    rryValArry.shift()
  }
  if (rryValArry.length < framecount) {
    return 0
  } else {
    var sum = 0
    for (var j in rryValArry) {
      sum = sum + rryValArry[j]
    }
    return sum / framecount
  }
}

var rrTimeArray = []
function displayrRAve () {
  if (rrTimeArray.length < 4) {
    return
  }
  while (rrTimeArray.length > 4) {
    rrTimeArray.shift()
  }
  var rRsum

  for (var i = 0; i < 3; i++) {
    var j = 3 - i
    var rr = Math.round(60000 / (rrTimeArray[j] - rrTimeArray[j - 1]))
    if (rRsum) {
      rRsum = rRsum + rr
    } else {
      rRsum = rr
    }
  }
  var aveRR = Math.round(rRsum / 3)

  displayVal('rR', parseInt(aveRR))
  displaySubWinVal ('rR', aveRR)
}
