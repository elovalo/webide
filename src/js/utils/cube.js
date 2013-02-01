function evaluateInit(init, dims) {
    var ops = [];
    var vars = {};

    if(init) vars = init(cube(ops, dims));

    return {
        vars: vars,
        ops: ops
    };
}

function evaluateEffect(effect, vars, dims) {
    var ops = [];

    if(effect) effect(cube(ops, dims), vars);

    return {
        vars: vars,
        ops: ops
    };
}

function cube(ops, dims) {
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

function inject(src, target) {
    for(var k in src) {
        target[k] = src[k];
    }
}
