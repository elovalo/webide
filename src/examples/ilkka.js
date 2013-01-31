function effect(cube) {
    var time = ticks / 100;

    cube({x: range(cube.x), y: range(cube.y)}).forEach(function(led) {
        var tc = Math.cos(time);
        var ts = Math.sin(time);
        var x = led.x * tc - y * ts;
        var y = led.x * ts + y * tc;

        led.z = (1 + Math.sin(0.8 * (x + y + time)));
        cube(led).on();
    });
}
