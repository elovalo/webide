function evaluateInit(init, dims) {
    var vars = {};

    cube(dims)().off();

    if(init) return init(cube(dims));
}

function evaluateEffect(effect, dims, vars) {
    if(effect) effect(cube(dims), vars);
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

function xyz() {
    return {x: 0, y: 0, z: 0};
}

function wf(i) {
    i = funkit.math.clamp(i, 0, 1);

    var values = [0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,14,14,14,14,14,14,15,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,20,20,21,21,21,22,22,23,23,23,24,24,25,26,26,27,27,28,28,29,30,30,31,32,33,33,34,35,36,37,38,39,40,41,42,43,44,45,46,48,49,50,52,53,54,56,57,59,61,62,64,66,68,70,72,74,76,78,81,83,85,88,91,93,96,99,102,105,108,112,115,118,122,126,130,134,138,142,147,151,156,161,166,171,176,182,188,193,200,206,212,219,226,233,241,248,256,265,273,282,291,300,310,320,330,341,352,363,375,387,400,412,426,440,454,469,484,500,516,533,550,568,587,606,625,646,667,689,711,735,759,784,809,836,863,891,921,951,982,1014,1048,1082,1118,1154,1192,1232,1272,1314,1357,1402,1448,1496,1545,1596,1649,1703,1759,1817,1877,1939,2003,2069,2137,2208,2281,2356,2434,2514,2597,2683,2772,2863,2958,3056,3157,3261,3369,3480,3595,3714,3837,3964,4095];

    return values[funkit.math.round(i * values.length)] / 4095;
}
