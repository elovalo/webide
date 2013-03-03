var interpret = require('./interpret');
var conf = require('../conf.json');

require('date-utils');

var queue = [];


function init(cubeUrl, dims, delay) {
    delay = delay || 500;
    var code;

    function play() {
        var playableItem = queue[0];
        var now = new Date();

        if(playableItem) {
            if(now.getSecondsBetween(playableItem.age) > 1) removeFromQueue(playableItem);
            code = playableItem.code;
        }

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

    console.log('pinging');
    if(i >= 0) {
        console.log('found item at ping');
        queue[i].age = new Date();
        queue[i].code = code;
    }

    cb(null);
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
