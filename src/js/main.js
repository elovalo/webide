require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        codemirror: '../components/codemirror/lib/codemirror',
        threejs: '../vendor/three',
        jsjs: '../vendor/libjs.min'
    },
    urlArgs: 'buster=' + (new Date()).getTime() // for dev only! use rev otherwise
});

require(['jquery', 'codemirror', 'threejs', 'jsjs'], function($) {
    $(function() {
        // TODO: draw some leds now
        // TODO: draw ide
        // TODO: eval

        init();
    });

    function init() {
        $('.editor').each(function() {
            var $e = $(this);
            var $commands = $('<div>', {'class': 'commands'}).appendTo($e);
            var $editArea = $('<div>', {'class': 'editArea'}).appendTo($e);

            var editor = initEditor($editArea);
            initCommands($commands, editor);
        });
        $('.preview').each(function() {
            initPreview($(this));
        });
    }

    function initEditor($e) {
        return CodeMirror($e.get(0), {
            value: 'function a() {\n    return 42;\n}\na();',
            mode: 'javascript',
            indentUnit: 4,
            lineWrapping: true,
            lineNumbers: true
        });
    }

    function initCommands($e, editor) {
        // TODO: replace this with play, stop, position etc.
        $('<div>', {'class': 'evaluate command'}).appendTo($e).
            text('Evaluate').
            on('click', function() {
                var jsObjs = JSJS.Init();
                var rval = JSJS.EvaluateScript(
                    jsObjs.cx,
                    jsObjs.glob,
                    editor.getValue()
                );
                var d = JSJS.ValueToNumber(jsObjs.cx, rval);

                window.alert(d); //2

                JSJS.End(jsObjs);
            });
    }

    function initPreview($e) {
        var w = 400; // XXX
        var h = 300; // XXX
        var x = 8; // XXX
        var y = 8; // XXX
        var z = 8; // XXX
        var renderer = new THREE.WebGLRenderer({
            clearAlpha: true
        });
        var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 10000);
        var scene = new THREE.Scene();

        scene.add(camera);
        camera.position.x = -50;
        camera.position.z = 400;
        renderer.setSize(w, h);

        initParticles(scene, x, y, z);

        renderer.render(scene, camera);

        $e.append(renderer.domElement);

        $(window).on('resize', function() {
            // TODO: update w/h properly
            var w = 400;
            var h = 300;

            camera.aspect = w / h;
            camera.updateProjectionnMatrix();

            renderer.setSize(w, h);
        });

        // TODO: animate (needs state + handler using requestAnimationFrame)
    }

    function initParticles(scene, x, y, z) {
        var dim = 200; // XXX
        var dimHalf = dim / 2;
        var geometry = new THREE.Geometry();
        var material = new THREE.ParticleBasicMaterial({
            color: 0x4444FF,
            size: 20
        });

        for(var xi = 0, xlen = x; xi < xlen; xi++) {
            for(var yi = 0, ylen = y; yi < ylen; yi++) {
                for(var zi = 0, zlen = z; zi < zlen; zi++) {
                    geometry.vertices.push(new THREE.Vector3(
                        xi * dim / (x - 1) - dimHalf,
                        yi * dim / (y - 1) - dimHalf,
                        zi * dim / (z - 1) - dimHalf
                    ));
                }
            }
        }

        var particles = new THREE.ParticleSystem(
            geometry,
            material
        );
        particles.dynamic = true;
        particles.sortParticles = true;

        scene.add(particles);
    }
});
