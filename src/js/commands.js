define(['./sandbox'], function(sandbox) {
    // https://github.com/josscrowcroft/javascript-sandbox-console
    function initCommands($e, editor) {
        var sb = sandbox();
        sandbox.load(sb, 'math');

        // TODO: replace this with play, stop, position etc.
        $('<div>', {'class': 'evaluate command'}).appendTo($e).
            text('Evaluate').
            on('click', function() {
                var res = sandbox.evaluate(sb, editor.getValue());

                console.log(res);
            });
    }

    return initCommands;
});
