var effects = require('./utils/effects');

exports.index = function(req, res) {
    effects.get(function(err, data) {
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

    if(code && id) {
        effects.commit('Save effect', id, code, function(err) {
            status = err? 'error': 'success';

            res.json({status: status});
        });
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
        effects.getMeta(function(err, d) {
            if(err) return res.send(404);

            return res.json(d);
        });
    }
};
