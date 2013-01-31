var wormLength = 10;

function init(cube) {
    return {
        pos: xyz(4, 4, 4),
        dir: 'x',
        speed: 1,
        prev: {
            dirs: [],
            speeds: [],
            i: 0
        }
    };
}

function effect(cube, vars) {
    cube(vars.pos).on();

    // backtracking
    if(vars.prev.dirs[0] != wormLength) {
        var tmpPos = utils.clone(pos);

        for(var i = vars.prev.i - 1, j = 0; j < wormLength; i--, j++) {
            if(i == -1) i = wormLength - 1;

            tmpPos[vars.prev.dirs[i]] -= vars.prev.speeds[i];

            cube(tmpPos).on();
        }
    }

    // relies on the fact that it's a cube
    // not entirely fool proof but probably good enough
    var newPos = vars.pos[vars.dir] + vars.speed;
    if(newPos < 0 || newPos >= cube.x || math.randint(0, 10) > 7) {
        vars.dir = nextDir(vars.dir);
        vars.speed = -vars.speed;
    }

    vars.prev_dirs[vars.prev.dir.i] = vars.dir;
    vars.prev_speeds[vars.prev.dir.i] = vars.speed;

    if(vars.prev.dir.i < wormLength - 1) {
        vars.prev.dir.i++;
    }
    else {
        vars.prev.dir.i = 0;
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
