function evaluate() {
    var anim = {};
    var ops;
    var init;

    if(window.init) {
        ops = [];
        init = window.init(cube(ops));
        anim.init = ops;
    }

    if(window.effect) {
        ops = [];
        window.effect(cube(ops), init);
        anim.effect = ops;
    }

    return anim;
}

function cube(ops) {
    var ret = function() {
        var o = {};

        o.on = function() {
            ops.push('on');
        };
        o.off = function() {
            ops.push('off');
        };

        return o;
    };

    // TODO: pass dims here in some nice way
    ret.xyz = {
        x: 8,
        y: 8,
        z: 8
    };

    return ret;
}
