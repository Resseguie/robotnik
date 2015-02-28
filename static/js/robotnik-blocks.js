Blockly.Blocks['add_device'] = {
  init: function() {
    this.setColour(200);
    this.appendDummyInput()
        .appendField('assign')
        .appendField(
          new Blockly.FieldDropdown([
            ['led', 'led'],
            ['motor', 'servo']
            //['sensor', 'sensor']
          ]),'DEVICE_TYPE')
        .appendField('named')
        .appendField(
          new Blockly.FieldTextInput('device1'),
          'DEVICE_NAME'
        )
        .appendField('to pin')
        .appendField(
          new Blockly.FieldTextInput('13'),
          'DEVICE_PIN'
        );
    this.setNextStatement(true);
    this.setPreviousStatement(true);
  }
};

Blockly.Blocks['led_on_off'] = {
  init: function() {
    this.setColour(60);
    this.appendDummyInput()
        .appendField('turn')
        .appendField(
          new Blockly.FieldTextInput('device1'),
          'DEVICE_NAME'
        )
        .appendField('LED')
        .appendField(new Blockly.FieldDropdown([
          ['on', 'on'],
          ['off', 'off']
        ]), 'ON_OFF')

        ;
    this.setNextStatement(true);
    this.setPreviousStatement(true);    
  }
};

Blockly.Blocks['led_blink'] = {
  init: function() {
    this.setColour(60);
    this.appendDummyInput()
        .appendField('blink')
        .appendField(
          new Blockly.FieldTextInput('device1'),
          'DEVICE_NAME'
        )
        .appendField('LED every')
        .appendField(new Blockly.FieldTextInput('500'), 'BLINK_TIME')
        .appendField('milliseconds');
    this.setNextStatement(true);
    this.setPreviousStatement(true);    
  }
};


Blockly.Blocks['motor_on'] = {
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
        .appendField('the')
        .appendField(
          new Blockly.FieldTextInput('device1'),
          'DEVICE_NAME'
        )
        .appendField('motor')
        .appendField(new Blockly.FieldDropdown([
          ['goes clockwise', 'cw'],
          ['goes counter-clockwise', 'ccw'],
          ['stops', 'stop']
        ]), 'DIRECTION');
    this.setNextStatement(true);
    this.setPreviousStatement(true);
  }
};

Blockly.Blocks['while_button'] = {
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
        .appendField('while')
        .appendField(new Blockly.FieldDropdown([
          ['red', 'red'], 
          ['green', 'green'], 
          ['up', 'up'], 
          ['down', 'down'], 
          ['left', 'left'], 
          ['right', 'right']
        ]), 'BUTTON')
        .appendField('button is pressed');
    this.appendStatementInput('DO');
    this.appendDummyInput()
      .appendField('otherwise');
    this.appendStatementInput('OTHERWISE');
  }
};

Blockly.Blocks['if_distance'] = {
  init: function() {
    this.setColour(280);
    this.appendDummyInput()
        .appendField('when')
        .appendField(new Blockly.FieldTextInput('15'), 'DISTANCE')
        .appendField('cm away');
    this.appendStatementInput('DO');
    this.appendDummyInput()
      .appendField('otherwise');
    this.appendStatementInput('OTHERWISE');
  }
};

