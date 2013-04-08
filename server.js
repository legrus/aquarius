/*jshint node:true, noempty:true, laxcomma:true, laxbreak:false */

"use strict";

var fs = require('fs'),
    express = require('express'),
    app = express(),
    sqlite3 = require('sqlite3').verbose(),
    db,
    currentData = {};

var Gpio = require("onoff").Gpio,
    COLD_PIN = 27,
    HOT_PIN = 18;

function WaterMeter(name, pin, volume) {
    var me = this;
    me.listener = function(err, value) {
        me.lastValue = value;
        if(value > me.lastValue) 
            me.total += 2.5;
        else
            me.total += 7.5;
        console.log(me.name + ' volume = ' + me.total );

        me.gpio.watch(me.listener);
    },
    me.name = name;
    me.gpio = new Gpio(pin, 'in', 'both'),  
    me.lastValue = me.gpio.readSync(),
    me.total = volume;
    me.gpio.watch(me.listener);
}

function openDb() {
    console.log("createDb");
    db = new sqlite3.Database('aquarius.sqlite3', createTable);
}


function createTable() {
    console.log("createTable");
    db.run("CREATE TABLE IF NOT EXISTS records (timestamp integer, cold real, hot real)", readLastData);
}

function readLastData() {
    console.log("readLastData");
    db.all('select * from records order by timestamp desc limit 1', function(err, data) {

        console.log(data);

        currentData.cold = data[0].cold;
        currentData.hot = data[0].hot;
    });
}

/*
function spawnWattMeter() {


	var watts = spawn('tail', ['-f', 'tesst.txt']);


	watts.stdout.on('data', function (data) {
		if( parseFloat(data) > 0 ) {
			// no error, sane output
			var x = parseFloat(data);
			currentData = {
			    'hot':x,
			    'cold':x*2
			};
			console.log('set power: ' + x);
			var stmt = db.prepare("INSERT INTO records VALUES (datetime('now'), ?, ?)");
      			stmt.run(currentData.cold, currentData.hot);
  			stmt.finalize();
		} else {
			console.log('bad value from watt meter: ' + data);
		}
	});

	watts.on('exit', function (code) {
	  console.log('child process exited with code ' + code);
	  spawnWattMeter();
	});
}
*/

app.get('/', function(req,res){
	console.log("html served");
	fs.createReadStream(__dirname + '/index.html').pipe(res);
});

app.get('/getpower', function(req,res){
	res.writeHeader(200, {'Content-type':'application/json'});
	res.end(JSON.stringify({
		'cold': currentData.cold,
		'hot': currentData.hot
	}));
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

app.listen( PORT , function(){
	console.log('App listening. Check http://localhost:%s/', this.address().port)
});

openDb();

var cold = new WaterMeter('cold', COLD_PIN, 1733);
var hot = new WaterMeter('hot', HOT_PIN, 1538);
