define(function(require) {
    var parallel = require('./utils/async').parallel;
    var $ = require('jquery');

    // https://github.com/josscrowcroft/javascript-sandbox-console
    function init($e, editor) {
        var frame = $('<iframe width="0" height="0"/>').
            css({visibility: 'hidden'}).
            appendTo('body')[0];
        var sb = frame.contentWindow;

        sb.frame = frame;

        return sb;
    }

    function load(sb, srcFiles, done) {
        done = done || function() {};
        parallel(function(src, cb, i) {
            $.ajax({url: 'js/utils/' + src + '.js'}).done(function(d) {
                handle(d, i, src, cb);
            }).fail(function(xhr, text, err) {
                // TODO: figure out why "parsererror" happens sometimes!
                handle(xhr.responseText, i, src, cb);
            });
        }, srcFiles, function(err, data) {
            var script = document.createElement('script');
            script.type = 'text/javascript';

            script.innerHTML = data.sort(function(a, b) {
                return a.i > b.i;
            }).map(function(v) {
                return v.data;
            }).join('');

            sb.frame.contentDocument.body.appendChild(script);

            done();
        });

        function handle(d, i, src, cb) {
            if(d.indexOf('define') === 0) cb(null, {data: d.trim().slice(0, -2) + ', "' + src + '");', i: i});
            else cb(null, {data: d, i: i});
        }
    }
    init.load = load;

    return init;
});
