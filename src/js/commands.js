define(function(require) {
    var sandbox = require('./sandbox');
    var examples = Object.keys(require('./examples'));
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
            sb.inject(sb.functional, sb.window);
        });

        return $('<div>', {'class': 'playback command'}).
            addClass(playClass).
            on('click', function() {
                var $e = $(this);

                if($e.hasClass(stopClass)) $e.addClass(playClass).removeClass(stopClass);
                else {
                    $e.addClass(stopClass).removeClass(playClass);

                    sb.eval('function getInit() {var init;' +
                        editor.getValue() +
                        ';return init;}'
                    );
                    var res = sb.evaluateInit(sb.getInit(), dims);

                    previews.evaluate(res, function(vars) {
                        sb.eval('function getEffect() {var effect;' +
                            editor.getValue() +
                            ';return effect;}'
                        );

                        var ret = sb.evaluateEffect(sb.getEffect(), dims, vars);
                        ret.playing = $e.hasClass(stopClass);

                        return ret;
                    });
                }

            });
    }

    function encapsulate(code) {
        return '(function() {' + code + '})();';
    }

    function dimsToString(dims) {
        return '{x: ' + dims.x + ', y: ' + dims.y + ', z: ' + dims.z +'}';
    }

    function $templates(editor) {
        var $ret = $('<select/>', {'class': 'codeTemplates'});
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
