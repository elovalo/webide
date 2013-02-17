var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var path = require('path');
var jqtpl = require('jqtpl');
var config;

try {
    config = require('./config.json');
}
catch (e) {
    config = {
        cookieSecret: 'developersecret'
    };
}

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');

    app.set('view engine', 'html');
    app.set('view options', {layout: false});

    app.engine('html', jqtpl.__express);

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(config.cookieSecret));
    app.use(express.session());
    app.use(app.router);
    app.use(express['static'](path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/editor', routes.editor);

module.exports = app;
