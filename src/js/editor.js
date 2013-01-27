define(['codemirror'], function() {
    function initEditor($e) {
        return CodeMirror($e.get(0), {
            value: 'function a() {\n    return 42;\n}\na();',
            mode: 'javascript',
            indentUnit: 4,
            lineWrapping: true,
            lineNumbers: true
        });
    }

    return initEditor;
});
