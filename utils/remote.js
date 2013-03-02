var interpret = require('./interpret');
var conf = require('../conf.json');


function play(req, author, code) {
    console.log('before play', req.session.remote);

    req.session.remote = addToQueue(req.session, author, code);

    console.log('after play', req.session.remote);

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

function stop(req, author) {
    req.session.remote = removeFromQueue(req.session, author);
}
exports.stop = stop;

function ping(req, author, code) {
    var queue = getQueue(req.session, 'remote');
    var i = searchQueue(queue, 'author', author);

    if(i >= 0) queue[i].age = 0;

    req.session.remote = queue;
}
exports.ping = ping;

// TODO: these queue funcs might go into a module of their own at some point
function addToQueue(store, author, code) {
    var queue = getQueue(store, 'remote');

    if(!inQueue(queue, 'author', author)) queue.push({
        author: author,
        code: code,
        age: 0
    });

    return queue;
}

function getQueue(store, name) {
    console.log('getting queue', store, store[name]);
    if(!store[name]) store[name] = [];

    return store[name];
}

function removeFromQueue(store, author) {
    var queue = getQueue(store, 'remote');
    var i = searchQueue(queue, 'author', author);

    if(i >= 0) queue.splice(i, 1);

    return queue;
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
