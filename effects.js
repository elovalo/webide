var fs = require('fs');
var path = require('path');

var gift = require('gift');
var funkit = require('funkit');
var partial = funkit.partial;
var zfill = funkit.string.zfill;

var filewalker = require('filewalker');

var conf = require('./conf.json');
var repo = gift(conf.repoPath);


var effectPath = partial(getPath, effectsPath(), 'js');
var effectMetaPath = partial(getPath, effectsMetaPath(), 'json');

var commitEffect = partial(commit, 'effects', effectPath, 'js');
var commitEffectMeta = partial(commit, 'effects_meta', effectMetaPath, 'json');

exports.commitEffect = commitEffect;
exports.commitEffectMeta = commitEffectMeta;

function commit(pathPrefix, pathFn, ext, msg, id, data, cb) {
    var p = pathFn(id);

    fs.writeFile(p, data, 'utf8', function(err, d) {
        if(err) return cb(err);

        repo.add(path.join(pathPrefix, id + '.' + ext), function(err) {
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

function create(author, code, cb) {
    var name = 'demo'; // XXX
    var id;

    // TODO: get new id
    // TODO: create new code file
    // TODO: create new meta file
    count(effectsPath(), function(err, count) {
        if(err) return console.error(err);
        id = zfill(5, count + 1) + '_' + name;

        commitEffect('New effect', id, code, function(err, d) {
            if(err) return cb(err);

            commitEffectMeta('New effect', id, JSON.stringify({
                name: name,
                author: author,
                description: '',
                parent: ''
            }), function(err, d) {
                if(err) return cb(err);

                cb();
            });
        });
    });
}
exports.create = create;

function count(p, cb) {
    fs.readdir(p, function(err, files) {
        if(err) return console.error(err);

        cb(null, files.length);
    });
}

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

function getMeta(id, cb) {
    try {
        var d = require(effectMetaPath(id));

        cb(null, d);
    } catch(e) {
        cb(e);
    }
}
exports.getMeta = getMeta;

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
