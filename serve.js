#!/usr/bin/env node
var app = require('./app')();
var http = require('http');

http.createServer(app).listen(app.get('port'), function() {
    console.log("Starting Elovalo Webide at port " + app.get('port'));
});
