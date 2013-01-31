function effect() {
    var fac = ((ticks >> 3) % 10) / 10;

    shape.sphere(xyz(-3, -3, -3), 10, 14, fac);
}
