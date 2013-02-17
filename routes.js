var path = require('path');
var filewalker = require('filewalker');
var funkit = require('funkit');
var config = require('./config');

exports.index = function(req, res) {
    var metaPath = path.join(config.repoPath, 'effects_meta');
    var files = [];

    filewalker(metaPath).
        on('file', function(f) {
            files.push(require(path.join(metaPath, f)));
        }).
        on('done', function() {
            res.render('index', {
                title: 'Elovalo Webide',
                effects: files.map(funkit.common.prop('name'))
            });
        }).walk();
};

exports.editor = function(req, res) {
    res.render('editor', {title: 'Effect editor'});
};
