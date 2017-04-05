//call ipc module
const {ipcRenderer} = require('electron');


/* ---------- BP mesure animation ---------- */
function mesureBP(){
  if (switchOn){
    var sBP=document.getElementById('sBP').value;
    var dBP=document.getElementById('dBP').value;

    bPMesureIPC([sBP, dBP]);

///// BP display Blink /////
    var c = 0;
    var timerID = setInterval(function(){
      setTimeout(function(){
        displayVal('bP', '--- / ---');
        }, 500);

        setTimeout(function(){
          displayVal('bP', '');

        }, 999);

      c ++;

      if(c > 2){
        clearInterval(timerID);
      }
    }, 1000); //call timerID() each 1sec

///// finally show BP /////
    setTimeout(function(){
      displayVal('bP', sBP +' / '+ dBP);
      dBP = null;
      sBP = null;
      timerID = null;
    },4500);
  }
}


/* ---------- Value change with Slider & Box ---------- */
function changeSliderBox(aDom){
  var itemName = aDom.id.split("Slider", 1);
  var mainItem = itemName[0];
  var smallMonitorItem = mainItem + 'small';
  var theOther;

  if (mainItem == 'bP'){ //BP
    var aSBPVal = aDom.value;
    document.getElementById('sBP').value = aSBPVal;
    var aDBPVal = parseInt((40/60) * aSBPVal) -13 ;
    document.getElementById('dBP').value = aDBPVal;

    aSBPVal =null;
    aDBPVal = null;

  } else { // HR, SpO2, RR
    if (aDom.type == "range"){  //slider
      theOther = document.getElementById(mainItem + "SliderSide");
    } else { // Box
      theOther = document.getElementById(mainItem + "Slider");
    }

    var aVal = aDom.value;
    theOther.value = aVal;
    
    document.getElementById(mainItem).innerText = aVal;

    hRSpO2RRChangeIPC([mainItem, aVal]);

    aVAl = null;
  }
  itemName =null;
  mainItem = null;
  smallMonitorItem = null;
  theOther = null;
}



/* ---------- Monitor ON ---------- */
//need to global var to clearTimeout
var timeoutid = null; // timeoutId for ECG display
var timeoutid2 = null; //timeoutId for resp display
var switchOn = false;

function ring(){  //start drawing, ringing, 
//=> main.js => displayWindow
  switchOnIPC();

// clearTimeout
  clearTimeout(timeoutid);
  clearTimeout(timeoutid2);

///// start waves drawing /////
  window.requestAnimationFrame(draw); //ecg
  window.requestAnimationFrame(spO2draw);
  window.requestAnimationFrame(respdraw);

  var checkedValue = null; 
  checkedValue = document.getElementById('onSW').checked;
  switchOn = (checkedValue);
  checkedValue = null;

///// OFF waves drawing /////
  if (!switchOn){
    displayVal('bP', '--- / ---');
    var aAry = ['hR', 'spO2', 'bP', 'rR'];
    for (i=0; i<aAry.length; i++){
    displayVal(aAry[i], '--'); }
  }

///// create hR rhythms and sound play /////
  var hRArray=[]; //get hR average
  var ringfunc = function(){
    fire(); //ecg p-qrs-t wave start!

  //sound play
    var dinum = document.getElementById('spO2').innerText;
    //not to delay, read wav files directry
    var dinumplus = "wav/" + dinum + ".wav";
    var sound = new Audio(dinumplus);
    sound.volume = document.getElementById('volControl').value;
    sound.play();

    dinum = null;
    dinumplus = null;
    sound = null;
    //document.getElementById(dinum).play();  //this handler makes some delay

  //create next hR rhythm time
    var calhR;
    var ahRtext = document.getElementById('hRSlider').value;
    if (afOn){
      calhR = ahRtext * 1 - 10 + Math.random() * 20;  
    } else {
      calhR = ahRtext * 1;
    }
   ahRtext = null;
   
  // display each last 3 hR average
    hRArray.push(calhR);

    if (hRArray.length == 3){
      var aveHR = (hRArray[0] + hRArray[1] + hRArray[2])/3;
      displayVal('hR', parseInt(aveHR));
      aveHR = null;
      var tempspO2 = document.getElementById('spO2').innerText;
      displayVal('spO2', tempspO2);
      hRArray.length = 0;
      tempspO2 = null;
    }

    var hRtime = (60000 / calhR); // time to next fire()
    calhR = null;
    timeoutid = setTimeout(ringfunc, hRtime);
    hRtime = null;
  };

/* ---------- create resp rhythms ---------- */
  var rRArray=[]; 
  var respfunc = function(){
    respfire(); //resp wave start!
  
  //create resp rhythm
    var aRR;
    var aRRVal = document.getElementById('rRSlider').value;

    if (respAtaxiaOn){
      aRR = aRRVal * 1 - 2 + Math.random() * 4;
      respataxicfire();
    } else {
      aRR = aRRVal * 1;
    }

    aRRVal = null;

  // display average hR    
    rRArray.push(aRR);
    if (rRArray.length == 2){
      var aveRR = (rRArray[0] + rRArray[1])/2;
      displayVal('rR', parseInt(aveRR));
    // reset array
      rRArray.length = 0;
    }
    var rRtime = (60000 / aRR)*1; // time to next fire() 
    aRR = null;
    timeoutid2 = setTimeout(respfunc,rRtime);
    rRtime = null;
  };

  if (switchOn){
    ringfunc(); //run only 'start'
    respfunc();
  }
}

