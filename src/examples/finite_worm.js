function init(cube) {
    var segments = queue(10);
    segments.push(xyz(4, 4, 4));

    return {
        segments: segments,
        dir: 'x',
        speed: 1
    };
}

function effect(cube, vars) {
    var segment = segments.last();

    cube().off();
    cube(segments).on();

    // figure out next segment
    // relies on the fact that it's a cube
    // not entirely fool proof but probably good enough
    var newPos = vars.pos[vars.dir] + vars.speed;
    if(newPos < 0 || newPos >= cube.x || math.randint(0, 10) > 7) {
        vars.dir = nextDir(vars.dir);
        vars.speed = -vars.speed;
    }

    var newSegment = segment.clone();
    newSegment[vars.dir] += vars.speed;
    segments.push(newSegment);
}

function nextDir(dir) {
    return {
        x: 'y',
        y: 'z',
        z: 'x'
    }[dir];
}
