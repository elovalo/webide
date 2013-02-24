#!/usr/bin/env node
var path = require('path');

var express = require('express');

var routes = require('./routes');

try {
    var conf = require('./conf.json');
} catch(e) {
    console.error('Missing conf.json!', e);
    process.exit();
}

function serve() {
    var app = express();

    app.configure(function() {
        app.set('port', conf.port);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express['static'](path.join(__dirname, 'public')));
        app.use(express.cookieParser(conf.cookieSecret));
        app.use(express.session());
        app.use(app.router);
    });

    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    app.get('/', routes.index);
    app.get('/editor', routes.editor);
    app.post('/editor', routes.editorSave);

    return app;
}

module.exports = serve;
