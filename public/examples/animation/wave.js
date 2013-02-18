function init() {
    return {
        avg: 0,
        inputs: ['distance1']
    };
}

function effect(cube, vars) {
    vars.avg = (0.9 * vars.avg) + (0.1 * vars.inputs.distance1);

    cube({z: 0}).on(0.25 * (2 * math.sin(cube.x * 50 * ticks / 15 + vars.avg / 10)));
}
