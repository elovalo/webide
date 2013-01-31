function effect(cube) {
    var circle = shape.circle;
    var fac = (ticks >> 4) % 2;

    circle(xyz(fac, 0, 0), 9, 13);
    circle(xyz(-fac, 0, 1), 8, 12);
    circle(xyz(0, fac, 2), 7, 11);
    circle(xyz(0, -fac, 3), 7, 10);
    circle(xyz(fac, 0, 4), 6, 9);
    circle(xyz(-fac, 0, 5), 3, 5);
    circle(xyz(0, fac, 6), 1, 3);
    cube({x: fac, y: 4, z: 7}).on();
}
