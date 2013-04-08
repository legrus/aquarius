"use strict";

var Gpio = require('onoff').Gpio,        // Constructor function for Gpio objects.
    gpio17 = new Gpio(17, 'in', 'both'),   // Export GPIO #17 as an interrupt
                                           // generating input.
    gpio18 = new Gpio(18, 'in', 'both'),   // Export GPIO #18 as an interrupt
                                           // generating input.
    gpio7 = new Gpio(7, 'out'); 

function onChange17(err, value) {
    console.log('17:' +  value);
    gpio17.watch(onChange17);
    console.log('Rearming int handler ' +  value);
}

function onChange18(err, value) {
    console.log('18:' +  value);
    gpio18.watch(onChange18);
    console.log('Rearming int handler ' +  value);
}

gpio17.watch(onChange17);
gpio18.watch(onChange18);

/*
gpio7.writeSync(0);
gpio7.writeSync(1);
gpio7.writeSync(0);
*/
console.log('Please press the button on GPIO...');
