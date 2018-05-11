/*
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
*/

const fs = require('fs')
//const remote = require('electron').remote
//const app = remote.app

// 1. load json file includes vital signs

//var thePath = appPath + '/dbjson.json'
//console.log('thePath is ', thePath)
var objectJson = JSON.parse(fs.readFileSync('/Users/kei/Desktop/ECGMonitorElectronDesktopVer1.0/app/dbjson.json', 'utf8'))
// var objectJson = JSON.parse(fs.readFileSync('dbjson.json', 'utf8'))
// const objectJson = require('dbjson.json')
var seriesArry = objectJson.vitalData

// 2. connectDB
connectDB()

function connectDB () {
  var dbName = 'VitalDB'
  var openReq = indexedDB.open(dbName)

  openReq.onupgradeneeded = function (event) {
    // onupgradeneeded allows readwrite, transaction
    // onupgradeneededは、DBのバージョン更新(DBの新規作成も含む)時のみ実行

    // objectStoreで変数はあまり使えない。StoreはoriginalStore, userStoreの2つ
    var db = event.target.result
    var originalStore = db.createObjectStore('original', {keyPath: 'Series'})
    var userStore = db.createObjectStore('user', {keyPath: 'Series'})

    // add all Series datas to original Store
    for (var i in seriesArry) {
      originalStore.add(seriesArry[i])
    }

    // debug when upgrade
    /*
    originalStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result
      if (cursor) {
        console.log ('cursor key is ', cursor.key)
        console.log('cursor is', cursor)
        cursor.continue()
      }
    }
    */
  }

  var db
  openReq.onsuccess = function (event) {
    console.log('db open success')
    /*
    var db = event.target.result
    // console.log('store names are ', db.objectStoreNames)

    // transaction original store
    var transaction = db.transaction(['original'], 'readwrite')
    var originalStore = transaction.objectStore('original')

    originalStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result
      var val = cursor.value
      var seri = val.Series
      console.log(cursor, 'val is ', val, 'Series is', seri)
    }
    */
    // console.log(originalStore.openCursor())
    // 接続を解除する
    db.close()
  }
  openReq.onerror = function (event) {
    // 接続に失敗
    console.log('db open error')
  }
}

// 3. create series selector
// createSeriesSelector()

function createSeriesSelector () {
  var seriesSlectorDiv = document.getElementById('seriesSelectorDiv')
  // remove all child nodes
  console.log(seriesSlectorDiv)
  if (seriesSlectorDiv.firstChild) {
    while (seriesSlectorDiv.firstChild) {
      seriesSlectorDiv.removeChild(seriesSlectorDiv.firstChild)
    }
  }

  var dbName = 'VitalDB'
  var openReq = indexedDB.open(dbName)

  var db
  openReq.onsuccess = function (event) {
    db = event.target.result
    var transaction = db.transaction(['original'], 'readwrite')
    var originalStore = transaction.objectStore('original')

    var childArry = []
    originalStore.openCursor().onsuccess = function (event) {
      // series selector
      var getSeriesSelectorOption = function () {
        var cursor = event.target.result
        if (cursor) {
          var aOption = cursor.key
          childArry.push(aOption)
          cursor.continue()
        } else {
          // cursor end
          // console.log('chidlArry is ', childArry)
          var createdSelector = createSelector(childArry, 'seriesSelector', function () { createCasesSelector() })
          seriesSlectorDiv.appendChild(createdSelector)
          createCasesSelector()
        }
      }
      getSeriesSelectorOption()
    }
  }
}

function createSelector (opArry, selId, functionName) {
  var aSelector = document.createElement('select')
  aSelector.id = selId
  aSelector.onchange = functionName

  for (var i in opArry) {
    var aOption = document.createElement('option')
    aOption.value = opArry[i]
    aOption.innerHTML = opArry[i]
    aSelector.appendChild(aOption)
  }
  return aSelector
}

function createCasesSelector () {
  console.log('createCasesSelector')
  var dbName = 'VitalDB'
  var openReq = indexedDB.open(dbName)

  var db
  openReq.onsuccess = function (event) {
    db = event.target.result
    var transaction = db.transaction(['original'], 'readwrite')
    var originalStore = transaction.objectStore('original')

    var getCasesNo = function () {
      // console.log('onchange')
      var casesNoselectDiv = document.getElementById('casesSelectorDiv')
      var seriesSelector = document.getElementById('seriesSelector')
      var caseSelector = document.getElementById('casesSelector')
      // reset case selector
      if (caseSelector) {
        casesNoselectDiv.removeChild(caseSelector)
      }

      var seriesName = seriesSelector.value
      if (seriesName) {
      } else {
        seriesName = seriesSelector.option[0].value
      }

      originalStore.get(seriesName).onsuccess = function (event) {
        var allCasesArryOfSelectedSeriesWithSeriesName = event.target.result
        var allCasesArryOfSelectedSeries = allCasesArryOfSelectedSeriesWithSeriesName.Cases
        var caseNameArry = []
        for (var j in allCasesArryOfSelectedSeries) {
          var aCaseArry = allCasesArryOfSelectedSeries[j]
          caseNameArry.push(aCaseArry.CaseName)
        }
        var createdCasesSelector = createSelector(caseNameArry, 'casesSelector', function () { showDetailDatas() })
        casesNoselectDiv.appendChild(createdCasesSelector)
        showDetailDatas()
      }
    }
    getCasesNo()
  }
}

