function evaluate() {
    var ops = {};

    if(window.init) {
        ops.init = null;
    }

    if(window.effect) {
        var effect = [];

        var cube = function() {
            var o = {};

            o.on = function() {
                effect.push('on');
            };
            o.off = function() {
                effect.push('off');
            };

            return o;
        };

        window.effect(cube);
        ops.effect = effect;
    }

    return ops;
}
