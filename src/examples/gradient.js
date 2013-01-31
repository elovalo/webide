function effect(cube) {
    var cur = (ticks >> 5) % 8;

    cube({x: range(cube.x), z: range(cube.z)}).forEach(function(led) {
        var fac = led.z <= cur? (cur - led.z) * 0.1: 0;

        cube({x: led.x, y: cube.z - 1 - led.z}).on(fac);
    });
}
