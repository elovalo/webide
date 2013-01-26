define(['require'], function(require) {
    var math = require('math');

    return {
        init: function(cube) {
            return {
                xyz: {
                    x: cube.x / 2,
                    y: cube.y / 2,
                    z: cube.z / 2
                }
            };
        },
        effect: function(cube, vars) {
            cube(vars.xyz).on();

            vars.xyz = vars.xyz.map(function(v) {
                return math.clamp(v + math.randint(-2, 2), 0, cube.x - 1);
            });
        }
    };
});