function showDetailDatas () {
  var dbName = 'VitalDB'
  var openReq = indexedDB.open(dbName)

  var db
  openReq.onsuccess = function (event) {
    db = event.target.result
    var transaction = db.transaction(['original'], 'readwrite')
    var originalStore = transaction.objectStore('original')

    var getDetailDatasOfACase = function () {
      console.log('onchange')
      var seriesSelector = document.getElementById('seriesSelector')
      var caseSelector = document.getElementById('casesSelector')
      var caseTableDiv = document.getElementById('caseTablediv')
      var caseTable = document.getElementById('caseTable')
      // reset tables
      if (caseTableDiv) {
        caseTableDiv.removeChild(caseTable)
      }

      // ger selected case name
      var selectedCaseName = caseSelector.value
      if (selectedCaseName) {
      } else {
        selectedCaseName = caseSelector.option[0].value
      }

      var selectedSeriesName = seriesSelector.value

      originalStore.get(selectedSeriesName).onsuccess = function (event) {
        var allCasesArryOfSelectedSeriesWithSeriesName = event.target.result
        var allCasesArryOfSelectedSeries = allCasesArryOfSelectedSeriesWithSeriesName.Cases

        var selectedCaseDataArry
        for (var i in allCasesArryOfSelectedSeries) {
          var aCaseArry = allCasesArryOfSelectedSeries[i]
          if (aCaseArry.CaseName === selectedCaseName) {
            selectedCaseDataArry = aCaseArry.dataArry
          }
        }
        // console.log(selectedCaseDataArry, 'dataDiv')
        var createdTable = createTable(selectedCaseDataArry, 'dataDiv')
        caseTableDiv.appendChild(createdTable)
      }
    }
    getDetailDatasOfACase()
  }
}

function createTable (arry, divId) {
  var dataTable = document.createElement('table')
  dataTable.id = 'caseTable'
  var dataTbody = document.createElement('tbody')

  for (var i in arry) {
    var eachSituationDataTr = document.createElement('tr')
    eachSituationDataTr.id = 'test' + i
    var eachVitalsDataArry = arry[i]
    var eachVitalsKeyArry = Object.keys(eachVitalsDataArry)
    // console.log('eachvitals is 12 ', eachInputkey)

    for (var j in eachVitalsKeyArry) {
      var eachTd = document.createElement('td')
      var eachInput = document.createElement('input')
      var eachVitals = eachVitalsDataArry[eachVitalsKeyArry[j]]

      eachInput.type = 'text'
      console.log('eachvitalskey is ', eachVitalsKeyArry[j])
      // var eachInputkey = Object.keys(eachVitals)
      eachInput.className = eachVitalsKeyArry[j]
      eachInput.value = eachVitals
      eachInput.id = eachVitalsKeyArry[j] + i

      if (eachInput.className === 'Af') {
        var initialAfBool = eachInput.value
        eachInput.value = (initialAfBool === 'true') ? 'Af' : 'Sinus'
        eachInput.onclick = function afChange () {
          this.value = (this.value === 'Af') ? 'Sinus' : 'Af'
        }
      } else if (eachInput.className === 'ataxia') {
        var initialResBool = eachInput.value // reg -> false
        eachInput.value = (initialResBool === 'true') ? 'ataxia' : 'normal' // true -> ataxia
        eachInput.onclick = function afChange () {
          this.value = (this.value === 'ataxia') ? 'normal' : 'ataxia'
        }
      }

      console.log('classname is ', eachInput.className)
      console.log('eachInput is ', eachInput)
      if (eachInput.className !== 'slow_change') {
        eachTd.appendChild(eachInput)
        eachSituationDataTr.appendChild(eachTd)
      }
    }
    var newButtonElement = document.createElement('button')
    newButtonElement.id = 'applyButton' + i
    newButtonElement.className = 'applyButton'
    newButtonElement.innerHTML = 'apply'

    newButtonElement.onclick = function () { intoTheConsole(this) }
    eachSituationDataTr.appendChild(newButtonElement)

    dataTbody.appendChild(eachSituationDataTr)
  }
  dataTable.appendChild(dataTbody)
  return dataTable
}

/*
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
*/

function intoTheConsole (DOM) {
  var domid = DOM.id
  var num = domid.split('applyButton')
  var datas = {}
  var elems = ['subtitle', 'hR', 'Af', 'rR', 'ataxia', 'spO2', 'sBP', 'dBP', 'time']
  // var elems = ['subtitle', 'hR', 'Af', 'rR', 'ataxia', 'spO2', 'sBP', 'dBP', 'time', 'slow_change']
  for (let i = 0; i < elems.length; i++) {
    var idelement = elems[i] + num[1]
    var targetElement = document.getElementById(idelement)
    if (targetElement.type === 'text') {
      datas[elems[i]] = targetElement.value
    } else {
      datas[elems[i]] = targetElement.checked
    }
  }

  datas['Af'] = (datas['Af'] === 'Af') ? 'true' : 'false'
  datas['ataxia'] = (datas['ataxia'] === 'ataxia') ? 'true' : 'false'
  datas['slow_change'] = (datas['time'] === '0') ? 'false' : 'true'

  console.log('datas is ', datas)
  newchangeToStanbyVal(datas)
}
/*
document.addEventListener('DOMContentLoaded', function () {
  createSelectorWithJSON()
  var DOM = document.getElementById('caseNoSorces')
  showVital(DOM)
}
*/

function deleteDB () {
  console.log('pressed!')
  var deleteReq = indexedDB.deleteDatabase('VitalDB')

  deleteReq.onsuccess = function () {
    console.log('delete succusess!!')
  }
  deleteReq.onerror = function () {
    console.log('db delete error')
  }
}


document.addEventListener('DOMContentLoaded', function () {
  createSeriesSelector()

  // var DOM = document.getElementById('caseNoSorces')
  // showVital(DOM)
}
)
