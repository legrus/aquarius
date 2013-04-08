/*jshint node:true, noempty:true, laxcomma:true, laxbreak:false */

"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db,
    DB_PATH = 'aquarius.sqlite3',
    dataColumns = ['cold', 'hot'],
    query = {
        create: "create table if not exists records (timestamp integer, cold real, hot real)",
        last:   "select * from records order by timestamp desc limit 1",
        day:    "select * from records order by timestamp where timestamp > datetime('now', '-1 day')",
        month:  "select * from records order by timestamp where timestamp > datetime('now', '-1 month')",
        insert: "insert into records(timestamp, cold, hot) values(datetime('now'), ?, ?)"
    };

exports.getLastValue = function(callback) {
    console.log("getLastValue");
    db.all(query.last, function(err, data) {
        console.log(data);
        if(callback) callback(data[0]);
    });
};

exports.getLastDay = function(callback) {
    console.log("getLastDay");
    db.all(query.day, function(err, data) {
        console.log(data);
        if(callback) callback(data);
    });
};

exports.getLastMonth = function(callback) {
    console.log("getLastMonth");
    db.all(query.month, function(err, data) {
        console.log(data);
        if(callback) callback(data);
    });
};

exports.databasePath = function() {
    return DB_PATH;
};

exports.init = function(ready){
    console.log("create db");
    db = new sqlite3.Database(DB_PATH, function(){
        console.log("create table");
        db.run(query.create, ready);
    });
};

exports.updateValues = function(name, value, callback){
    exports.getLastValue(function(row){
        if(name in row && name in dataColumns) {
            row[name] = value;
            var q = db.prepare(query.insert);
            var params = [];
            for(var i = 0; i < dataColumns.length; i++) {
                params.push(row[dataColumns[i]]);
            }
            q.run(params);
            q.finalize();
        }
        if(callback) callback();
    });
};

exports.dataColumns = function(){
    return dataColumns;
};