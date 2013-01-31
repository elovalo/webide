function effect(cube) {
    var a = (ticks >> 5) & cube.x;
    var b = cube.x - ((ticks >> 5) & 7);

    shape.cube(xyz(a, a, a), xyz(b, b, b));
}
