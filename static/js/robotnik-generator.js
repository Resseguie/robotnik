Blockly.JavaScript['add_device'] = function(block) {
  var type = block.getFieldValue('DEVICE_TYPE');
  var name = block.getFieldValue('DEVICE_NAME');
  var pin = block.getFieldValue('DEVICE_PIN');

  // TODO sterilize inputs

  var code = '';
  if('led' === type) {
    code += 'var '+ name +' = new five.Led('+ pin +');\n';
  } else if ('servo' === type) {
    code += 'var '+ name +' = new five.Servo({pin: "'+ pin +'", type: "continuous");\n';
  } else {
    code += 'var '+ name +' = new five.Sensor('+ pin +');\n';
  }

  return code;
};

Blockly.JavaScript['led_on_off'] = function(block) {
  var name = block.getFieldValue('DEVICE_NAME');
  var onOff = block.getFieldValue('ON_OFF');
  return name +'.'+ onOff +'();\n';
};

Blockly.JavaScript['led_blink'] = function(block) {
  var name = block.getFieldValue('DEVICE_NAME');
  var delay = block.getFieldValue('BLINK_TIME');
  return name +'.blink(' + delay + ');';
};

Blockly.JavaScript['while_button'] = function(block) {
  var button = block.getFieldValue('BUTTON'),
    code = Blockly.JavaScript.statementToCode(block, 'DO'),
    otherwise = Blockly.JavaScript.statementToCode(block, 'OTHERWISE'),
    generated = '';

  if ( code ) {
    generated = generated + "button.on('" + button + "', function() {\n" + code + "\n});\n";
  }

  if ( otherwise ) {
    generated = generated + "button.off('" + button + "', function() {\n" + otherwise + "\n});\n";
  }

  return generated;
};

Blockly.JavaScript['motor_on'] = function(block) {
  var name = block.getFieldValue('DEVICE_NAME');
  var direction = block.getFieldValue('DIRECTION');
  return name +'.'+ direction +'();\n';
};

Blockly.JavaScript['if_distance'] = function(block) {
  return 'distance';
};