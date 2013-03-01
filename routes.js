var effects = require('./effects');

exports.index = function(req, res) {
    effects.getAll(function(err, data) {
        res.render('index', {
            title: 'Elovalo Webide', // TODO: move to tpl
            effects: data,
            user: req.user
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
                user: req.user
            });
        });
    }
    else {
        res.render('editor', {
            title: 'Effect editor', // TODO: move to tpl
            user: req.user,
            initialCode: undefined,
            codeId: undefined
        });
    }
};

exports.editorPost = function(req, res) {
    var ops = {
        save: save,
        playbackOnCube: playbackOnCube,
        stopOnCube: stopOnCube
    }[req.param('op')](req, res);
};

function save(req, res) {
    var code = req.param('code');
    var id = req.param('id') || req.session.effectId;
    var author = req.user.id;
    var status;

    // TODO: attach name
    // TODO: attach description
    if(code && author) {
        if(id) {
            effects.getMeta(id, function(err, d) {
                if(err) return res.send(404);

                if(author == d.author) {
                    effects.commitEffect('Save effect', id, code, function(err) {
                        if(err) return res.send(404);

                        res.send(200);
                    });
                }
                else createEffect(req, res, {author: author, code: code, parent: d.author});
            });
        }
        else createEffect(req, res, {author: author, code: code});
    }
    else res.send(404);
}

function playbackOnCube(req, res) {
    var code = req.param('code');
    var author = req.user.id;

    if(code && author) {
        console.log('should play on cube now');

        res.send(200);
    }
    else res.send(404);
}

function stopOnCube(req, res) {
    var author = req.user.id;

    if(author) {
        console.log('should stop on cube now');

        res.send(200);
    }
    else res.send(404);
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
