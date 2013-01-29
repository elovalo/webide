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

    function cube(ops) {
        // TODO: pass these as params to evaluate
        var x = 8;
        var y = 8;
        var z = 8;
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

        ret.xyz = {
            x: x,
            y: y,
            z: z
        };

        ret.x = x;
        ret.y = y;
        ret.z = z;

        return ret;
    }
}

function inject(src, target) {
    for(var k in src) {
        target[k] = src[k];
    }
}
