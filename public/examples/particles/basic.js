function init(cube) {
    return {
        particles: range(5).map(partial(math.randint, xyz(), cube.xyz))
    };
}

function effect(cube, vars) {
    if(ticks & 50) return;

    vars.particles = vars.particles.map(function(p) {
        cube(p).on();

        return p.map(function(c, axis) {
            return math.clamp(c + math.randint(-1, 1), 0, cube[axis]);
        });
    });
}
