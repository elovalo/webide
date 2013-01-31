function effect(cube) {
    var water = ((ticks >> 7) % 7) + 1;
    var surface = ticks & 127;

    cube({z: 0}).map(function(led) {
        led.z = ((ticks >> 3) + math.rand()) & 7;

        return led;
    }).on(0.25);
    cube({x: range(cube.x), y: range(cube.y), z: range(water, cube.z)}).on();
    cube({x: range(cube.x), y: range(cube.y), z: range(water, cube.z)}).on(wf(surface << 1));
}
