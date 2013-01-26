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

        $('.editor').each(function() {
            CodeMirror($(this).get(0), {
                value: 'function a() {return 42;}',
                mode: 'javascript',
                indentUnit: 4,
                lineWrapping: true,
                lineNumbers: true
            });
        });
    });
});
