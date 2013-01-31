function init() {
    return {
        inputs: ['distance1', 'distance2', 'ambientLight', 'soundPressure']
    };
}

function effect(cube, vars) {
    var input = vars.input;

    cube({x: range(2), z: Math.min(input.distance1 / 20, cube.z)}).on();
    cube({x: range(2, 4), z: Math.min(input.distance2 / 20, cube.z)}).on();
    cube({x: range(4, 6), z: input.ambientLight / 32}).on();
    cube({x: range(6, 8), z: input.soundPressure / 32}).on();
}
