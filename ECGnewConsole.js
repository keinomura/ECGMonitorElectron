/* Code by Steven Estrella. http://www.shearspiremedia.com */
/* we need to change slider appearance oninput and onchange */
function showValue (val, slidernum, vertical) {
/* setup variables for the elements of our slider */
  var thumb = document.getElementById('sliderthumb' + slidernum)
  var shell = document.getElementById('slidershell' + slidernum)
  var track = document.getElementById('slidertrack' + slidernum)
  var fill = document.getElementById('sliderfill' + slidernum)
  var rangevalue = document.getElementById('slidervalue' + slidernum)
  var slider = document.getElementById('slider' + slidernum)

  var pc = (val - slider.min) / (slider.max - slider.min) /* the percentage slider value */

  var thumbsize = 40 /* must match the thumb size in your css */
  var bigval = 200 /* widest or tallest value depending on orientation */
  var smallval = 75 /* narrowest or shortest value depending on orientation */
  /* var tracksize = vertical ? bigval + thumbsize*1/2 :bigval - thumbsize/2 */
  var bordersize = 3/* px */

  var tracksize = bigval - thumbsize / 2 - 6

  var fillsize = 15 // height of bar
  var filloffset = 26 // top margin
  var loc = vertical ? (1 - pc) * (tracksize - thumbsize / 2) : pc * (tracksize - thumbsize / 2)
  /* var loc = (1 - pc) * (tracksize - thumbsize/2) */

  /* var locV =  loc - 20 */
  // console.log(slidernum, slider.max, slider.min, val, loc)
  /*
  var degrees = 360 * pc
  var rotation = 'rotate(' + degrees + 'deg)'
  */

  rangevalue.innerHTML = (thumb.id === 'sliderthumb5') ? 'Vol' : val
  // rangevalue.innerHTML = val
  /*
  thumb.style.webkitTransform = rotation
  thumb.style.MozTransform = rotation
  thumb.style.msTransform = rotation
  */

  fill.style.opacity = pc + 0.2 > 1 ? 1 : pc + 0.2

  rangevalue.style.top = (vertical ? loc : 0) + 'px'
  rangevalue.style.left = (vertical ? 15 : loc) + 'px'

  thumb.style.top = (vertical ? loc : 0) + 'px'
  thumb.style.left = (vertical ? 15 : loc) + 'px'

  fill.style.top = (vertical ? loc : filloffset + bordersize) + 'px'
  fill.style.left = (vertical ? filloffset + bordersize : 0) + 'px'
  /* fill.style.width = (vertical ? fillsize : loc + (thumbsize/2)) + 'px' */
  fill.style.width = (vertical ? fillsize : loc) + 'px'
  fill.style.height = (vertical ? bigval - 6 /* - filloffset - fillsize */ - loc : fillsize) + 'px'
  /*
  shell.style.height = (vertical ? bigval : smallval) + 'px'
  shell.style.width = (vertical ? smallval : bigval) + 'px'
*/
  shell.style.height = (smallval - 6) + 'px'
  shell.style.width = (bigval - 6) + 'px'

  track.style.height = (vertical ? bigval - 6 : fillsize) + 'px' /* adjust for border */
  /* track.style.width = (vertical ? fillsize : bigval - (thumbsize/2)) + 'px' /* adjust for border */
  track.style.width = (vertical ? fillsize : bigval) + 'px' /* adjust for border */

  track.style.left = (vertical ? filloffset + bordersize : 0) + 'px'
  track.style.top = (vertical ? 0 : filloffset + bordersize) + 'px'


  var aArry = ['', 'hR', '', 'spO2', 'rR', '']
  if (aArry !== '') {
    hRSpO2RRChangeIPC([aArry[slidernum], val])
  }
}
/* we often need a function to set the slider values on page load */
function setValue (val, num, vertical) {
  document.getElementById('slider' + num).value = val
  showValue(val, num, vertical)
}

var afWave = true
var ataxia = true

function tggleButton (switchElement, switchElementName) {
  // console.log(switchElement)

  var switchOnOff
  if (switchElement.checked) {
    switchOnOff = true
  } else {
    switchOnOff = false
  }
  var style = switchElement.style
  cancelOtherSwitch(switchElement)
  // console.log('before', switchOnOff)
  if (switchOnOff) {
    switchElement.checked = !switchOnOff
    style.opacity = 0.5
    style.color = 'white'
  } else {
    switchElement.checked = !switchOnOff
    style.opacity = 1.0
    style.color = 'yellow'
    // console.log(switchElement.checked)
  }
  // console.log('Name ', switchElementName)

  if (switchElementName === 'afWave') {
    afOn = switchElement.checked
    afOnIPC(switchElement.checked)
  } else if (switchElementName === 'ataxia') {
    respAtaxiaOn = switchElement.checked
    respAtaxiaOnIPC(switchElement.checked)
  } else if (switchElementName === 'onOff') {
    toggleOnOffSwitch()
  }

  // console.log('after', switchElement.checked)
  // console.log(' afOn is ', afOn)
}

function cancelOtherSwitch (switchElement) {
  var swithcChildNodesArry = switchElement.parentNode.childNodes
  for (var i = 0; i < swithcChildNodesArry.length; i++) {
    var aNode = swithcChildNodesArry[i]
    // console.log(aNode.nodeType)
    if (aNode.nodeType === 1) {
      aNode.checked = false
      aNode.style.opacity = 0.5
      aNode.style.color = 'white'
    }
    // console.log(aNode, aNode.checked)
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setValue(88, 1, true)
  setValue(80, 2, true)
  setValue(95, 3, true)
  setValue(12, 4, true)
  setValue(1, 5, true)
}
)
