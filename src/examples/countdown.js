function init() {
    return {
        cur: 15
    };
}

function effect(cube, vars) {
    text.scroll(vars.cur, 9, axis.yz);
    text.scroll(vars.cur, 9 + cube.y, axis.xy);

    vars.cur = Math.max(0, vars.cur - 1);
}
