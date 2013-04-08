/*jshint node:true, noempty:true, laxcomma:true, laxbreak:false */

"use strict";

var server = require('./server.js'),
    db = require('./db.js'),
    async = require('async'),
    currentData = {};

var Gpio = require("onoff").Gpio,
    COLD_PIN = 27,
    HOT_PIN = 18;

function WaterMeter(name, pin, volume) {
    var me = this;
    me.listener = function(err, value) {
        me.lastValue = value;
        if(value > me.lastValue)
            me.total += 7.5;
        else
            me.total += 2.5;
        console.log(me.name + ' volume = ' + me.total );

        me.gpio.watch(me.listener); // rearm the interrupt handler
    },
    me.name = name;
    me.gpio = new Gpio(pin, 'in', 'both'),
    me.lastValue = me.gpio.readSync(),
    me.total = volume;
    me.gpio.watch(me.listener);
}



var hardware = {
    init: function(ready) {
        currentData = db.getLastValue(function(data){
            var cold = new WaterMeter('cold', COLD_PIN, data.cold);
            var hot = new WaterMeter('hot', HOT_PIN, data.hot);
            ready();
        });

    }
};

async.series(
    [
        db.init,
        server.init,
        hardware.init
    ],
    function(){
        console.log('Ready!');
    }
);
