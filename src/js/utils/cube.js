function evaluate(init, effect, dims) {
    var anim = {};
    var ops;
    var initRes;

    if(!dims) return;

    if(init) {
        ops = [];
        initRes = init(cube(ops));
        anim.init = ops;
    }

    if(effect) {
        ops = [];
        effect(cube(ops), initRes);
        anim.effect = ops;
    }

    return anim;

    function cube(ops) {
        var ret = function(params) {
            var o = {};

            o.on = function() {
                ops.push({
                    op: 'on',
                    params: params
                });
            };
            o.off = function() {
                ops.push({
                    op: 'off',
                    params: params
                });
            };

            return o;
        };

        ret.xyz = {
            x: dims.x - 1,
            y: dims.y - 1,
            z: dims.z - 1
        };

        ret.x = ret.xyz.x;
        ret.y = ret.xyz.y;
        ret.z = ret.xyz.z;

        return ret;
    }
}

function inject(src, target) {
    for(var k in src) {
        target[k] = src[k];
    }
}
