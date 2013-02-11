function effect(cube) {
    cube({z: (ticks >> 7) % cube.z}).on();
}
