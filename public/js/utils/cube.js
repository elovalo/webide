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
    var ret = function(selector) {
        var o = {};
        var coords = [];

        if(selector) {
            // TODO: expand
            if(is.array(selector)) {
                coords = selector;
            }
        }
        else {
            for(var x = 0, xLen = dims.x; x < xLen; x++) {
                for(var y = 0, yLen = dims.y; y < yLen; y++) {
                    for(var z = 0, zLen = dims.z; z < zLen; z++) {
                        coords.push({x: x, y: y, z: z});
                    }
                }
            }
        }

        o.on = function() {
            ops.push({
                op: 'on',
                coords: coords
            });
        };
        o.off = function() {
            ops.push({
                op: 'off',
                coords: coords
            });
        };
        o.map = function(cb) {
            return ret(coords.map(cb));
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
