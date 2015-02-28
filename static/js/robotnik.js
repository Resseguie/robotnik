'use strict';

$( document ).ready(function() {

  // Initialize Blockly
  Blockly.inject(document.getElementById('blockly'), {
    path: './vendor/blockly/',
    toolbox: document.getElementById('toolbox'),
    trashcan: true
  });


  var preCode = [
    'var five = require("johnny-five"),',
    '\tboard = new five.Board(),',
    "\tbutton = require('./lib/buttons')",
    '',
    'board.on("ready", function() {',
    "var led = new five.Led(13),",
    "\tleft = new five.Servo({ pin:  7, type: 'continuous' }).stop(),",
    "\tright = new five.Servo({ pin: 11, type: 'continuous' }).stop(),",
    "\tsensor = new five.Sensor('A0')",
    '',
    ''
  ];

  var postCode = [ '', '})' ];

  function generateCode() {
    return preCode.join("\n") + Blockly.JavaScript.workspaceToCode() + postCode.join("\n")
  }



  // Keep the tabs sized to the window minus the header
  $( window ).resize(function() {
    $('#tab-content').css('height', $(window).height() - 100 + 'px' );
  });

  // Tab Interface
  $('#blocks-tab').click(function(e) {
    e.preventDefault();

    $('#tabs li').removeClass('active');
    $(this).parent().addClass('active');

    $('#code').hide();
    $('#blockly').show();
    $('#docs').hide();
  });

  $('#code-tab').click(function(e) {
    e.preventDefault();

    $('#tabs li').removeClass('active');
    $(this).parent().addClass('active');

    $('#code').show();
    $('#blockly').hide();
    $('#docs').show();

  });

});
