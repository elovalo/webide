define(['codemirror', 'matchbrackets', 'continuecomment', 'javascripthint', 'javascriptmode'], function() {
    function initEditor($e) {
        return CodeMirror($e.get(0), {
            value: "function effect(cube) {\n    cube().off();\n}",
            mode: 'javascript',
            indentUnit: 4,
            lineWrapping: true,
            lineNumbers: true,
            matchBrackets: true
        });
    }

    return initEditor;
});
