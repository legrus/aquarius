"use strict";

var gpio = require("gpio"),
    gpio7 = gpio.export(7, "out"),
    gpio17 = gpio.export(17, "in");

gpio17.setDirection("in");
gpio17.on("change", function(value) {
    console.log('17:' +  value);
});

console.log('Ready...');
gpio7.setDirection("out");
gpio7.set(0);
gpio7.set(1);
gpio7.set(0);

