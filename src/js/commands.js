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
        sandbox.load(sb, 'module');
        sandbox.load(sb, 'cube');
        sandbox.load(sb, 'is');
        sandbox.load(sb, 'annotate');
        sandbox.load(sb, 'math');
        sandbox.load(sb, 'object');
        sandbox.load(sb, 'functional');

        return $('<div>', {'class': 'playback command'}).
            addClass(playClass).
            on('click', function() {
                var code = 'inject(functional, window);' + editor.getValue() +
                    'evaluate({x: ' + dims.x +', y: ' + dims.y  +', z: ' +
                    dims.z + '});';
                var res = sandbox.evaluate(sb, code);
                var $e = $(this);

                if($e.hasClass(playClass)) $e.addClass(stopClass).removeClass(playClass);
                else $e.addClass(playClass).removeClass(stopClass);

                previews.evaluate(res);
            });
    }

    function $templates(editor) {
        var $ret = $('<select/>', {'class': 'codeTemplates'});
        var examples = ['all_off', 'all_on', 'brownian', 'finite_worm'];
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