/* ---------- ECG animation ---------- */
var xVal = 0, yVal;
var xIntervalperSec;
var baseLineVal = 85;
var waveOn = false;
var firexVal = 0;
var pwCount, qRSCount, tCount;
var dataBefore = 120;
var afValChange = true;
var afOn = false;
var randomCoefficient;
var pWStT, qRSStT, tWStT, pqDur, tDur, hRCheck;
var i=0;

function draw(){
//set canvas drawing
  var aCanvas = document.getElementById('hRCanvas');
  var ctx = aCanvas.getContext('2d'); //draw on canvas

//set point x
  xIntervalperSec = 1;// x point move val interval as 1 frame 
  var xValm = xVal%(aCanvas.width);// xVal as loop in canvas width

//set point y baseLine
  var yValBase, nofireLine;
  if (!afOn){ //sinus rhythm
    yValBase = baseLineVal+ Math.random() * 0.8;// baseLine with fractuate voltage
    nofireLine = yValBase;
  } else { //Af
    afValChange = !(afValChange);  // too fine randam wave when each 1 frame draw, so set 2 frame
    yValBase = baseLineVal+ Math.random() * 8;

    if (afValChange){
      nofireLine = yValBase; // baseLine with fractuate voltage
    } else {
      nofireLine = dataBefore;
    }
  }

///// create waves /////
// when fire on pqrs wave start
    var createPwaveOn = function (){
    if (!waveOn){
      return !afOn;
    }
  }
  if (waveOn === true) {
// set each wave parameters
    var hRSlider = document.getElementById('hRSlider');
    [pWStT, qRSStT, tWStT, pqDur, tDur, hRCheck] = 
      (createPwaveOn)? [0,7,14,4,8, 'af']
    :(hRSlider.value <= 80)? [2,12,20,4,16, '-80']
    :(hRSlider.value <= 100)? [1,9,17,4,13, '-100']
    : [0,7,14,4,8, '120'];

  // firexVal is a wave timing, reset when fire() wave start;
    var pwaveVal;
    if (firexVal <= (tWStT + tDur)){  //p wave
      if (!afOn) {
        pwaveVal = createPQRSTwave(pWStT, pqDur, 3, 1, 0, 'p');
      } else {
        pwaveVal = 0;
      }
    //qrs, t waves
      var qrswaveVal = createPQRSTwave(qRSStT, pqDur, 15, 3/2, 5,'q');
      var twaveVal = createPQRSTwave(tWStT, tDur, 10, 1, 0,'t');
    //all waves
      yVal = yValBase + pwaveVal + qrswaveVal + twaveVal;
    } 
    
    if (firexVal == (tWStT + tDur)) { // waveOn reset when tWave is end.
      waveOn = false;
    } 
    
// no wave period
  } else {
    yVal = nofireLine;
  }

  firexVal += 1;

  var setColor = 'lightgreen';
  drawOrder(ctx, xValm, xIntervalperSec, dataBefore, yVal, setColor, aCanvas);
  dataBefore = yVal; //set aVal for next line.
  xVal += xIntervalperSec;

  if (!switchOn){
    ctx.clearRect(0, 0, aCanvas.width, aCanvas.height);
    dataBefore = null;
    return;
  } else {
      window.requestAnimationFrame(draw);
  }
  xValm = null;
  ctx = null;
  aCanvas = null;
}  
    
/* ---------- SpO2 animation ---------- */
var spyVal, spdataBefore, spPowVal, wavflat;
var wav1Count, wav2Count;

