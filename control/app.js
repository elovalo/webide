#!/usr/bin/env node
var request = require('request');
var funkit = require('funkit');

var interpreter = require('../public/js/interpreter');

main();

function main() {
    var delay = 20;

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

        if(res.ok) execute(res.ops);

        setTimeout(animate.bind(undefined, init, cb), delay);
    }
}

function execute(ops) {
    ops.forEach(function(op) {
        if(!op) return;

        var o = {
            on: function() {
                renderFrame(op.coords, op.intensity);
            },
            off: function() {
                renderFrame(op.coords, 0);
            }
        }[op.op]();
    });
}

function renderFrame(coords, alpha) {
    var i, len, coord;
    var data = setAll(0);
    var dims = {x: 8, y: 8, z: 8};

    for(i = 0, len = coords.length; i < len; i++) {
        coord = coords[i];

        data[parseInt(coord.x, 10) + parseInt(coord.y, 10) * dims.x * dims.y + parseInt(coord.z, 10) * dims.z] = alpha;
    }

    putData(data);
}

function putData(data) {
    var uri = 'http://84.251.8.171:8081/frame';

    request({
        method: 'PUT',
        uri: uri,
        json: data
    }, function(err, res, d) {
        if(err) throw err;
    });
}

function setAll(val) {
    var amount = 512;

    return funkit.functional.map(function(v) {
        return val;
    }, funkit.math.range(amount));
}
