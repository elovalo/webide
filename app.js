#!/usr/bin/env node
var path = require('path');

var express = require('express');
var passport = require('passport');

var routes = require('./routes');
var auth = require('./utils/auth');
var remote = require('./utils/remote');


try {
    var conf = require('./conf.json');
} catch(e) {
    console.error('Missing conf.json!', e);
    process.exit();
}

function serve() {
    var apiPrefix = '/api/v1';
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

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(app.router);
    });

    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    app.get('/', routes.index);
    app.get('/editor', routes.editor);

    app.get(apiPrefix + '/effects', routes.effects);

    app.post('/editor', routes.editorPost);

    auth[conf.dev? 'plain': 'github'](app);

    // TODO: move dims to conf
    remote.init(conf.cubeUrl, {x: 8, y: 8, z: 8});

    return app;
}

module.exports = serve;
