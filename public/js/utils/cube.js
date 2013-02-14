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
    var ret = function(selector, b, c) {
        var functional = funkit.functional;
        var o = {};
        var coords = [];

        if(is.number(selector)) check([selector, b, c]);
        else if(is.array(selector)) check(selector);
        else if(is.object(selector)) check([selector.x, selector.y, selector.z]);
        else selectAll();

        function check(xyz) {
            var freeAxes = functional.map(functional.not(is.set), xyz);
            var freeLen = functional.filter(funkit.id, freeAxes).length;

            if(freeLen > 1) selectAll();
            else if(freeLen === 1) selectPlanes(xyz);
            else select(xyz);
        }

        function selectAll() {
            for(var x = 0, xLen = dims.x; x < xLen; x++) {
                for(var y = 0, yLen = dims.y; y < yLen; y++) {
                    for(var z = 0, zLen = dims.z; z < zLen; z++) {
                        select([x, y, z]);
                    }
                }
            }
        }

        function selectPlanes(xyz) {
            // TODO
            console.log('select planes', xyz, 'now');
        }

        function select(xyz) {
            coords.push({x: xyz[0], y: xyz[1], z: xyz[2]});
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
