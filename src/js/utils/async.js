define(function(require) {
    var annotate = require('annotate');
    var is = require('is-js');

    function parallel(operation, data, done) {
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

    return {
        parallel: annotate('parallel', 'Runs given `operation` on `data` in parallel and executes `done` once finished.').
            on(is.fn, is.array, is.fn, parallel)
    };
});
