define(['jquery'], function($) {
    // https://github.com/josscrowcroft/javascript-sandbox-console
    function init($e, editor) {
        var frame = $('<iframe width="0" height="0"/>').
            css({visibility: 'hidden'}).
            appendTo('body')[0];
        var sb = frame.contentWindow;

        sb.frame = frame;

        return sb;
    }

    function evaluate(sb, value) {
        return sb.eval(value);
    }
    init.evaluate = evaluate;

    function load(sb, src) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'js/utils/' + src + '.js';

        sb.frame.contentDocument.body.appendChild(script);
    }
    init.load = load;

    return init;
});
