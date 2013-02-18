function evaluateInit(init, dims) {
    var vars = {};

    cube(dims)().off();

    if(init) vars = init(cube(dims));

    return {
        vars: vars
    };
}

function evaluateEffect(effect, dims, vars) {
    if(effect) effect(cube(dims), vars);

    return {
        vars: vars
    };
}

function cube(dims) {
    var ret = function(selector, b, c) {
        var functional = funkit.functional;
        var range = funkit.math.range;
        var o = {};
        var coords = [];
        var freeAxes = [];

        if(is.number(selector)) check([selector, b, c]);
        else if(is.array(selector)) {
            if(functional.filter(is.number, selector).length) check(selector);
            else functional.each(check, selector);
        }
        else if(is.object(selector)) check(selector);
        else selectAll();

        function check(xyz) {
            if(!is.array(xyz) && is.object(xyz)) xyz = [xyz.x, xyz.y, xyz.z];

            freeAxes = functional.map(functional.not(is.set), xyz);
            var freeLen = functional.filter(funkit.id, freeAxes).length;

            if(freeLen > 1) selectAll();
            else if(freeLen === 1) selectLines(xyz);
            else select({x: xyz[0], y: xyz[1], z: xyz[2]});
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

        o.on = function(intensity) {
            intensity = is.set(intensity)? intensity: 1;

            window._ops.push({
                op: 'on',
                coords: coords,
                intensity: intensity
            });
        };
        o.off = function() {
            window._ops.push({
                op: 'off',
                coords: coords
            });
        };
        o.each = function(cb) {
            return ret(map(cb, getXyzs()));
        };
        o.filter = function(cb) {
            return ret(filter(cb, getXyzs()));
        };
        o.map = function(cb) {
            return ret(map(cb, getXyzs()));
        };

        function getXyzs() {
            if(freeAxes.length) {
                return functional.map(function(v, i) {
                    var axis = toProperty(i);

                    if(v) return range(dims[axis]);
                    return [selector[axis]]; // TODO: expand to support more cases
                }, freeAxes);
            }
            return [range(dims.x), range(dims.y), range(dims.z)];
        }

        function toProperty(i) {
            return ['x', 'y', 'z'][i];
        }

        function filter(cb, xyzs) {
            var xs = xyzs[0];
            var ys = xyzs[1];
            var zs = xyzs[2];
            var x, y, z, xLen, yLen, zLen, xyz;
            var ret = [];

            for(x = 0, xLen = xs.length; x < xLen; x++)
                for(y = 0, yLen = ys.length; y < yLen; y++)
                    for(z = 0, zLen = zs.length; z < zLen; z++) {
                        xyz = {x: xs[x], y: ys[y], z: zs[z]};

                        if(cb(xyz)) ret.push(xyz);
                    }

            return ret;
        }

        function map(cb, xyzs) {
            var xs = xyzs[0];
            var ys = xyzs[1];
            var zs = xyzs[2];
            var x, y, z, xLen, yLen, zLen, xyz;
            var ret = [];

            for(x = 0, xLen = xs.length; x < xLen; x++)
                for(y = 0, yLen = ys.length; y < yLen; y++)
                    for(z = 0, zLen = zs.length; z < zLen; z++) {
                        xyz = cb({x: xs[x], y: ys[y], z: zs[z]});

                        if(xyz) ret.push(xyz);
                    }

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
