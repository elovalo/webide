function effect(cube) {
    var cur = (ticks >> 5) % 8;

    cube({y: 0}).each(function(led) {
        var fac = led.z <= cur? (cur - led.z) * 0.1: 0;

        cube({x: led.x, y: cube.z - 1 - led.z}).on(fac);
    });
}
