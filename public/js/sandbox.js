define(function(require) {
    var funkit = require('funkit');
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
        funkit.async.map(function(src, cb, i) {
            var path = src;

            if(src.indexOf('/') == -1) path = 'js/utils/' + src;

            path += '.js';

            $.ajax({url: path}).done(function(d) {
                handle(d, i, src, cb);
            }).fail(function(xhr, text, err) {
                // TODO: figure out why "parsererror" happens sometimes!
                handle(xhr.responseText, i, src, cb);
            });
        }, srcFiles, function(err, data) {
            var script = document.createElement('script');
            script.type = 'text/javascript';

            script.innerHTML = data.map(function(v) {
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
