function effect() {
    var txt = getTime();
    var pos = (ticks >> 3) % ((txt.length + 4) * 8);

    text.scroll(txt, pos, axis.yz);
    text.scroll(txt, pos-7, axiz.yz);
}

function getTime() {
    var now = new Date();

    return [
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    ].map(pad).join(':');

    function pad(n) {
        return n < 10? '0' + n: n;
    }
}
