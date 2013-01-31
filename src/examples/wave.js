function init() {
    return {
        avg: 0,
        inputs: ['distance1']
    };
}

function effect(cube, vars) {
    var fac = 0.25;

    vars.avg = (0.9 * vars.avg) + (0.1 * vars.inputs.distance1);

    cube({x: range(cube.x), y: range(cube.y)}).
        on(fac * (2 * math.sin(x * 50 * ticks / 15 + vars.avg / 10)));
}
