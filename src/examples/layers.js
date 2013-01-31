function effect(cube) {
    cube({x: range(cube.x), y: range(cube.y), z: (ticks >> 7) % cube.z}).on();
}
