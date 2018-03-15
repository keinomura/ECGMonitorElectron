var defaultDataArry = [
  {'CaseName': 'Case1Hama',
    'dataArry': [
      {'subtitle': '搬入時', 'hR': 85, 'Af': false, 'sBP': 156, 'dBP': 99, 'spO2': 98, 'rR': 20, 'ataxia': false, 'time': 0, 'slow_change': false},
      {'subtitle': 'CT前', 'hR': 85, 'Af': false, 'sBP': 156, 'dBP': 99, 'spO2': 98, 'rR': 20, 'ataxia': false, 'time': 0, 'slow_change': false},
      {'subtitle': 'CT後', 'hR': 85, 'Af': false, 'sBP': 156, 'dBP': 99, 'spO2': 98, 'rR': 20, 'ataxia': false, 'time': 0, 'slow_change': false}
    ]
  },
  {'CaseName': 'Case2Hama',
    'dataArry': [
      {'subtitle': '搬入時', 'hR': 80, 'Af': false, 'sBP': 229, 'dBP': 117, 'spO2': 98, 'rR': 15, 'ataxia': false, 'time': 0, 'slow_change': false},
      {'subtitle': '降圧', 'hR': 85, 'Af': false, 'sBP': 135, 'dBP': 75, 'spO2': 98, 'rR': 15, 'ataxia': false, 'time': 0, 'slow_change': false}
    ]
  },
  {'CaseName': 'Case3Hama',
    'dataArry': [
      {'subtitle': '搬入時', 'hR': 112, 'Af': false, 'sBP': 238, 'dBP': 122, 'spO2': 87, 'rR': 4, 'ataxia': true, 'time': 0, 'slow_change': false},
      {'subtitle': '気道確保', 'hR': 110, 'Af': false, 'sBP': 238, 'dBP': 122, 'spO2': 92, 'rR': 4, 'ataxia': true, 'time': 3, 'slow_change': true},
      {'subtitle': 'BVM換気', 'hR': 110, 'Af': false, 'sBP': 240, 'dBP': 125, 'spO2': 98, 'rR': 10, 'ataxia': false, 'time': 5, 'slow_change': true},
      {'subtitle': '挿管前降圧', 'hR': 115, 'Af': false, 'sBP': 140, 'dBP': 95, 'spO2': 98, 'rR': 10, 'ataxia': false, 'time': 0, 'slow_change': true},
      {'subtitle': '気管挿管 Crush', 'hR': 110, 'Af': false, 'sBP': 240, 'dBP': 125, 'spO2': 100, 'rR': 10, 'ataxia': false, 'time': 0, 'slow_change': false},
      {'subtitle': '気管挿管　RSI', 'hR': 90, 'Af': false, 'sBP': 128, 'dBP': 78, 'spO2': 100, 'rR': 10, 'ataxia': false, 'time': 0, 'slow_change': false},
      {'subtitle': '挿管後降圧', 'hR': 95, 'Af': false, 'sBP': 128, 'dBP': 78, 'spO2': 100, 'rR': 10, 'ataxia': false, 'time': 0, 'slow_change': false}
    ]
  },
  {'CaseName': 'Case4Hama',
    'dataArry': [
      {'subtitle': '搬入時', 'hR': 70, 'Af': false, 'sBP': 182, 'dBP': 86, 'spO2': 92, 'rR': 14, 'ataxia': true, 'time': 0, 'slow_change': false},
      {'subtitle': '酸素投与', 'hR': 68, 'Af': false, 'sBP': 180, 'dBP': 80, 'spO2': 100, 'rR': 14, 'ataxia': true, 'time': 0, 'slow_change': false},
      {'subtitle': '降圧', 'hR': 75, 'Af': false, 'sBP': 135, 'dBP': 78, 'spO2': 100, 'rR': 14, 'ataxia': false, 'time': 3, 'slow_change': true}
    ]
  },
  {'CaseName': 'Case5Hama',
    'dataArry': [
      {'subtitle': '搬入時', 'hR': 85, 'Af': true, 'sBP': 219, 'dBP': 130, 'spO2': 95, 'rR': 18, 'ataxia': false, 'time': 0, 'slow_change': false},
      {'subtitle': '降圧', 'hR': 85, 'Af': true, 'sBP': 175, 'dBP': 98, 'spO2': 95, 'rR': 18, 'ataxia': false, 'time': 0, 'slow_change': false}
    ]
  },
  {'CaseName': 'Case6Hama',
    'dataArry': [
      {'subtitle': '搬入時', 'hR': 80, 'Af': true, 'sBP': 165, 'dBP': 80, 'spO2': 98, 'rR': 13, 'ataxia': false, 'time': 0, 'slow_change': false}
    ]
  }

]

