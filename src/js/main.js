require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        codemirror: '../components/codemirror/lib/codemirror',
        threejs: '../vendor/three'
    },
    urlArgs: 'buster=' + (new Date()).getTime() // for dev only! use rev otherwise
});

require(['jquery', './preview', './editor', './commands'], function($, preview, editor, commands) {
    $(function() {
        // TODO: figure out how to deal with this. hook up cb at command?
        var previews = [];
        previews.evaluate = function(ops) {
            previews.forEach(function(p) {
                p.evaluate(ops);
            });
        };

        $('.preview').each(function() {
            previews.push(preview($(this)));
        });
        $('.editor').each(function() {
            var $e = $(this);
            var $commands = $('<div>', {'class': 'commands'}).appendTo($e);
            var $editArea = $('<div>', {'class': 'editArea'}).appendTo($e);

            commands($commands, editor($editArea), previews);
        });
    });
});
