define({
    prop: function(name) {
        return function(o) {
            return o[name];
        };
    }
});
