function evaluateInit(init, dims) {
    var ops = [];
    var vars = {};

    if(init) vars = init(cube(ops, dims));

    return {
        vars: vars,
        ops: ops
    };
}

function evaluateEffect(effect, dims, vars) {
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
        var range = funkit.math.range;
        var o = {};
        var coords = [];
        var freeAxes = [];

        if(is.number(selector)) check([selector, b, c]);
        else if(is.array(selector)) check(selector);
        else if(is.object(selector)) check([selector.x, selector.y, selector.z]);
        else selectAll();

        function check(xyz) {
            freeAxes = functional.map(functional.not(is.set), xyz);
            var freeLen = functional.filter(funkit.id, freeAxes).length;

            if(freeLen > 1) selectAll();
            else if(freeLen === 1) selectLines(xyz);
            else select.apply(undefined, xyz);
        }

        function selectAll() {
            selectKernel([range(dims.x), range(dims.y), range(dims.z)]);
        }

        function selectLines(xyz) {
            selectKernel(functional.map(function(v, i) {
                if(is.array(v)) return v;
                if(is.number(v)) return [v];
                return range(dims[toProperty(i)]);
            }, xyz));
        }

        function selectKernel(xyzs) {
            map(select, xyzs);
        }

        function select(xyz) {
            coords.push(xyz);
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
            return ret(map(cb, functional.map(function(v, i) {
                var axis = toProperty(i);

                if(v) return range(dims[axis]);
                return [selector[axis]]; // TODO: expand to support more cases
            }, freeAxes)));
        };

        function toProperty(i) {
            return ['x', 'y', 'z'][i];
        }

        function map(cb, xyzs) {
            var xs = xyzs[0];
            var ys = xyzs[1];
            var zs = xyzs[2];
            var x, y, z, xLen, yLen, zLen;
            var ret = [];

            for(x = 0, xLen = xs.length; x < xLen; x++)
                for(y = 0, yLen = ys.length; y < yLen; y++)
                    for(z = 0, zLen = zs.length; z < zLen; z++)
                        ret.push(cb({x: xs[x], y: ys[y], z: zs[z]}));

            return ret;
        }



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
