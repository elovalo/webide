function effect(cube) {
    var limit = 100;
    var water = ((ticks >> 10) % 7) + 1;
    var surface = ticks % (limit + 1);

    cube().off();
    cube({z: 0}).map(function(led) {
        led.z = cube.z - ((ticks >> 5) + math.random()) & 7;

        return led;
    }).on(0.5);
    cube({x: range(cube.x), z: range(water)}).on(0.8);
}
