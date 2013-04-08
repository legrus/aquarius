/*jshint node:true, noempty:true, laxcomma:true, laxbreak:false */

"use strict";

var fs = require('fs'),
    express = require('express'),
    app = express(),
    db = require('./db'),
    hardware = require('./hardware');

var dbGets = {
    'last': db.getLastValue,
    'day': db.getLastDay,
    'month': db.getLastMonth
};

app.get('/', function(req,res){
    console.log("html served");
    fs.createReadStream(__dirname + '/index.html').pipe(res);
});

app.get('/last', function(req,res){
    res.writeHeader(200, {'Content-type':'application/json'});
    res.end(hardware.getLastValue());
});

app.get('/day', function(req,res){
    res.writeHeader(200, {'Content-type':'application/json'});
    db.getLastDay(function(data){
        res.end(data);
    });
});

app.get('/highcharts/js/highcharts.js', function(req,res){
    console.log("js served");
    res.writeHeader(200, {'Content-type':'text/javascript'});
    fs.createReadStream(__dirname + '/highcharts/js/highcharts.js').pipe(res);
});

app.get('*', function(req,res){
    res.writeHeader(404, {'Content-type':'text/html'});
    res.end("Not found");
});


var PORT = 3000;

exports.init = function(ready) {
    app.listen( PORT , function(){
       console.log('App listening. Check http://localhost:%s/', this.address().port);
       ready();
    });
};
