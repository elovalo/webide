function init() {
    shape.heart(wf.max);
}

function effect(cube, vars) {
    var isAlive = false;

    cube().each(function(led) {
        var neighbours = led.neighbours().length;

        if(neighbours >= 6 && neighbours <= 15 || math.randint(0, 10) > 8) {
            isAlive = true;
            cube(led).on();
        }
        else cube(led).off();
    });
}
