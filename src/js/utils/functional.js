define(function(require) {
    var annotate = require('./annotate');
    var is = require('./is');
    var obj = require('./object');

    function partial(fn) {
        var slice = Array.prototype.slice;
        var args = slice.apply(arguments, [1]);
        var ret = function() {
            return fn.apply(null, args.concat(slice.apply(arguments)));
        };

        ret._name = fn._name;
        ret._doc = fn._doc;
        ret._invariants = fn._invariants && fn._invariants.map(function(v) {
            return v.slice(args.length);
        });

        return ret;
    }

    var map = annotate('map', 'Maps using given callback').
        on(is.fn, is.array, mapArray).
        on(is.fn, is.object, mapObject);

    function mapArray(cb, o) {
        var ret = [];

        each(function(v, i) {
            ret.push(cb(v, i));
        }, o);

        return ret;
    }

    function mapObject(cb, o) {
        return ziptoo(zip(obj.keys(o), map(cb, obj.values(o))));
    }

    var zip = annotate('zip', 'Converts given arrays into a zip.').
        on(is.array, is.array, function(a, b) {
            var ret = [];

            for(var i = 0, len = Math.min(a.length, b.length); i < len; i++) {
                ret.push([a[i], b[i]]);
            }

            return ret;
        });

    var ziptoo = annotate('ziptoo', 'Converts given zip to object.').
        on(is.array, function(a) {
            var ret = {};

            each(function(v) {
                ret[v[0]] = v[1];
            }, a);

            return ret;
        });

    var each = annotate('each', 'Executes given `callback` on each item').
        on(is.fn, is.array, function(cb, o) {
            for(var i = 0, len = o.length; i < len; i++) {
                var v = o[i];

                cb(v, i);
            }
        }).
        on(is.fn, is.object, function(cb, o) {
            var i = 0;

            for(var k in o) {
                cb(k, o[k], i);
                i++;
            }
        });

    return {
        partial: partial,
        map: map,
        ziptoo: ziptoo,
        zip: zip,
        each: each
    };
});
