define(['./sandbox'], function(sandbox) {
    // https://github.com/josscrowcroft/javascript-sandbox-console
    function initCommands($e, editor) {
        var sb = sandbox();
        sandbox.load(sb, 'module');
        sandbox.load(sb, 'math');
        sandbox.load(sb, 'cube');

        // TODO: replace this with play, stop, position etc.
        $('<div>', {'class': 'evaluate command'}).appendTo($e).
            text('Evaluate').
            on('click', function() {
                var code = editor.getValue() + 'evaluate();';
                var res = sandbox.evaluate(sb, code);

                console.log(res);

                // TODO: evaluate res using webgl now
            });
    }

    return initCommands;
});
