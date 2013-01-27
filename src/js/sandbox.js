define(['jquery'], function($) {
    // https://github.com/josscrowcroft/javascript-sandbox-console
    function init($e, editor) {
        return $('<iframe width="0" height="0"/>').
            css({visibility: 'hidden'}).
            appendTo('body')[0].contentWindow;
    }

    function evaluate(sb, value) {
        return sb.eval(value);
    }
    init.evaluate = evaluate;

    function load() {
        // TODO
    }
    init.load = load;

    return init;
});
