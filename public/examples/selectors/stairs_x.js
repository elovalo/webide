function effect(cube) {
    cube().off();
    cube({x: 0}).map(function(led) {
        led.x = led.z;

        return led;
    }).on();
}
