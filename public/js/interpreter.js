if(typeof module === 'object' && typeof define !== 'function') {
    var define = function (factory) {
        module.exports = factory(require, exports, module);
    };
}

define(function(require) {
    var funkit = require('funkit');
    var is = require('is-js');
    var cube = require('./cube');

    function initSandbox(sb, completion) {
        var deps = {
            funkit: funkit,
            math: funkit.math,
            range: funkit.math.range,
            partial: funkit.partial
        };
        var n;

        sb.is = is;

        // TODO: merge with below
        for(n in deps) {
            sb[n] = deps[n];

            if(completion) window[n] = deps[n];
        }

        for(n in cube) {
            sb[n] = cube[n];

            if(completion) window[n] = deps[n];
        }

        sb.evaluateInit = function(init, dims) {
            var ops = [];
            var vars = {};

            if(init) {
                cube.cube(dims, ops)().off();
                vars = init(cube.cube(dims, ops));
            }

            return {
                vars: vars,
                ops: ops
            };
        };

        sb.evaluateEffect = function(effect, dims, vars) {
            var ops = [];

            if(effect) {
                effect(cube.cube(dims, ops), vars);
            }

            return ops;
        };
    }

    function convertOps(dims, ops) {
        var ret = funkit.math.range(512); // XXX: generate based on dims

        ops.forEach(function(op) {
            if(!op) return;

            return {
                on: function() {
                    convertFrame(dims, ret, op.coords, op.intensity);
                },
                off: function() {
                    convertFrame(dims, ret, op.coords, 0);
                }
            }[op.op]();
        });

        return ret;
    }

    function convertFrame(dims, data, coords, alpha) {
        coords.forEach(function(c) {
            data[parseInt(c.x, 10) + parseInt(c.y, 10) * dims.x * dims.y + parseInt(c.z, 10) * dims.z] = alpha;
        });

        return data;
    }

    return function(sb, dims, cbs) {
        var vars, ok, prevTime, curTime, ops, ret;

        initSandbox(sb);

        sb.ticks = 0;
        prevTime = new Date().getTime();

        sb.eval('function getInit() {var init;' + cbs.code() + ';return init;}');
        ret = sb.evaluateInit(sb.getInit(), dims);
        vars = ret.vars;
        ops = convertOps(dims, ret.ops);

        cbs.execute({ops: ops}, function(ticks) {
            ops = [];

            curTime = new Date().getTime();
            sb.ticks += curTime - prevTime;
            prevTime = curTime;

            ok = true;

            try {
                sb.eval('function getEffect() {var effect;' + cbs.code() + ';return effect;}');

                ops = sb.evaluateEffect(sb.getEffect(), dims, vars);

                cbs.ok();
            } catch(e) {
                ok = false;

                cbs.error(e);
            }

            return mergeInto({
                ok: ok,
                ops: convertOps(dims, ops),
                ticks: sb.ticks
            }, cbs.playing());
        });
    };

    // http://stackoverflow.com/questions/4740806/native-way-to-merge-objects-in-javascript
    // using this so we avoid external deps
    function mergeInto(o1, o2) {
        if(o1 == null || o2 == null) return o1;

        for(var key in o2) if(o2.hasOwnProperty(key)) o1[key] = o2[key];

        return o1;
    }
});
