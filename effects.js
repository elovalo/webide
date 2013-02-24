var fs = require('fs');
var path = require('path');

var gift = require('gift');
var partial = require('funkit').partial;

var filewalker = require('filewalker');

var conf = require('./conf.json');
var repo = gift(conf.repoPath);

exports.getAll = partial(walk, effectsMetaPath(), function(f, p) {
    var d = require(path.join(p, f));
    d.id = path.basename(f, '.json');

    return d;
});
exports.getAllMeta = partial(walk, effectsPath(), function(f) {
    return path.basename(f, '.js');
});

function walk(p, fileCb, cb) {
    var data = [];

    // doesn't work with ../../ ???
    filewalker(p).
        on('file', function(f) {
            data.push(fileCb(f, p));
        }).
        on('done', function() {
            cb(null, data);
        }).
        on('error', function(err) {
            cb(err, data);
        }).walk();
}

function read(id, cb) {
    fs.readFile(effectPath(id), 'utf8', cb);
}
exports.read = read;

function commit(msg, id, data, cb) {
    var p = effectPath(id);

    fs.writeFile(p, data, 'utf8', function(err, d) {
        if(err) return cb(err);

        repo.add(path.join('effects', id + '.js'), function(err) {
            if(err) {
                console.warn('add failed', err);
                return cb(err);
            }

            repo.commit(msg, {
                all: true
            }, function(err) {
                if(err) {
                    console.warn('commit failed', err);
                    return cb(err);
                }

                cb();
            });
        });
    });
}
exports.commit = commit;

function getMeta(id, cb) {
    try {
        var d = require(effectMetaPath(id));

        cb(null, d);
    } catch(e) {
        cb(e);
    }
}
exports.getMeta = getMeta;

var effectPath = partial(getPath, effectsPath(), 'js');
var effectMetaPath = partial(getPath, effectsMetaPath(), 'json');

function getPath(p, ext, id) {
    // avoid exposing FS (perhaps there's a neater way?)
    if(id.indexOf('/') >= 0 || id.indexOf('\\') >= 0) return;

    return path.join(p, id + '.' + ext);
}

function effectsPath() {
    return path.join(conf.repoPath, 'effects');
}

function effectsMetaPath() {
    return path.join(conf.repoPath, 'effects_meta');
}
