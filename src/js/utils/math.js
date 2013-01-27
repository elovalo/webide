// TODO: wrap in define
var math = {
    randint: function(min, max) {
        if(max < min) return;

        return Math.ceil(Math.random() * (max + 1 - min)) - 1 + min;
    },
    clamp: function(a, min, max) {
        return Math.max(min, Math.min(max, a));
    }
};
