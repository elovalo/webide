#!/usr/bin/env node
var request = require('request');

var interpreter = require('../public/js/interpreter');

var cubeUrl = require('../conf.json').cubeUrl;

main();

function main() {
    interpreter(global, {x: 8, y: 8, z: 8}, {
        execute: function(init, cb) {
            animate(init, cb);
        },
        code: function() {
            return 'function effect(cube) {\n' +
                'cube().off();\n' +
                'cube({z: 0}).map(function(led) {\n' +
                    'led.z = 0.25 * (2 + math.sin(led.x / 2 + ticks / 300) + math.sin(led.y / 2 + ticks / 400)) * cube.z;\n' +
                    'return led;\n' +
                '}).on();\n' +
            '}';
        },
        ok: function() {},
        error: function() {},
        playing: function() {
            return {};
        }
    });

    function animate(init, cb) {
        var res = cb(init.ticks);

        if(res.ok) putData(res.ops, animate.bind(undefined, init, cb));
    }
}

function putData(data, cb) {
    request({
        method: 'PUT',
        uri: cubeUrl,
        json: data
    }, function(err, res, d) {
        if(err) throw err;

        cb();
    });
}
