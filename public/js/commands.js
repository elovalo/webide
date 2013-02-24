define(function(require) {
    var sandbox = require('sandboxy');
    var groups = require('./examples');
    var funkit = require('funkit');
    var partial = funkit.partial;
    var $ = require('jquery');
    var is = require('is-js');
    var interpreter = require('./interpreter');

    var playClass = 'play';
    var stopClass = 'stop';

    function initCommands($p, editor, previews, dims) {
        var $commands = $($('#commandsTemplate').html()).prependTo($p);

        playback($('.playback', $commands), editor, previews, dims);
        templates($('.templates', $commands), editor, groups);
        save($('.save', $commands), editor);
    }

    function playback($e, editor, previews, dims) {
        var sb = initSandbox();
        $e.addClass(playClass).
            on('click', function() {
                var $e = $(this);

                if($e.hasClass(stopClass)) $e.trigger('stop');
                else $e.trigger('play');
            });

        $e.bind('play', {
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
        var $commands = $('.commands');

        $e.addClass(stopClass).removeClass(playClass);
        $commands.removeClass('error');

        console.groupCollapsed('Executing effect');

        interpreter(evt.data.sb, evt.data.dims, {
            execute: evt.data.previews.evaluate,
            code: function() {
                return evt.data.editor.getValue();
            },
            ok: function() {
                $commands.removeClass('error');
            },
            error: function(e) {
                console.error(e.message);

                $commands.addClass('error');
            },
            playing: function() {
                return {
                    playing: $e.hasClass(stopClass)
                };
            }
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

    function save($e, editor) {
        $e.on('click', function() {
            $.post('', {
                id: $('.codeId').text(),
                code: editor.getValue()
            }, function(data) {
                if(data.status == 'success') console.log('Saved data successfully!');
                else console.error('Saving data failed!');
            }, 'json');
        });
    }

    function templates($e, editor, groups) {
        $e.append($('<option>'));

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
                var $p = $('<optgroup>', {label: d[0].group}).appendTo($e);

                d.sort(function(a, b) {
                    return a.i > b.i;
                }).forEach(function(d) {
                    var parts = d.url.split('/');
                    var name = parts[parts.length - 1].replace('_', ' ');

                    $p.append($('<option>', {value: name}).text(name).data('code', d.code));
                });
            });
        });

        $e.on('change', function() {
            var $e = $(this);
            var val = $e.val();

            if(val) {
                editor.setValue($(':selected', $e).data('code'));
                $('.playback.command').trigger('restart');
            }
        });
    }

    function getUrls(group, examples) {
        return examples.map(function(example) {
            return 'examples/' + group + '/' + example + '.js';
        });
    }

    return initCommands;
});
