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

    function evaluate(sb, value) {
        return sb.eval(value);
    }
    init.evaluate = evaluate;

    function load(sb, srcFiles, done) {
        done = done || function() {};
        var script = document.createElement('script');
        script.type = 'text/javascript';

        parallel(function(src) {
            $.get('js/utils/' + src + '.js', function(d, cb) {
                if(d.indexOf('define') === 0) {
                    cb(null, d.trim().slice(0, -2) + ', "' + src + '");');
                }
                else {
                    cb(null, d);
                }
            });
        }, srcFiles, function(err, data) {
            // TODO: concat data and set to innerhtml
            // TODO: append script to frame

            done();
        });

        /*
        $.get('js/utils/' + src + '.js', function(d) {
            if(d.indexOf('define') === 0) {
                script.innerHTML = d.trim().slice(0, -2) + ', "' + src + '");';
            }
            else {
                script.innerHTML = d;
            }

            sb.frame.contentDocument.body.appendChild(script);

            done();
        });*/
    }
    init.load = load;

    return init;
});
