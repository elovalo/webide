#!/usr/bin/env node
var request = require('request');
var funkit = require('funkit');

main();

function main() {
    var uri = 'http://84.251.8.171:8081/frame';
    var data = setAll();

    request.put({
        uri: uri,
        json: true,
        body: data
    }, function(err, res, d) {
        if(err) throw err;

        console.log(res, d);
    });
}

function setAll() {
    var amount = 512;

    return funkit.functional.map(function(v) {
        return 1;
    }, funkit.math.range(amount));
}
