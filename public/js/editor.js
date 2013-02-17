define(['codemirror', 'matchbrackets', 'continuecomment', 'showhint', 'javascripthint', 'javascriptmode'], function() {
    function initEditor($e) {
        CodeMirror.commands.autocomplete = function(cm) {
            CodeMirror.showHint(cm, function(editor, options) {
                var keywords = CodeMirror.javascriptKeywords;

                // XXX: not ideal. merge with commands aliases somehow
                keywords = keywords.concat(['funkit', 'math', 'range']);

                // TODO: make this context sensitive (so funkit. shows children
                // etc.)

                return CodeMirror.scriptHint(editor, keywords, function(e, cur) {
                    return e.getTokenAt(cur);
                }, options);
            });
        };

        return CodeMirror($e.get(0), {
            value: "function effect(cube) {\n    cube().on();\n}",
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
