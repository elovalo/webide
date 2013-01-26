require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        threejs: '../ext/three',
        codemirror: '../components/codemirror/lib/codemirror'
    },
    urlArgs: 'buster=' + (new Date()).getTime() // for dev only! use rev otherwise
});

require(['jquery', 'codemirror', 'threejs'], function($) {
    $(function() {
        // TODO: draw some leds now
        // TODO: draw ide
        // TODO: eval

        init();
    });

    function init() {
        $('.editor').each(function() {
            initEditor($(this).get(0));
        });
        $('.preview').each(function() {
            // TODO: init
        });
    }

    function initEditor(e) {
        CodeMirror(e, {
            value: 'function a() {return 42;}',
            mode: 'javascript',
            indentUnit: 4,
            lineWrapping: true,
            lineNumbers: true
        });
    }
});
