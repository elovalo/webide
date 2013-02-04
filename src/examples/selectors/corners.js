function init(cube) {
    var z;

    for(var i = 0; i < 2; i++) {
        z = i * cube.z;

        cube({x: 0, y: 0, z: z}).on();
        cube({x: 0, y: cube.y, z: z}).on();
        cube({x: cube.x, y: 0, z: z}).on();
        cube({x: cube.x, y: cube.y, z: z}).on();
    }
}
