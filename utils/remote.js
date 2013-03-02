var interpret = require('./interpret');
var conf = require('../conf.json');


function play(req, author, code) {
    // TODO: add to req.session

    // if ok, interpret(cubeUrl, code, playCb)

    interpret(conf.cubeUrl, code, function() {
        // TODO: return false if ping fails, should start new interpreter
        return true;
    });
}
exports.play = play;

function stop(req, author) {
    // TODO: should remove author from queue
}
exports.stop = stop;

function ping(req, author, code) {
    // TODO: should ping and refresh author value to zero now
}
exports.ping = ping;
