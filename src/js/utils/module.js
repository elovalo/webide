function define(module, id) {
    // XXX: evil hack due to is-js naming (inconsistency)
    window['is-js'] = window.is;

    if(typeof module === 'function') {
        window[id] = module(require);
    }
    else {
        window[id] = module;
    }

    function require(name) {
        if(name.indexOf('./') === 0) name = name.slice(2);

        return window[name];
    }
}
