define(['./sandbox', 'jquery'], function(sandbox, $) {
    // https://github.com/josscrowcroft/javascript-sandbox-console
    function initCommands($p, editor, previews) {
        $p.append($evaluate(editor, previews));
        $p.append($templates(editor));
    }

    function $evaluate(editor, previews) {
        var sb = sandbox();
        sandbox.load(sb, 'module');
        sandbox.load(sb, 'math');
        sandbox.load(sb, 'cube');
        sandbox.load(sb, 'functional');

        // TODO: replace this with play, stop, position etc.
        return $('<div>', {'class': 'evaluate command'}).
            text('Evaluate').
            on('click', function() {
                var code = 'inject(functional, window);' + editor.getValue() + 'evaluate();';
                var res = sandbox.evaluate(sb, code);

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
