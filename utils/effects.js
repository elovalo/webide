var fs = require('fs');
var path = require('path');

var gift = require('gift');

var filewalker = require('filewalker');

var conf = require('../conf.json');
var repo = gift(conf.repoPath);

function get(cb) {
    var metaPath = effectsMetaPath();
    var data = [];
    var d;

    filewalker(metaPath).
        on('file', function(f) {
            d = require(path.join(metaPath, f));
            d.id = path.basename(f, '.json');

            data.push(d);
        }).
        on('done', function() {
            cb(data);
        }).walk();
}
exports.get = get;

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
                console.log('add failed', err);
                return cb(err);
            }

            repo.commit(msg, {
                all: true
            }, function(err) {
                if(err) {
                    console.log('commit failed', err);
                    return cb(err);
                }

                cb();
            });
        });
    });
}
exports.commit = commit;

function effectPath(id) {
    // avoid exposing FS (perhaps there's a neater way?)
    if(id.indexOf('/') >= 0 || id.indexOf('\\') >= 0) return;

    return path.join(effectsPath(), id + '.js');
}

function effectsPath() {
    return path.join(conf.repoPath, 'effects');
}

function effectsMetaPath() {
    return path.join(conf.repoPath, 'effects_meta');
}
