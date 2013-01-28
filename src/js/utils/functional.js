function partial(fn) {
    var slice = Array.prototype.slice;
    var args = slice.apply(arguments, [1]);
    return function() {
        return fn.apply(null, args.concat(slice.apply(arguments)));
    };
}
