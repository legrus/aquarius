"use strict";

var gpio = require('rpi-gpio');

gpio.setMode(gpio.MODE_BCM);
gpio.setup(7, gpio.DIR_OUT);
gpio.setup(17, gpio.DIR_IN, write);

function write() {
    gpio.write(7, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
    gpio.on('change', function(channel, value) {
        console.log('Channel ' + channel + ' value is now ' + value);
    });
}


console.log('Ready...');
