function evaluate() {
    if(window.effect) {
        var ops = [];
        var cube = function() {
            var o = {};

            o.on = function() {
                ops.push('on');
            };
            o.off = function() {
                ops.push('off');
            };

            return o;
        };

        window.effect(cube);

        return ops;
    }
}
