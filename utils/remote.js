var interpret = require('./interpret');
var conf = require('../conf.json');


var queue = [];


function init(cubeUrl, dims, delay) {
    delay = delay || 500;
    var code;

    function play() {
        var playableItem = queue[0];

        if(playableItem) code = playableItem.code;

        setTimeout(play, delay);
    }

    interpret(cubeUrl, dims, function() {
        return code;
    });

    setTimeout(play, delay);
}
exports.init = init;

function play(author, code, cb) {
    addToQueue(author, code);

    console.log('play queue', queue);

    cb(null);

    /*
    TODO: this needs to go to a separate init. code is then updated dynamically
    by some Node timer (setTimeout)
    interpret(conf.cubeUrl, code, function() {
        // TODO: return false if ping fails, should start new interpreter
        return true;
    });
    */
}
exports.play = play;

function stop(author, cb) {
    removeFromQueue(author);

    console.log('play queue', queue);

    cb(null);
}
exports.stop = stop;

function ping(author, code, cb) {
    var i = searchQueue(queue, 'author', author);

    if(i >= 0) queue[i].age = 0;
}
exports.ping = ping;

// TODO: these queue funcs might go into a module of their own at some point
function addToQueue(author, code) {
    if(!inQueue(queue, 'author', author)) queue.push({
        author: author,
        code: code,
        age: 0
    });
}

function removeFromQueue(author) {
    var i = searchQueue(queue, 'author', author);

    if(i >= 0) queue.splice(i, 1);
}

function inQueue(queue, property, value) {
    return searchQueue(queue, property, value) >= 0;
}

// presumes properties are unique and returns index
function searchQueue(queue, property, value) {
    var i, len;

    for(i = 0, len = queue.length; i < len; i++) {
        if(queue[i][property] == value) return i;
    }
}
