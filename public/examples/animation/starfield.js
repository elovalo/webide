function init(cube) {
    return {
        stars: range(10).map(partial(math.randint, 0, cube.xyz))
    };
}

function effect(cube, vars) {
    vars.stars = vars.stars.map(function(star) {
        cube(star).on();

        star.y = (star.y + 1) % cube.y;

        return star;
    });
}
