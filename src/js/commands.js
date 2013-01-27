define(function() {
    function initCommands($e, editor) {
        var sandbox = $('<iframe width="0" height="0"/>').
            css({visibility: 'hidden'}).
            appendTo('body')[0].contentWindow;

        // TODO: replace this with play, stop, position etc.
        $('<div>', {'class': 'evaluate command'}).appendTo($e).
            text('Evaluate').
            on('click', function() {
                console.log(sandbox.eval(editor.getValue()));
            });
    }

    return initCommands;
});
