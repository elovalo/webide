require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        codemirror: '../components/codemirror/lib/codemirror',
        threejs: '../vendor/three',
        jsjs: '../vendor/libjs.min'
    },
    urlArgs: 'buster=' + (new Date()).getTime() // for dev only! use rev otherwise
});

require(['jquery', './preview', './editor', './commands'], function($, preview, editor, commands) {
    $(function() {
        $('.editor').each(function() {
            var $e = $(this);
            var $commands = $('<div>', {'class': 'commands'}).appendTo($e);
            var $editArea = $('<div>', {'class': 'editArea'}).appendTo($e);

            commands($commands, editor($editArea));
        });
        $('.preview').each(function() {
            preview($(this));
        });
    });
});
