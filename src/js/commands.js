define(function(require) {
    var sandbox = require('./sandbox');
    var parallel = require('./utils/async').parallel;
    var prop = require('./utils/common').prop;
    var $ = require('jquery');

    // https://github.com/josscrowcroft/javascript-sandbox-console
    function initCommands($p, editor, previews, dims) {
        $p.append($playback(editor, previews, dims));
        $p.append($templates(editor));
    }

    function $playback(editor, previews, dims) {
        var playClass = 'play';
        var stopClass = 'stop';
        var sb = sandbox();

        // XXX: presumes deps are in the right order
        sandbox.load(sb, ['module', 'cube', 'is', 'annotate', 'math', 'object',
            'functional'], function() {
            // XXX: executes evaluate(...) too for some reason. investigate why
            console.log('loading done');
            sb.evaluate(sb, 'inject(functional, window);');
        });

        return $('<div>', {'class': 'playback command'}).
            addClass(playClass).
            on('click', function() {
                var code ='(function() {var init; var effect;' + editor.getValue() +
                    ';return evaluate(init, effect, {x: ' + dims.x +', y: ' + dims.y  +', z: ' +
                    dims.z + '});})();';
                var res = sandbox.evaluate(sb, code);
                var $e = $(this);

                if($e.hasClass(playClass)) $e.addClass(stopClass).removeClass(playClass);
                else $e.addClass(playClass).removeClass(stopClass);

                previews.evaluate(res);
            });
    }

    function $templates(editor) {
        var $ret = $('<select/>', {'class': 'codeTemplates'});
        var examples = ['all_off', 'all_on', 'brownian', 'corners', 'finite_worm'];
        var urls = getUrls(examples);

        $ret.append($('<option/>'));

        parallel(function(url, cb, i) {
            $.get(url, function(code) {
                cb(null, {url: url, i: i, code: code});
            });
        }, Object.keys(urls), function(err, data) {
            data.sort(function(a, b) {
                return a.i > b.i;
            }).forEach(function(d) {
                var name = examples[urls[d.url]].replace('_', ' ');

                $ret.append($('<option/>', {value: name}).text(name).data('code', d.code));
            });
        });

        $ret.on('change', function() {
            var $e = $(this);
            var val = $e.val();

            if(val) editor.setValue($(':selected', $e).data('code'));
        });

        return $ret;
    }

    // TODO: refactor as [[k, v]] -> to object
    function getUrls(a) {
        var ret = {};

        a.forEach(function(v, i) {
            ret['examples/' + v + '.js'] = i;
        });

        return ret;
    }

    return initCommands;
});