function spO2draw(){
  var aCanvas = document.getElementById('spO2Canvas');
  var ctx = aCanvas.getContext('2d'); //draw on canvas
  var xValm = xVal%(aCanvas.width);// xVal as loop in canvas width
  var spyValBase = baseLineVal - 20 + Math.random() * 0.8;// baseLine with fractuate voltage

  var hRSlider = document.getElementById('hRSlider');
  var wav1st,wav1dur, wav2st, wav2dur;
  [wav1st,wav1dur, wav2st, wav2dur, spPowVal] = 
     (afOn)? [10,10,13,8,40]
    :(hRSlider.value <= 80)? [14,15,20,13,35]
    :(hRSlider.value <= 100)? [10,13,16,13,40]
    : [10,10,13,8,40];
    
  if (firexVal < wav1st){ //before wave start
    spyVal = spdataBefore + spPowVal*Math.pow(3/15, (wavflat + 10)/10);

    if (spyVal >= 149){spyVal = 149;}

  } else if (firexVal <= (wav2st + wav2dur)){ //wave start
    //wav1, wav2 wave
    var wav1 = createPQRSTwave(wav1st, wav1dur, 30, 1, 0,'w1');
    var wav2 = createPQRSTwave(wav2st, wav2dur, 15, 1, 0,'w2');
    //all waves
    spyVal = spyValBase + wav1 + wav2;
  } else {
    spyVal = spdataBefore + spPowVal*Math.pow(3/15, (wavflat + 10)/10); 
    if (spyVal >= 149){spyVal = 149;}
    wavflat += 1;
  }

  if (firexVal == (wav2st + wav2dur)) { 
    wavflat = 0;
  }

  var setColor = 'lightskyblue';
  drawOrder(ctx, xValm, xIntervalperSec, spdataBefore, spyVal, setColor, aCanvas);
  spdataBefore = null;
  spdataBefore = spyVal; //set aVal for next line.

  if (!switchOn){
    ctx.clearRect(0, 0, aCanvas.width, aCanvas.height);
    spdataBefore = null;
    return;
  } else {
    window.requestAnimationFrame(spO2draw);
  }

  xValm = null;
  ctx = null;
  aCanvas = null;
  spyVal = null;
}  

/* ---------- resp animation ---------- */
var respyVal, respdataBefore;
var respWav1Count = 0, respWav2Count = 0;
var respfirexVal;
var respfireBool = false;
var respAtaxiaOn = false;
var respataxictime;
var wavCount;

function respdraw(){
  var respWav1st,respWav1dur, respWav2st, respWav2dur;
  var aCanvas = document.getElementById('respCanvas');
  var ctx = aCanvas.getContext('2d'); //draw on canvas
  var xValm = xVal%(aCanvas.width*2)/2;// xVal as loop in canvas width
  var respyValBase = 120;

  if (respfireBool) {  //respfire
  //respWav2dur is kyuuki duration
    var aRR = (document.getElementById('rR').innerText);
    respWav2dur = parseInt(-1 * (4/3) * aRR + 88);
    respWav1st = 0;
    respWav2st = 0;
    respWav1dur = parseInt(respWav2dur * 0.8);
    aRR = null;
    //max 30/min 1:1.5 timer:every 2sec     
    //min 6/min 2sec:3sec timer every 10sec
    //ave 12/min 1.5sec:2.3sec timer every 5sec 
    //1sec = 60 frame

    if (respfirexVal <= respWav2dur){
      var wav1 = createPQRSTwave(0, respWav1dur, 50, 1, 0,'rr');
      var wav2 = createPQRSTwave(0, respWav2dur, 30, 1, 0,'rr');
      //all waves
      respyVal = respyValBase + wav1 + wav2;
    } else {
      respyVal = 120;//respyValBase;
    }

    if (respfirexVal == respWav2dur) {
      respfireBool = false;
    }
  } else {
    respyVal = 120;//respyValBase;
  }

  if (respAtaxiaOn){
    var wav3 = createPQRSTwave(ataxicWavArray[1], ataxicWavArray[0], ataxicWavArray[2], 1, 0, 'rr');
    var wav4 = createPQRSTwave(ataxicWavArray[4], ataxicWavArray[3], ataxicWavArray[5], 1, 0, 'rr');
    var wav5 = createPQRSTwave(ataxicWavArray[7], ataxicWavArray[6], ataxicWavArray[8], 1, 0, 'rr');
    var wav6 = createPQRSTwave(ataxicWavArray[10], ataxicWavArray[9], ataxicWavArray[11], 1, 0, 'rr');
    var wav7 = createPQRSTwave(ataxicWavArray[13], ataxicWavArray[12], ataxicWavArray[14], 1, 0, 'rr');
    var ataxicrr = wav3 + wav4 + wav5 + wav6 + wav7;
  
    respyVal = respyVal + ataxicrr;
  } 

  var setColor = 'white';
  drawOrder(ctx, xValm, xIntervalperSec/2, respdataBefore, respyVal, setColor, aCanvas);
  respdataBefore = respyVal; //set aVal for next line.
  respfirexVal += 1;
  
  if (!switchOn){
    ctx.clearRect(0, 0, aCanvas.width, aCanvas.height);
    respdataBefore = null;
    return;
  } else {
    window.requestAnimationFrame(respdraw);
  }

  xValm = null;
  ctx = null;
  aCanvas = null;
} 



