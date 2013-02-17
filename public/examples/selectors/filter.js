function init(cube) {
    cube().filter(function(led) {
        return led.z >= 6;
    }).on();
}
