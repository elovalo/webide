function init() {
    return {
        inputs: ['distance1'],
        y: 255
    };
}

function effect(cube, vars) {
    vars.y -= ((160 - vars.inputs.distance1 + 40) / 10);

    shape.heart(vars.y);
}
