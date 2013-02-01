define(['threejs'], function() {
    function initPreview($e, dims) {
        var w = 400; // XXX
        var h = 300; // XXX
        var renderer = new THREE.WebGLRenderer({
            clearAlpha: true
        });
        var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 10000);
        var scene = new THREE.Scene();

        scene.add(camera);
        camera.position.x = -50;
        camera.position.z = 400;
        renderer.setSize(w, h);

        var particles = initParticles(scene, dims);

        renderer.render(scene, camera);

        $e.append(renderer.domElement);

        $(window).on('resize', function() {
            // TODO: update w/h properly
            var w = 400;
            var h = 300;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            renderer.setSize(w, h);
        });

        // TODO: animate (needs state + handler using requestAnimationFrame)

        function execute(fn) {
            fn.forEach(function(op) {
                var o = {
                    'on': function() {
                        render(dims, particles, op.params, 1);
                    },
                    'off': function() {
                        render(dims, particles, op.params, 0);
                    }
                }[op.op]();
            });

            renderer.render(scene, camera);
        }

        // TODO: ticks
        function animate(init, cb) {
            var res = init;

            function anim() {
                res = cb(res.vars);

                execute(res.ops);

                if(res.playing) requestAnimationFrame(anim);
            }

            anim();
        }

        return {
            evaluate: function(init, cb) {
                execute(init.ops);

                animate(init, cb);
            }
        };
    }



    function render(dims, particles, params, alpha) {
        if(params && 'x' in params && 'y' in params && 'z' in params) {
            particles.alpha.value[params.x + params.y * dims.x * dims.y + params.z * dims.z] = alpha;
        }
        else {
            for(var i = 0, len = dims.x * dims.y * dims.z; i < len; i++) {
                particles.alpha.value[i] = alpha;
            }
        }

        particles.alpha.needsUpdate = true;
    }

    function initParticles(scene, dims) {
        var x = dims.x;
        var y = dims.y;
        var z = dims.z;
        var dim = 200; // XXX
        var dimHalf = dim / 2;
        var attributes = {
            alpha: {
                type: 'f',
                value: []
            }
        };

        var material = new THREE.ShaderMaterial({
            uniforms: {
                color: {
                    type: 'c',
                    value: new THREE.Color(0x0000ff)
                }
            },
            attributes: attributes,
            vertexShader: $('#vertexshader').text(),
            fragmentShader: $('#fragmentshader').text(),
            transparent: true
        });
        var geometry = new THREE.Geometry();

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

        scene.add(particles);

        return attributes;
    }

    return initPreview;
});
