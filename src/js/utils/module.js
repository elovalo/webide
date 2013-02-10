function define(deps, module, id) {
    var delay = 200; // in ms

    // XXX: evil hack due to is-js naming (inconsistency)
    window['is-js'] = window.is;

    if(id && isArray(deps)) {
        setTimeout(checkDeps, delay);
    }
    else if(id) {
        window[id] = module;
    }

    function checkDeps() {
        var i, len;

        for(i = 0, len = deps.length; i < len; i++) {
            if(!(depName(deps[i]) in window)) {
                setTimeout(checkDeps, delay);
                return;
            }
        }

        window[id] = module.apply(undefined, loadDeps(deps).concat(require));
    }

    function loadDeps(deps) {
        var i, len, dep;
        var ret = [];

        for(i = 0, len = deps.length; i < len; i++) {
            dep = depName(deps[i]);

            if(!(dep in window)) console.warn('Dependency ' + dep + ' has not been loaded yet!');

            ret.push(window[dep]);
        }

        return ret;
    }

    function require(name) {
        var dep = depName(name);

        if(!(dep in window)) {
            console.log('dep not found', dep);

            // TODO
            return;
        }

        return window[dep];
    }

    function depName(dep) {
        return dep.indexOf('./') === 0? dep.slice(2): dep;
    }

    function isArray(a) {
        return toString.call(a) === '[object Array]';
    }
}