function fire(){
  if (waveOn){
    return;
  } else {
    waveOn = true;
    firexVal = 0;
    pwCount = 0;
    qRSCount = 0;
    tCount =0;
    wav1Count = 0;
    wav2Count = 0;
  }  
}

function respfire(){
    if (respfireBool){
      return;
    } else {
      respfireBool = true;
      respfirexVal = 0;
      respWav1Count = 0;
      respWav2Count = 0;
    }  
  }
                     
var ataxicWavArray = [];
function respataxicfire(){
  respataxictime = 0;
  wavCount = 0;

  ataxicWavArray.length = 0;
  for (i=0; i<5; i++){
    var durTimeFrame = Math.floor(Math.random()*30) + 30; // 30-60 frame
    var startTimeFrame = Math.floor(Math.random()*840) + 60; // 60-900 frame
    var strongHeight = Math.floor(Math.random()*10) + 20; // 20-30 times
    ataxicWavArray.push(durTimeFrame, startTimeFrame, strongHeight);
  }
}  


function hRRhythmChangeSW(){
  var checkedValue = null; 
  checkedValue = document.getElementById('hRcheck').checked;
  afOn = checkedValue;//sinus true, Af false

  optionColorChange('optionalValaf', checkedValue);
  afOnIPC(checkedValue);

  checkedValue = null;
}

function rRRhythmChangeSW(){
  var checkedValue = null; 
  checkedValue = document.getElementById('rRcheck').checked;
  respAtaxiaOn = checkedValue;

  optionColorChange('optionalValrR', checkedValue);
  respAtaxiaOnIPC(checkedValue);

  checkedValue = null;
}


function displayVal(aVSign, aText){
  var targetId = (aVSign == 'bP')? 'bPsmall'
  : (aVSign == 'hR')? 'hRsmall'
  : (aVSign == 'spO2')? 'spO2small'
  : (aVSign == 'rR')? 'rRsmall'
  : '';

  document.getElementById(targetId).textContent = aText;
}


function drawOrder(ctx, xValm, xIntervalperSec, dataBefore, yVal, setColor, aCanvas){
    ctx.beginPath();
    ctx.moveTo(xValm - xIntervalperSec, dataBefore);//line start point, the point before this.
    ctx.lineTo(xValm, yVal);//lineTo
    ctx.strokeStyle = setColor;
    ctx.stroke();

    if (xValm == 1) {
      ctx.clearRect(0, 0, 30, aCanvas.height);
    } else {
      ctx.clearRect(xValm + 1, 0, 30, aCanvas.height);
    }
}

//create each wave shapes including 'resp wave'
function createPQRSTwave(StT, durationtime, strongHeight, pow, qsVal, waveform){
  var wavCount, ffirexVal, wavVal;
  if (waveform == 'rr'){
    wavCount = respfirexVal - StT;
    ffirexVal = respfirexVal;
  } else {
    wavCount = firexVal - StT;
    ffirexVal = firexVal;
  }

  if (StT <= ffirexVal && ffirexVal <= (StT + durationtime)){
    wavVal =  qsVal - Math.pow(Math.abs(strongHeight*Math.sin(Math.PI/(durationtime)*wavCount)),pow);
    } else {
      wavVal = 0;
    }

  return wavVal;
}


function optionColorChange(targetId, aBool){
 var target = document.getElementById(targetId);

 if (aBool){
 target.style.color = "blue";
 } else {
   target.style.color = "lightgray";
 }

 target = null;
}


/* ---------- IPC ---------- */

// ipc opeWin --> displayWindow

//var switchOn = false, sBP, dBP, hR, rR, spO2, afOn, respAtaxiaOn;


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

// ipc dataWin -- opeWin

ipcRenderer.on('changeToNextValue', (event, arg) =>{
  document.getElementById('sBP').value = arg[0];
  document.getElementById('dBP').value = arg[1];
  document.getElementById('hRSliderSide').value = arg[2];
  document.getElementById('rRSliderSide').value = arg[3];
  document.getElementById('hRSlider').value = arg[2];
  document.getElementById('rRSlider').value = arg[3];

  //functionで書くこと。
  #problem
});