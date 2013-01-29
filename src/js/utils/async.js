define({
    parallel: function(operation, data, done) {
        var accumData = [];

        for(var i = 0, len = data.length; i < len; i++) {
            operation(data[i], accumulate, i);
        }

        function accumulate(err, d) {
            if(err) return done(err);

            accumData.push(d);

            if(accumData.length == len) done(null, accumData);
        }
    }
});
