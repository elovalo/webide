function init(cube) {
    // examples of led selector syntax
    cube().on(); // whole cube
    cube({x: range(cube.x - 3)}).on(); // all x from 0 to cube.x - 3 - 1 -> whole
    cube({x: 3, y: 7}).on(); // all x = 3, y = 7 (z is free)
    cube({x: 2, y: 4, z: 1}).on(); // specific led
    cube([2, 4, 1]).on(); // specific led, accepts array too
}
