define(['codemirror', 'matchbrackets', 'continuecomment', 'showhint', 'javascripthint', 'javascriptmode'], function() {
    function initEditor($e, code) {
        CodeMirror.commands.autocomplete = function(cm) {
            CodeMirror.showHint(cm, CodeMirror.javascriptHint);
        };

        return CodeMirror($e.get(0), {
            value: code,
            mode: 'javascript',
            indentUnit: 4,
            lineWrapping: true,
            lineNumbers: true,
            matchBrackets: true,
            extraKeys: {'Ctrl-Space': 'autocomplete'}
        });
    }

    return initEditor;
});
