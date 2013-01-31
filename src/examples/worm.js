function init() {
    return {
        pos: xyz(4, 4, 4),
        dir: 'x',
        speed: 1
    };
}

function effect(cube, vars) {
    var newPos = vars.pos[vars.dir] + vars.speed;

    cube(vars.pos).on();

    if(newPos < 0 || newPos >= cube.x || math.randint(10) > 7) {
        vars.dir = nextDir();
        vars.speed *= -1;
    }

    vars.pos[vars.dir] += vars.speed;
}

function nextDir(dir) {
    return {
        x: 'y',
        y: 'z',
        z: 'x'
    }[dir];
}
