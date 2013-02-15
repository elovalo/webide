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

        var particleSystem = initParticles(scene, dims);
        var particles = particleSystem.particles;

        // TODO
        //camera.lookAt(particleSystem.object.position);

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

        var prevTime;
        var ticks;
        function animate(init, cb) {
            var res = init;

            prevTime = new Date().getTime();
            ticks = 0;

            function anim() {
                var curTime = new Date().getTime();
                ticks += curTime - prevTime;
                prevTime = curTime;

                res = cb(res.vars, ticks);

                execute(res.ops);

                if(res.playing) requestAnimationFrame(anim);
            }

            anim();
        }

        function execute(ops) {
            ops.forEach(function(op) {
                if(!op) return;

                var o = {
                    on: function() {
                        render(dims, particles, op.coords, 1);
                    },
                    off: function() {
                        render(dims, particles, op.coords, 0);
                    }
                }[op.op]();

            });

            renderer.render(scene, camera);
        }

        return {
            evaluate: function(init, cb) {
                execute(init.ops);

                animate(init, cb);
            }
        };
    }

    function render(dims, particles, coords, alpha) {
        var xDims = dims.x;
        var yDims = dims.y;
        var zDims = dims.z;

        for(var i = 0, len = coords.length; i < len; i++) {
            var coord = coords[i];

            particles.alpha.value[parseInt(coord.x + coord.y, 10) * xDims * yDims + parseInt(coord.z, 10) * zDims] = alpha;
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

        return {
            object: particles,
            particles: attributes
        };
    }

    return initPreview;
});
