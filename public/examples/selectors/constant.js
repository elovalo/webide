function effect(cube) {
    cube().off();
    cube({x: 1, z: 3}).on();
}
