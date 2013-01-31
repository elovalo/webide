function effect(cube) {
    var text = 'foobar';
    var pos = (ticks >> 3) % text.length;

    text.scroll(text, pos, axis.xy);
    text.scroll(text, pos - cube.x, axis.xy);
}
