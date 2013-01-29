define(function(require) {
    var annotate = require('./annotate');
    var is = require('./is');

    function randint(min, max) {
        if(max < min) return;

        return Math.ceil(Math.random() * (max + 1 - min)) - 1 + min;
    }

    function clamp(a, min, max) {
        return Math.max(min, Math.min(max, a));
    }

    function rdiv(y, x) {
        return x / y;
    }

    return {
        randint: annotate('randint', 'Chooses a number between given bounds, bounds included').
            on(is.number, is.number, randint),
        clamp: annotate('clamp', 'Clamps given number between given bounds').
            on(is.number, is.number, is.number, clamp),
        rdiv: annotate('rdiv', 'Right associative div operator').
            on(is.number, is.number, rdiv)
    };
});
