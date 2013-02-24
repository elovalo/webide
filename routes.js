var fs = require('fs');
var path = require('path');

var filewalker = require('filewalker');
var funkit = require('funkit');
var gift = require('gift');

var conf = require('./conf.json');
var repo = gift(conf.repoPath);

exports.index = function(req, res) {
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
            console.log(data);
            res.render('index', {
                title: 'Elovalo Webide', // TODO: move to tpl
                effects: data
            });
        }).walk();
};

exports.editor = function(req, res) {
    var id = req.query.id;

    if(id) {
        readEffect(id, function(err, d) {
            res.render('editor', {
                title: 'Effect editor', // TODO: move to tpl
                initialCode: d,
                codeId: id
            });
        });
    }
    else {
        res.render('editor', {
            title: 'Effect editor' // TODO: move to tpl
        });
    }
};

exports.editorSave = function(req, res) {
    var code = req.param('code');
    var id = req.param('id');
    var status;

    if(code && id) {
        commit('Save effect', id, code, function(err) {
            status = err? 'error': 'success';

            res.json({status: status});
        });
    }
    else {
        res.json({status: 'error'});
    }
};

exports.effects = function(req, res) {
    var id = req.query.id;

    if(id) {
        readEffect(id, function(err, d) {
            if(err) return res.send(404);
            else return res.send(d);
        });
    }
    else {
        res.send(404);
    }
};

function readEffect(id, cb) {
    fs.readFile(effectPath(id), 'utf8', cb);
}

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
