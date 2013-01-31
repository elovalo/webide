function init(cube) {
    // whole cube
    cube().on();

    // all x from 0 to cube.x - 3 - 1 -> whole
    cube({x: range(cube.x - 3)}).on();

    // all x = 3, y = 7 (z is free)
    cube({x: 3, y: 7}).on();

    // specific led
    cube({x: 2, y: 4, z: 1}).on();
    cube([2, 4, 1]).on();
    cube(2, 4, 1).on();

    // multiple specific leds
    cube([{x: 1, y: 2, z: 3}, {x: 4, y: 5, z: 6}]).on();
    cube([[1, 2, 3], [4, 5, 6]]);
}
