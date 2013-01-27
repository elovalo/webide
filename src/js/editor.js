define(['codemirror'], function() {
    function initEditor($e) {
        return CodeMirror($e.get(0), {
            value: "function a() {\n    return math.clamp(42, 0, 30);\n}\na();",
            mode: 'javascript',
            indentUnit: 4,
            lineWrapping: true,
            lineNumbers: true
        });
    }

    return initEditor;
});
