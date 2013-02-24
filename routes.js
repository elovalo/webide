var fs = require('fs');
var path = require('path');

var filewalker = require('filewalker');
var funkit = require('funkit');
var conf = require('./conf.json');

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
    var fxPath = effectsPath();
    var id = req.query.id;

    if(id) {
        fs.readFile(path.join(fxPath, id + '.js'), 'utf8', function(err, d) {
            res.render('editor', {
                title: 'Effect editor', // TODO: move to tpl
                initialCode: d
            });
        });
    }
    else {
        res.render('editor', {
            title: 'Effect editor' // TODO: move to tpl
        });
    }
};

function effectsPath() {
    return path.join(conf.repoPath, 'effects');
}

function effectsMetaPath() {
    return path.join(conf.repoPath, 'effects_meta');
}
