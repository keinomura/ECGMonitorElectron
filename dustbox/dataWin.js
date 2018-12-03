//call ipc module
const {ipcRenderer} = require('electron');

// load from json file
var json = require('./sampleValues.json');
console.log(json);


// function to run console datas
function goButton(){
  var sBP = document.getElementById('sBP').value;
  var dBP = document.getElementById('dBP').value;
  var hR = document.getElementById('hR').value;
  var rR = document.getElementById('rR').value;
  var spO2 = document.getElementById('spO2').value;

  var afOn = document.getElementById('afOn').checked;
  var respAtaxiaOn = document.getElementById('respAtaxiaOn').checked;

  var changeDurTime = document.getElementById('changeDur').value;
  var changeTimeOn = document.getElementById('durApply').checked;

  var argArry = [sBP,dBP,hR,spO2,rR, afOn, respAtaxiaOn, changeDurTime, changeTimeOn];

  sendValuesToOpeWin(argArry);
}


/* ---------- IPC ---------- */
function sendValuesToOpeWin(arg){
    ipcRenderer.send('changeToNextValue', arg);
}




/*

function switchOnIPC(){
  var switchOn = document.getElementById('onSW').checked;
  var sBP = document.getElementById('sBP').value;
  var dBP = document.getElementById('dBP').value;
  var hR = document.getElementById('hR').innerText;
  var rR = document.getElementById('rR').innerText;
  var spO2 = document.getElementById('spO2').innerText;
  var afOn = document.getElementById('hRcheck').checked;
  var respAtaxiaOn = document.getElementById('rRcheck').checked;

  var aArray = [switchOn, sBP, dBP, hR, rR, spO2, afOn, respAtaxiaOn];
  ipcRenderer.send('switchOntoMain', aArray);
}


function afOnIPC(bool){
  ipcRenderer.send('afOn', bool);
}


function respAtaxiaOnIPC(bool){
  ipcRenderer.send('ataxiaOn', bool);
}


function hRSpO2RRChangeIPC(arg){
  //arg = [mainItem, aVal]
  ipcRenderer.send('valChange', arg);
  console.log(arg);
}


function bPMesureIPC(arg){
  //arg = [sBP, dBP]
  ipcRenderer.send('bPMesure', arg);
}
*/