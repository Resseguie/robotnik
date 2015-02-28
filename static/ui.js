var fs = require('fs');

var $ = require('jquery');

var SerialPort = require('browser-serialport').SerialPort;

var stk500 = require('stk500');
var series = require('run-series');
var hexParser = require('intel-hex');
var image = fs.readFileSync('node_modules/stk500/arduino-1.0.6/uno/StandardFirmata.cpp.hex', 'utf8');
var hex = hexParser.parse(image).data;
var pageSize = 128;
var baud = 115200;
var delay1 = 1; //minimum is 2.5us, so anything over 1 fine?
var delay2 = 1;

var signature = new Buffer([0x1e, 0x95, 0x0f]);

var options = {
  devicecode:0,
  revision:0,
  progtype:0,
  parmode:0,
  polling:0,
  selftimed:0,
  lockbytes:0,
  fusebytes:0,
  flashpollval1:0,
  flashpollval2:0,
  eeprompollval1:0,
  eeprompollval2:0,
  pagesizehigh:0,
  pagesizelow:pageSize,
  eepromsizehigh:0,
  eepromsizelow:0,
  flashsize4:0,
  flashsize3:0,
  flashsize2:0,
  flashsize1:0
};


var selectList;
var connectedSerial;
var sandboxWindow, sandboxFrame;
var queuedMsg;
var infoQueue = [];
var INFO_QUEUE_SIZE = 15;

var Devices = require('./views/devices.jsx');
require('./styles.less');

var React = require('react');

var editor;
startApp();
var serialSelect;

var preCode = [
  '/*',
  ' You have the following variables available to your script:',
  '   five  = The full johnny-five API !',
  '   io    = the firmata instance for the board',
  '   $     = jQuery, because you might already know jQuery',
  '   _     = lodash, because lodash is awesome',
  '*/',
  '',
  'var board = new five.Board({io: io});',
  '',
  'board.on("ready", function() {',
  ''
];

var postCode = [ '', '', '});' ];

$( document ).ready(function() {

  // Initialize Blockly
  Blockly.inject(document.getElementById('blockly'), {
    path: './vendor/blockly/',
    toolbox: document.getElementById('toolbox'),
    trashcan: true
  });

  editor = ace.edit("editor");
  editor.getSession().setMode("ace/mode/javascript");
  $('#editor').hide();

});

function blocklyToCode() {
  return preCode.join("\n") + Blockly.JavaScript.workspaceToCode() + postCode.join("\n")
}


// Keep the tabs sized to the window minus the header
$( window ).resize(function() {
  // TODO make responsive
  $('#tab-content').css('height', $(window).height() - 300 + 'px' );
});

// Tab Interface
$('#blocks-tab').click(function(e) {
  e.preventDefault();

  $('#tabs li').removeClass('active');
  $(this).parent().addClass('active');

  $('#code').hide();
  $('#editor').hide();
  $('#blockly').show();
  $('#docs').hide();
});

$('#code-tab').click(function(e) {
  e.preventDefault();

  $('#tabs li').removeClass('active');
  $(this).parent().addClass('active');

  $('#code').show();
  $('#editor').show();
  $('#blockly').hide();
  $('#docs').show();

  editor.setValue( blocklyToCode() );
  editor.gotoLine(1);
});


function createSandbox(){
  var sandbox = document.createElement('iframe');
  sandbox.src = 'sandbox.html';
  sandbox.style.display = 'none';
  document.body.appendChild(sandbox);
  return sandbox;
}

function startApp(){
  console.log('starting app');
  sandboxFrame = createSandbox();
  sandboxWindow = sandboxFrame.contentWindow;

  loadDevices();
  $("#refreshBtn").click(loadDevices);
  $('#programBtn').click(programDevice);
  $("#runBtn").click(runCode);

  window.addEventListener('message', function(event) {
    var data = event.data;
    var command = data && data.command;
    var payload = data && data.payload;
    if(command === 'open'){
      console.log(data);
    }
    if(command === 'write' && connectedSerial && payload) {
      connectedSerial.write(payload, function(err){});
    } else if(command === 'ready'){
      $("#runBtn").prop("disabled",false);
      if(queuedMsg){
        sandboxWindow.postMessage(queuedMsg, '*');
        queuedMsg = null;
      }
    } else if(command === 'info'){
      if(data.text){
        infoQueue.unshift(data);
        if(infoQueue.length > INFO_QUEUE_SIZE){
          infoQueue.pop();
        }
      }
      //TODO use a react view.
      var infoArea = document.getElementById('infoArea');
      infoArea.innerHTML = '';
      infoQueue.forEach(function(info){
        var infoMsg = document.createElement("div");
        //TOTO sanitize message, or use a proper view tech
        infoMsg.innerHTML = info.text;
        infoMsg.className = 'alert thinAlert alert-' + info.type;
        infoArea.appendChild(infoMsg);
      });
    }
  });

}

function loadDevices(){
  chrome.serial.getDevices(function (devices) {
    serialSelect = React.render(React.createElement(Devices, { devices: devices }), document.getElementById('devices'));
  });
}

function programDevice(){
  $('#runBtn').prop('disabled', true);
  $('#programBtn').prop('disabled', true);

  var serial = new SerialPort(serialSelect.state.selectedDevice, {
    baudrate: baud
  }, false);

  var programmer = new stk500(serial);

  series([
    programmer.connect.bind(programmer),
    programmer.reset.bind(programmer, delay1, delay2),
    programmer.sync.bind(programmer, 5),
    programmer.verifySignature.bind(programmer, signature),
    programmer.setOptions.bind(programmer, options),
    programmer.enterProgrammingMode.bind(programmer),
    programmer.upload.bind(programmer, hex, pageSize),
    programmer.exitProgrammingMode.bind(programmer),
    programmer.disconnect.bind(programmer)
  ], function(error){
    $('#runBtn').prop('disabled', false);
    $('#programBtn').prop('disabled', false);

    if(error){
      console.log("programing FAILED: " + error);
      return;
    }

    console.log("programing SUCCESS!");
  });
}

function runCode(){
  $("#runBtn").prop("disabled",true);

  var code;
  if( $('#blocks-tab').parent().hasClass('active') ) {
    code = blocklyToCode();
  } else {
    code = editor.getValue();
  }

  infoQueue = [];
  $('#infoArea').empty();
  if(connectedSerial){
    connectedSerial.on('close', function(){
      setTimeout(function() {
        startupJ5(code);
      }, 1000);
    });
    connectedSerial.close();
  }
  else{
    startupJ5(code);
  }

}

function startupJ5(code){
  connectedSerial = new SerialPort(serialSelect.state.selectedDevice, {
    baudrate: 57600,
    buffersize: 1
  });
  connectedSerial.on('data', function(data){
    sandboxWindow.postMessage({
      command: 'write',
      payload: data
    }, '*');
  });

  console.log('posting runScript');
  queuedMsg = {
    command: 'runScript',
    payload: code
  };
  sandboxFrame.src = sandboxFrame.src + '';
}
