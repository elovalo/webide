define(function(require) {
    var sandbox = require('./sandbox');
    var groups = require('./examples');
    var funkit = require('funkit');
    var $ = require('jquery');

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
            'components/funkit/lib/index',
            'cube'], function() {
            sb.inject(sb.functional, sb.window);

            // aliases
            sb.funkit = sb['components/funkit/lib/index'];
            sb.math = sb.funkit.math;
            sb.range = sb.funkit.math.range;
        });

        return $('<div>', {'class': 'playback command'}).
            addClass(playClass).
            on('click', function() {
                var $e = $(this);

                if($e.hasClass(stopClass)) $e.addClass(playClass).removeClass(stopClass);
                else {
                    $e.addClass(stopClass).removeClass(playClass);

                    sb._ops = [];
                    sb.ticks = 0;

                    sb.eval('function getInit() {var init;' +
                        editor.getValue() +
                        ';return init;}'
                    );
                    var res = sb.evaluateInit(sb.getInit(), dims);
                    res.ops = sb._ops;

                    previews.evaluate(res, function(vars, ticks) {
                        sb._ops = [];
                        sb.ticks = ticks;

                        sb.eval('function getEffect() {var effect;' +
                            editor.getValue() +
                            ';return effect;}'
                        );

                        sb.evaluateEffect(sb.getEffect(), dims, vars);

                        return {
                            ops: sb._ops,
                            playing: $e.hasClass(stopClass)
                        };
                    });
                }

            });
    }

    function $templates(editor, groups) {
        var $ret = $('<select/>', {'class': 'codeTemplates'});

        $ret.append($('<option/>'));

        funkit.async.map(function(group, groupCb) {
            funkit.async.map(function(url, cb, i) {
                $.get(url, function(code) {
                    cb(null, {group: group[0], url: url, i: i, code: code});
                });
            }, getUrls(group[0], group[1]), function(err, data) {
                groupCb(null, data);
            });
        }, funkit.functional.otozip(groups), function(err, data) {
            data.sort(function(a, b) {
                return a[0].group > b[0].group;
            }).forEach(function(d) {
                var $p = $('<optgroup/>', {label: d[0].group}).appendTo($ret);

                d.sort(function(a, b) {
                    return a.i > b.i;
                }).forEach(function(d) {
                    var parts = d.url.split('/');
                    var name = parts[parts.length - 1].replace('_', ' ');

                    $p.append($('<option/>', {value: name}).text(name).data('code', d.code));
                });
            });
        });

        $ret.on('change', function() {
            var $e = $(this);
            var val = $e.val();

            if(val) editor.setValue($(':selected', $e).data('code'));
        });

        return $ret;
    }

    function getUrls(group, examples) {
        return examples.map(function(example) {
            return 'examples/' + group + '/' + example + '.js';
        });
    }

    return initCommands;
});
