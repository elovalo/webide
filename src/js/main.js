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
        console.log('ready');
        console.log($, THREE);
    });
});
