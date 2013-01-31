function effect() {
    var randint = math.randint;

    if((ticks % 10) === 0) shape.line(randint(xyz(), cube.xyz), randint(xyz(), cube.xyz));
}
