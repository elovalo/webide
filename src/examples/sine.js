function effect(cube) {
    cube({x: range(cube.x), y: range(cube.y)}).map(function(led) {
        led.z = 0.25 * (2 + math.sin(led.x / 2 + ticks / 25) + sin(y / 2 + ticks / 50));

        return led;
    }).on();
}
