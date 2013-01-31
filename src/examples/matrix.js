function init(cube) {
    return {
        dots: range(10).map(partial(randint, xyz(), cube.xyz))
    };
}

function effect(cube, vars) {
    vars.dots = vars.dots.map(function(dot) {
        cube({x: range(cube.x), y: range(cube.y), z: range(dot.z, dot.z + 3)}).on();

        dot.z = (dot.z + 1) % cube.z;

        return dot;
    });
}
