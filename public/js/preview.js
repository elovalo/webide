define(['threejs', 'trackball'], function() {
    function initPreview($e, dims) {
        var w = $e.width();
        var h = $e.height();
        var renderer = new THREE.WebGLRenderer({
            clearAlpha: true
        });
        var camera = new THREE.PerspectiveCamera(45, w / h, 10, 10000);
        var scene = new THREE.Scene();

        scene.add(camera);
        camera.position.x = 50;
        camera.position.z = 800;

        var controls = trackball($e, camera);

        renderer.setSize(w, h);

        var particleSystem = initParticles(scene, dims, 400);
        var particles = particleSystem.particles;

        renderer.render(scene, camera);

        $e.append(renderer.domElement);

        $(window).on('resize', function() {
            var w = $e.width();
            var h = $e.height();

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            renderer.setSize(w, h);
            controls.handleResize();
        });

        var animating = false;
        function animate(init, cb) {
            var res = init;

            animating = true;

            function anim() {
                res = cb(res.ticks);

                if(res.ok) execute(res.ops);

                controls.update();

                if(res.playing) requestAnimationFrame(anim);
                else {
                    animating = false;
                    refresh();
                }
            }

            anim();
        }

        function refresh() {
            controls.update();
            renderer.render(scene, camera);

            if(!animating) requestAnimationFrame(refresh);
        }
        refresh();

        function execute(ops) {
            render(dims, particles, ops);

            renderer.render(scene, camera);
        }

        return {
            evaluate: function(init, cb) {
                execute(init.ops);

                animate(init, cb);
            }
        };
    }

    function trackball($e, camera) {
        var controls = new THREE.TrackballControls(camera, $e.get()[0]);

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 0.5;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        return controls;
    }

    function render(dims, particles, ops) {
        ops.forEach(function(op, i) {
            particles.alpha.value[i] = op;
        });

        particles.alpha.needsUpdate = true;
    }

    function initParticles(scene, dims, dim) {
        var x = dims.x;
        var y = dims.y;
        var z = dims.z;
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
                    value: new THREE.Color(0xff0000)
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
