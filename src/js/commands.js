define(function(require) {
    var sandbox = require('./sandbox');
    var groups = require('./examples');
    var funkit = require('funkit');
    var funkitPaths = require('./funkit_paths');
    var parallel = require('./utils/async').parallel;
    var prop = require('./utils/common').prop;
    var $ = require('jquery');

    console.log(funkit);

    // https://github.com/josscrowcroft/javascript-sandbox-console
    function initCommands($p, editor, previews, dims) {
        $p.append($playback(editor, previews, dims));
        $p.append($templates(editor, groups));
    }

    function $playback(editor, previews, dims) {
        var playClass = 'play';
        var stopClass = 'stop';
        var sb = sandbox();

        sandbox.load(sb, ['module',
            'components/is/is', 'components/annotate.js/lib/annotate',
            'functional', 'cube', 'math', 'object'], function() {
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

                    previews.evaluate(res, function(vars, ticks) {
                        sb.ticks = ticks;
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

    function $templates(editor, groups) {
        var $ret = $('<select/>', {'class': 'codeTemplates'});

        $ret.append($('<option/>'));

        for(var group in groups) {
            generateGroups($ret, group, getUrls(group, groups[group]));
        }

        $ret.on('change', function() {
            var $e = $(this);
            var val = $e.val();

            if(val) editor.setValue($(':selected', $e).data('code'));
        });

        return $ret;
    }

    function generateGroups($p, group, urls) {
        parallel(function(url, cb, i) {
            $.get(url, function(code) {
                cb(null, {url: url, i: i, code: code});
            });
        }, Object.keys(urls), function(err, data) {
            createOptions(err, data, group, urls, $p);
        });
    }

    function createOptions(err, data, group, urls, $p) {
        $p = group === 'none'? $p: $('<optgroup/>', {label: group}).appendTo($p);

        data.sort(function(a, b) {
            return a.i > b.i;
        }).forEach(function(d) {
            var parts = d.url.split('/');
            var name = parts[parts.length - 1].replace('_', ' ');

            $p.append($('<option/>', {value: name}).text(name).data('code', d.code));
        });
    }

    // TODO: refactor as [[k, v]] -> to object
    function getUrls(group, examples) {
        var ret = {};

        examples.forEach(function(v, i) {
            if(group === 'none') ret['examples/' + v + '.js'] = i;
            else ret['examples/' + group + '/' + v + '.js'] = i;
        });

        return ret;
    }

    return initCommands;
});
