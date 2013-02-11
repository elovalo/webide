function effect(cube) {
    var blinkRate = 4;

    if(ticks % blinkRate) shape.cube(xyz(), cube.xyz);
    else cube().on();
}
