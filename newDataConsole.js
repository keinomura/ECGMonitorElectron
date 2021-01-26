const fs = require('fs')
var path = require('path')

// 1. load json file includes vital signs
// var thePath = __dirname + '/dbjson.json'
var thePath = path.join(__dirname, '/dbjson.json')
var objectJson = JSON.parse(fs.readFileSync(thePath, 'utf8'))
var seriesArry = objectJson.vitalData

// 2. connectDB
connectDB()

function connectDB () {
  var dbName = 'VitalDB'
  const version = 3
  var openReq = indexedDB.open(dbName, version)

  openReq.onupgradeneeded = function (event) {
    // onupgradeneeded allows readwrite, transaction
    // onupgradeneededは、DBのバージョン更新(DBの新規作成も含む)時のみ実行

    deleteDB()
    // objectStoreで変数はあまり使えない。StoreはoriginalStore, userStoreの2つ

    var db = event.target.result
    var originalStore = db.createObjectStore('original', {keyPath: 'Series'})
    // var userStore = db.createObjectStore('user', {keyPath: 'Series'})

    // add all Series datas to original Store
    for (var i in seriesArry) {
      originalStore.add(seriesArry[i])
    }

    // debug when upgrade
    originalStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result
      if (cursor) {
        // console.log('cursor key is ', cursor.key)
        // console.log('cursor is', cursor)
        cursor.continue()
      }
    }
  }

  // var db
  openReq.onsuccess = function (event) {
    var db = event.target.result

    // transaction original store
    var transaction = db.transaction(['original'], 'readwrite')
    var originalStore = transaction.objectStore('original')

    originalStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result
      var val = cursor.value
      var seri = val.Series
      // console.log(cursor, 'val is ', val, 'Series is', seri)
    }

    // console.log(originalStore.openCursor())
    // 接続を解除する
    db.close()
  }
  openReq.onerror = function (event) {
    // 接続に失敗
    // console.log('db open error')
  }
}

// 3. create series selector
// createSeriesSelector()

function createSeriesSelector () {
  var seriesSlectorDiv = document.getElementById('seriesSelectorDiv')
  // remove all child nodes
  // console.log(seriesSlectorDiv)
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

    // test code
    var request = originalStore.get('2013')
    var case_request = request.get('Case6')
    console.log(case_request.dataArry)
    //


    var allDataArry = []
    originalStore.openCursor().onsuccess = function (event) {
      // series selector
      var getSeriesSelectorOption = function () {
        var cursor = event.target.result
        if (cursor) {
          allDataArry.push(cursor.value)
          cursor.continue()
        } else {
          // cursor end
          var createdSelector = createSelector(allDataArry, 'seriesSelector', 'Series', function () { createCasesSelector(allDataArry) })
          seriesSlectorDiv.appendChild(createdSelector)
          createCasesSelector(allDataArry)
        }
      }
      getSeriesSelectorOption(allDataArry)
    }
  }
}

function createSelector (opArry, selId, key, functionName) {
  var aSelector = document.createElement('select')
  aSelector.id = selId
  aSelector.onchange = functionName

  for (var i in opArry) {
    var aOption = document.createElement('option')
    aOption.value = opArry[i][key]
    aOption.innerHTML = opArry[i][key]
    aSelector.appendChild(aOption)
  }
  return aSelector
}

function createCasesSelector (allDataArry) {
  var casesNoselectDiv = document.getElementById('casesSelectorDiv')
  var seriesSelector = document.getElementById('seriesSelector')
  var caseSelector = document.getElementById('casesSelector')

  // remove case selector
  if (caseSelector) {
    casesNoselectDiv.removeChild(caseSelector)
  }

  var seriesName = seriesSelector.value
  if (seriesName) {
  } else {
    seriesName = seriesSelector.option[0].value
  }

  for (var i in allDataArry) {
    if (seriesName === allDataArry[i].Series) {
      var allCasesArryOfSelectedSeries = allDataArry[i].Cases
    }
  }

  var eachCaseArry = []
  for (var j in allCasesArryOfSelectedSeries) {
    eachCaseArry.push(allCasesArryOfSelectedSeries[j])
  }
  var createdCasesSelector = createSelector(eachCaseArry, 'casesSelector', 'CaseName', function () { showDetailDatas(eachCaseArry) })
  casesNoselectDiv.appendChild(createdCasesSelector)
  showDetailDatas(eachCaseArry)
}

function showDetailDatas (eachCaseArry) {
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

  // var selectedSeriesName = seriesSelector.value

  var allCasesArryOfSelectedSeries = eachCaseArry
  var selectedCaseDataArry
  for (var i in allCasesArryOfSelectedSeries) {
    var aCaseArry = allCasesArryOfSelectedSeries[i]
    if (aCaseArry.CaseName === selectedCaseName) {
      selectedCaseDataArry = aCaseArry.dataArry
    }
  }
  var createdTable = createTable(selectedCaseDataArry, 'dataDiv')
  caseTableDiv.appendChild(createdTable)
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

    for (var j in eachVitalsKeyArry) {
      var eachTd = document.createElement('td')
      var eachInput = document.createElement('input')
      var eachVitals = eachVitalsDataArry[eachVitalsKeyArry[j]]

      eachInput.type = 'text'
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

  newchangeToStandbyVal(datas)
}

function deleteDB () {
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
