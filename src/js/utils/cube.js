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
    return function() {
        var o = {};

        o.on = function() {
            ops.push('on');
        };
        o.off = function() {
            ops.push('off');
        };

        return o;
    };
}
