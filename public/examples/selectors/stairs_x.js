function init(cube) {
    cube({z: 0}).map(function(led) {
        led.z = led.x;

        return led;
    }).on();
}
