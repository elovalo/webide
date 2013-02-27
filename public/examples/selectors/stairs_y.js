function effect(cube) {
    cube().off();
    cube({z: 0}).map(function(led) {
        led.z = led.y;

        return led;
    }).on();
}
