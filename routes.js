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

exports.editorSave = function(req, res) {
    var code = req.param('code');
    var id = req.param('id');
    var status;

    // TODO: refactor status out and replace with 404
    if(code && req.user.id) {
        if(id) {
            effects.getMeta(id, function(err, d) {
                if(err) return res.json({status: 'error'});

                if(req.user.id == d.author) {
                    effects.commit('Save effect', id, code, function(err) {
                        status = err? 'error': 'success';

                        res.json({status: status});
                    });
                }
                else {
                    // new author, fork
                }
            });
        }
        else {
            // TODO: create new effect to repo now
            res.json({status: 'success'});
        }
    }
    else {
        res.json({status: 'error'});
    }
};

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
