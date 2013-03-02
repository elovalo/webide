var effects = require('./effects');
var remote = require('./utils/remote');
var conf = require('./conf.json');


exports.index = function(req, res) {
    effects.getAll(function(err, data) {
        res.render('index', {
            title: 'Elovalo Webide', // TODO: move to tpl
            effects: data,
            user: getUser(req),
            dev: conf.dev
        });
    });
};

exports.editor = function(req, res) {
    var id = req.query.id;

    if(id) {
        effects.read(id, function(err, d) {
            res.render('editor', {
                title: 'Effect editor', // TODO: move to tpl
                initialCode: d,
                codeId: id,
                user: getUser(req),
                dev: conf.dev
            });
        });
    }
    else {
        res.render('editor', {
            title: 'Effect editor', // TODO: move to tpl
            user: getUser(req),
            initialCode: undefined,
            codeId: undefined,
            dev: conf.dev
        });
    }
};

exports.editorPost = function(req, res) {
    var ops = {
        save: save,
        playbackOnCube: playbackOnCube,
        stopOnCube: stopOnCube,
        pingOnCube: pingOnCube
    }[req.param('op')](req, res);
};

function save(req, res) {
    var code = req.param('code');
    var id = req.param('id') || req.session.effectId;
    var author = getUser(req).id;
    var status;

    // TODO: attach name
    // TODO: attach description
    if(code && author) {
        if(id) {
            console.log('updating effect', author, id);
            effects.getMeta(id, function(err, d) {
                if(err) return res.send(404);

                if(author == d.author) {
                    effects.commitEffect('Save effect', id, code, function(err) {
                        if(err) return res.send(404);

                        res.send(200);
                    });
                }
                else {
                    console.log('forking effect', author, d.author);
                    createEffect(req, res, {author: author, code: code, parent: d.author});
                }
            });
        }
        else {
            console.log('creating effect', author);
            createEffect(req, res, {author: author, code: code});
        }
    }
    else res.send(404);
}

function playbackOnCube(req, res) {
    var author = getUser(req).id;
    var code = req.param('code');

    if(author && code) {
        remote.play(req, author, code);

        res.send(200);
    }
    else res.send(404);
}

function stopOnCube(req, res) {
    var author = getUser(req).id;

    if(author) {
        remote.stop(req, author);

        res.send(200);
    }
    else res.send(404);
}

function pingOnCube(req, res) {
    var author = getUser(req).id;
    var code = req.param('code');

    if(author) {
        remote.ping(req, author, code);

        res.send(200);
    }
    else stopOnCube(req, res);
}

function createEffect(req, res, o) {
    effects.create(o, function(err, d) {
        if(err) return res.send(400);

        res.send(200);

        req.session.effectId = d.id;
    });
}

exports.effects = function(req, res) {
    var id = req.query.id;

    if(id) {
        effects.read(id, function(err, d) {
            if(err) return res.send(404);

            return res.send(d);
        });
    }
    else {
        effects.getAllMeta(function(err, d) {
            if(err) return res.send(404);

            return res.json(d);
        });
    }
};

// TODO: eliminate this by fixing plain auth
function getUser(req) {
    return req.user? req.user: req.session.user;
}
