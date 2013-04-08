/*jshint node:true, noempty:true, laxcomma:true, laxbreak:false */

"use strict";

var hot, cold;
var db = require('./db.js');
var Gpio = require('onoff').Gpio,
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

        db.updateValues(me.name, me.total);
    },
    me.name = name;
    me.gpio = new Gpio(pin, 'in', 'both'),
    me.lastValue = me.gpio.readSync(),
    me.total = volume;
    me.gpio.watch(me.listener);
}

exports.init = function(ready) {
    db.getLastValue(function(data){
        cold = new WaterMeter('cold', COLD_PIN, data.cold);
        hot = new WaterMeter('hot', HOT_PIN, data.hot);
        ready();
    });
};

exports.getLastValue = function() {
    return {
        cold: cold.total,
        host: hot.total
    };
};