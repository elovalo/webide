var request = require('request');

var interpreter = require('./public/js/interpreter');
var conf = require('./conf.json');

// TODO: pass dims here properly, tidy up
function interpret(code, playCb) {
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

        if(res.ok && playCb()) putData(res.ops, animate.bind(undefined, init, cb));
    }
}
module.exports = interpret;

function putData(data, cb) {
    request({
        method: 'PUT',
        uri: conf.cubeUrl,
        json: data
    }, function(err, res, d) {
        if(err) throw err;

        cb();
    });
}
