function evaluate(dims) {
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

        ret.xyz = dims;

        ret.x = dims.x;
        ret.y = dims.y;
        ret.z = dims.z;

        return ret;
    }
}

function inject(src, target) {
    for(var k in src) {
        target[k] = src[k];
    }
}
