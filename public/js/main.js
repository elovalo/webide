require.config({
    packages: [
        {
            name: 'funkit',
            location: '../components/funkit/lib',
            main: 'index'
        }
    ],
    paths: {
        annotate: '../components/annotate.js/lib/annotate',
        'is-js': '../components/is/is',
        jquery: '../components/jquery/jquery',
        sandboxy: '../components/sandboxy/sandboxy',

        codemirror: '../components/codemirror/lib/codemirror',
        matchbrackets: '../components/codemirror/addon/edit/matchbrackets',
        continuecomment: '../components/codemirror/addon/edit/continuecomment',
        showhint: '../components/codemirror/addon/hint/show-hint',
        javascripthint: '../components/codemirror/addon/hint/javascript-hint',
        javascriptmode: '../components/codemirror/mode/javascript/javascript',

        threejs: '../vendor/three',
        trackball: '../vendor/three.trackball'
    },
    shim: {
        matchbrackets: ['codemirror'],
        continuecomment: ['codemirror'],
        showhint: ['codemirror'],
        javascripthint: ['codemirror'],
        javascriptmode: ['codemirror'],
        trackball: ['threejs']
    },
    urlArgs: 'buster=' + (new Date()).getTime() // for dev only! use rev otherwise
});

require(['jquery', './preview', './editor', './commands'], function($, preview, editor, commands) {
    $(function() {
        var dims = {x: 8, y: 8, z: 8};
        // TODO: figure out how to deal with this. hook up cb at command?
        var previews = [];
        previews.evaluate = function(ops, cb) {
            previews.forEach(function(p) {
                p.evaluate(ops, cb);
            });
        };

        $('.preview').each(function() {
            previews.push(preview($(this), dims));
        });

        var code = getCode();
        $('.editor').each(function() {
            var $e = $(this);
            var $editArea = $('<div>', {'class': 'editArea'}).appendTo($e);

            commands($e, editor($editArea, code), previews, dims);
        });
    });

    function getCode() {
        var $initial = $('.initialCode');
        var initial = $initial.text();

        $initial.remove();

        return initial || 'function effect(cube) {\n    cube().on();\n}';
    }
});
