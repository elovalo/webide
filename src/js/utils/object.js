define(['annotate', 'is-js'], function(annotate, is) {
    function keys(o) {
        return Object.keys(o);
    }

    function values(o) {
        var ret = [];

        for(var k in o) ret.push(o[k]);

        return ret;
    }

    return {
        keys: annotate('keys', 'Returns keys of the given object.').
            on(is.object, keys),
        values: annotate('values', 'Returns values of the given object.').
            on(is.object, values)
    };
});
