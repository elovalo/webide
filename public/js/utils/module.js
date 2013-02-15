function define(deps, module, id) {
    // XXX: evil hack due to is-js naming (inconsistency)
    window['is-js'] = window.is;

    if(isString(module)) id = module;

    if(id && isArray(deps)) window[id] = arrayDeps(deps);
    else if(isFunction(deps)) window[id] = deps(require);
    else if(id) window[id] = module;

    function arrayDeps(deps) {
        var i, len, dep, path;
        var realDeps = [];
        var prefix = id;

        for(i = 0, len = deps.length; i < len; i++) {
            dep = deps[i];

            if(dep === 'require') continue;

            path = resolvePath(prefix, dep);

            if(!(path in window)) loadModule(path);
        }

        if(deps[0] === 'require') realDeps.push(require);

        realDeps = realDeps.concat(loadDeps(deps));

        return module.apply(undefined, realDeps);
    }

    function loadDeps(deps) {
        var i, len, dep, path;
        var ret = [];

        for(i = 0, len = deps.length; i < len; i++) {
            dep = deps[i];

            if(dep === 'require') continue;

            path = resolvePath(id, dep);

            if(!(path in window)) console.warn('Dependency ' + path + ' has not been loaded yet!');

            ret.push(window[path]);
        }

        return ret;
    }

    function require(name) {
        var modulePath = resolvePath(id, name);

        if(!(modulePath in window) && id) loadModule(modulePath);

        return window[modulePath];
    }

    function loadModule(path) {
        var d;
        var xhr = new XMLHttpRequest();

        xhr.open('get', path + '.js', false);
        xhr.send();

        if(xhr.status === 200 &&
           xhr.getResponseHeader('Content-Type') === 'application/javascript') {
            d = xhr.responseText;

            if(d.indexOf('define') === 0) d = d.trim().slice(0, -2) + ', "' + path +'");';

            eval(d);
        }
        else console.warn('Failed to load ' + path + '!');
    }

    function resolvePath(prefix, name) {
        if(name.indexOf('./') === 0) {
            prefix = prefix.split('/').slice(0, -1).join('/');
            name = name.slice(2);
        }
        else if(name.indexOf('../') === 0) {
            prefix = prefix.split('/').slice(0, -2).join('/');
            name = name.slice(3);
        }
        else return name;

        return prefix + '/' + name;
    }

    function isArray(a) {
        return toString.call(a) === '[object Array]';
    }

    function isFunction(a) {
        return {}.toString.call(a) === '[object Function]';
    }

    function isString(a) {
        return (typeof a === 'string') || a instanceof String;
    }
}
