exports.index = function(req, res) {
    res.render('index', {
        title: 'Elovalo Webide',
        effects: ['foo', 'bar']
    });
};

exports.editor = function(req, res) {
    res.render('editor', {title: 'Effect editor'});
};