function createSelectorWithJSON () {
  var selectorDOM = document.getElementById('caseNoSorces')
  var aArry = []
  for (var j = 0; j < defaultDataArry.length; j++) {
    // console.log(defaultDataArry[j].CaseName)
    aArry.push(defaultDataArry[j].CaseName)
  }

  // console.log(aArry)
  for (var i = 0; i < aArry.length; i++) {
    var opt = document.createElement('option')
    opt.value = aArry[i]
    opt.innerHTML = aArry[i]
    selectorDOM.appendChild(opt)
  }
}

function showVital(DOM) {
  // delete old Nodes
  var parentNode = document.getElementById('caseTable')
  //console.log(parentNode.firstChild)

  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild)
  }

  var selectedCase = DOM.value // ->'Case1Hama'
  // choice arry with name 'Case1Hama'
  for (var i = 0; i < defaultDataArry.length; i++) {
    if (defaultDataArry[i].CaseName === selectedCase) {
      var theCase = defaultDataArry[i]
      break
    }
  }
  // get dataArry of theCase, we can not get them with theCase.dataArry !!
  var arry = []
  arry = theCase.dataArry.slice(0, theCase.dataArry.length)

  // <div> <tbody> <tr> <td> <input>
  // appendChild to <div>
  // have to create Element from tbody

  // tbody

  var atbody = document.createElement('tbody')
  atbody.id = 'vitalSheetBody2'

  for (var j = 0; j < arry.length; j++) {
    var eachVitals = arry[j]
    var eachVitalsKey = Object.keys(eachVitals)
    // tr
    var trTmp = document.createElement('tr')
    trTmp.id = eachVitals.subtitle
    trTmp.class = 'titleSheet'

    for (var k = 0; k < eachVitalsKey.length; k++) {
      // td, input
      var newTdElement = document.createElement('td')
      var newInputElementText = document.createElement('text')
      var newInputElement = document.createElement('input')
      newInputElement.class = 'inputBox'
      var a = eachVitals[eachVitalsKey[k]]
      if (typeof a !== 'boolean') {
        newInputElement.type = 'text'
        newInputElement.value = eachVitals[eachVitalsKey[k]]
      } else {
        newInputElement.type = 'checkbox'
        newInputElement.checked = !eachVitalsKey[k]
        newInputElementText.innerHTML = eachVitalsKey[k]
      }
      newInputElement.className = eachVitalsKey[k]
      newInputElement.id = eachVitalsKey[k] + j

      newTdElement.appendChild(newInputElementText)
      newTdElement.appendChild(newInputElement)
      trTmp.appendChild(newTdElement)
    }

    var newButtonElement = document.createElement('button')
    newButtonElement.id = 'applyButton' + j
    newButtonElement.className = 'applyButton'
    newButtonElement.innerHTML = 'apply'

    newButtonElement.onclick = function () { intoTheConsole(this) }
    trTmp.appendChild(newButtonElement)
    // appendChild each tr to tbody
    atbody.appendChild(trTmp)
  }
  document.getElementById('caseTable').appendChild(atbody)

}

function intoTheConsole (DOM) {
  var domid = DOM.id
  var num = domid.split('applyButton')
  var datas = {}
  var elems = ['subtitle', 'hR', 'Af', 'rR', 'ataxia', 'spO2', 'sBP', 'dBP', 'time', 'slow_change']
  for (let i = 0; i < elems.length; i++) {
    var idelement = elems[i] + num[1]
    var targetElement = document.getElementById(idelement)
    if (targetElement.type === 'text') {
      datas[elems[i]] = targetElement.value
    } else {
      datas[elems[i]] = targetElement.checked
    }
  }
  console.log('datas is ', datas)
  newchangeToStanbyVal (datas)
}

document.addEventListener('DOMContentLoaded', function () {
  createSelectorWithJSON()
  var DOM = document.getElementById('caseNoSorces')
  showVital(DOM)
}
)
