define(['./sandbox', 'jquery'], function(sandbox, $) {
    // https://github.com/josscrowcroft/javascript-sandbox-console
    function initCommands($p, editor, previews) {
        $p.append($playback(editor, previews));
        $p.append($templates(editor));
    }

    function $playback(editor, previews) {
        var playClass = 'play';
        var stopClass = 'stop';
        var sb = sandbox();
        sandbox.load(sb, 'module');
        sandbox.load(sb, 'math');
        sandbox.load(sb, 'cube');
        sandbox.load(sb, 'functional');

        return $('<div>', {'class': 'playback command'}).
            addClass(playClass).
            on('click', function() {
                var code = 'inject(functional, window);' + editor.getValue() + 'evaluate();';
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

        // TODO: no guarantees this executes in order, run via parallel helper
        Object.keys(urls).forEach(function(url, i) {
            $.get(url, function(d) {
                var idx = urls[this.url];
                var name = examples[idx].replace('_', ' ');

                $ret.append($('<option/>', {value: name}).text(name).data('code', d));
            });
        });

        $ret.on('change', function() {
            var $e = $(this);
            var val = $e.val();

            if(val) {
                editor.setValue($(':selected', $e).data('code'));
            }
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
