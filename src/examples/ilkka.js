function effect(cube) {
    var time = ticks / 100;

    cube({x: range(cube.x), y: range(cube.y)}).forEach(function(led) {
        var tc = math.cos(time);
        var ts = math.sin(time);
        var x = led.x * tc - y * ts;
        var y = led.x * ts + y * tc;

        led.z = (1 + math.sin(0.8 * (x + y + time)));
        cube(led).on();
    });
}
