define(function(require) {
    var sandbox = require('sandboxy');
    var groups = require('./examples');
    var funkit = require('funkit');
    var partial = funkit.partial;
    var $ = require('jquery');
    var is = require('is-js');
    var playClass = 'play';
    var stopClass = 'stop';

    // https://github.com/josscrowcroft/javascript-sandbox-console
    function initCommands($p, editor, previews, dims) {
        $p.append($playback(editor, previews, dims));
        $p.append($templates(editor, groups));
    }

    function $playback(editor, previews, dims) {
        var sb = initSandbox();
        var $e = $('<div>', {'class': 'playback command'}).
            addClass(playClass).
            on('click', function() {
                var $e = $(this);

                if($e.hasClass(stopClass)) $e.trigger('stop');
                else $e.trigger('play');
            });

        return $e.bind('play', {
                sb: sb,
                editor: editor,
                dims:dims,
                previews: previews
            }, partial(play, $e)).
            bind('stop', partial(stop, $e)).
            bind('restart', partial(restart, $e));
    }

    function restart($e) {
        if($e.hasClass(stopClass)) {
            $e.trigger('stop').trigger('play');
        }
    }

    function play($e, evt) {
        var data = evt.data;
        var sb = data.sb;

        $e.addClass(stopClass).removeClass(playClass);

        sb._ops = [];
        sb.ticks = 0;

        console.groupCollapsed('Executing effect');

        sb.eval('function getInit() {var init;' +
            data.editor.getValue() +
            ';return init;}'
        );
        var vars = sb.evaluateInit(sb.getInit(), data.dims);
        var res = {
            ops: sb._ops
        };

        data.previews.evaluate(res, function(ticks) {
            sb._ops = [];
            sb.ticks = ticks;
            var ok = true;

            try {
                sb.eval('function getEffect() {var effect;' +
                    data.editor.getValue() +
                    ';return effect;}'
                );

                sb.evaluateEffect(sb.getEffect(), data.dims, vars);
            }
            catch(e) {
                ok = false;
                console.error(e.message);
            }

            return {
                ok: ok,
                ops: sb._ops,
                playing: $e.hasClass(stopClass)
            };
        });
    }

    function stop($e) {
        $e.addClass(playClass).removeClass(stopClass);

        console.groupEnd();
    }

    function initSandbox() {
        var sb = sandbox();

        sb.is = is;
        sb.funkit = funkit;
        sb.math = funkit.math;
        sb.range = funkit.math.range;
        sb.partial = funkit.partial;

        // these are needed for completion to work
        window.funkit = funkit;
        window.math = funkit.math;
        window.range = funkit.math.range;
        window.partial = funkit.partial;

        sandbox.load(sb, ['js/cube']);

        return sb;
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

            if(val) {
                editor.setValue($(':selected', $e).data('code'));
                $('.playback.command').trigger('restart');
            }
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
