function effect(cube) {
    var time = ticks / 100;

    cube().off();
    cube({z: 0}).map(function(led) {
        var tc = math.cos(time);
        var ts = math.sin(time);
        var x = (led.x * tc - led.y * ts);
        var y = (led.x * ts + led.y * tc);

        led.z = (1 + math.sin(0.8 * (x + y + time)));

        return led;
    }).on();
}
