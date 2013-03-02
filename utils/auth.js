var passport = require('passport');
var gh = require('passport-github').Strategy;

var conf = require('../conf.json');

function plain(app) {
    app.get('/auth/plain', function(req, res) {
        // XXX: should go into req.user but not working for some reason
        req.session.user = {
            id: 123456,
            username: 'Developer'
        };

        res.redirect('back');
    });

    app.get('/logout', function(req, res) {
        delete req.session.user;

        res.redirect('back');
    });
}
exports.plain = plain;

// https://github.com/jaredhanson/passport-github/tree/master/examples/login
function github(app) {
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
            res.redirect('back');
        }
    );

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('back');
    });
}
exports.github = github;
