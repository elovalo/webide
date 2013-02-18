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
            var xhr = new XMLHttpRequest();

            xhr.open('get', path + '.js', false);
            xhr.send();

            if(xhr.status === 200 &&
              xhr.getResponseHeader('Content-Type') === 'application/javascript') {
                handle(xhr.responseText, i, src, cb);
            }
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
