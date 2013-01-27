define(['jsjs'], function() {
    function initCommands($e, editor) {
        // TODO: replace this with play, stop, position etc.
        $('<div>', {'class': 'evaluate command'}).appendTo($e).
            text('Evaluate').
            on('click', function() {
                var jsObjs = JSJS.Init();
                var rval = JSJS.EvaluateScript(
                    jsObjs.cx,
                    jsObjs.glob,
                    editor.getValue()
                );
                var d = JSJS.ValueToNumber(jsObjs.cx, rval);

                window.alert(d);

                JSJS.End(jsObjs);
            });
    }

    return initCommands;
});
