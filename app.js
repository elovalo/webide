#!/usr/bin/env node
var path = require('path');

var express = require('express');
var passport = require('passport');
var gh = require('passport-github').Strategy;

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

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(app.router);
    });

    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    app.get('/', routes.index);
    app.get('/effects', routes.effects);
    app.get('/editor', routes.editor);

    app.post('/editor', routes.editorSave);

    auth(app);

    return app;
}

// https://github.com/jaredhanson/passport-github/tree/master/examples/login
function auth(app) {
    passport.use(new gh({
            clientID: conf.github.id,
            clientSecret: conf.github.secret,
            callbackURL: conf.host + ':' + conf.port + conf.github.url + '/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                return done(null, profile);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    app.get(conf.github.url, passport.authenticate('github'));

    app.get(conf.github.url + '/callback', passport.authenticate('github', {
            failureRedirect: '/'
        }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        }
    );

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}

module.exports = serve;
