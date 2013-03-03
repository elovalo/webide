var request = require('request');

var interpreter = require('../public/js/interpreter');


function interpret(cubeUrl, dims, codeCb) {
    interpreter(global, dims, {
        execute: function(init, cb) {
            animate(init, cb);
        },
        code: function() {
            return codeCb();
        },
        ok: function() {},
        error: function() {},
        playing: function() {
            return {};
        }
    });

    function animate(init, cb) {
        var res = cb(init.ticks);

        if(res.ok) putData(cubeUrl, res.ops, animate.bind(undefined, init, cb));
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
