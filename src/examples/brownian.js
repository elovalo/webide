function init(cube) {
    return {
        xyz: cube.xyz.map(partial(math.rdiv, 2))
    };
}

function effect(cube, vars) {
    cube(vars.xyz).on();

    vars.xyz = vars.xyz.map(function(v) {
        return math.clamp(v + math.randint(-2, 2), 0, cube.x - 1);
    });
}
