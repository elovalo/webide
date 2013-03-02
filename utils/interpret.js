var request = require('request');

var interpreter = require('../public/js/interpreter');


// TODO: pass dims here properly, tidy up
function interpret(cubeUrl, code, playCb) {
    interpreter(global, {x: 8, y: 8, z: 8}, {
        execute: function(init, cb) {
            animate(init, cb);
        },
        code: function() {
            return code;
        },
        ok: function() {},
        error: function() {},
        playing: function() {
            return {};
        }
    });

    function animate(init, cb) {
        var res = cb(init.ticks);

        if(res.ok && playCb()) putData(cubeUrl, res.ops, animate.bind(undefined, init, cb));
    }
}
module.exports = interpret;

function putData(cubeUrl, data, cb) {
    request({
        method: 'PUT',
        uri: cubeUrl,
        json: data
    }, function(err, res, d) {
        if(err) return console.error(err);

        cb();
    });
}
