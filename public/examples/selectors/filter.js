function effect(cube) {
    cube().off();
    cube().filter(function(led) {
        return led.z >= 6;
    }).on();
}
