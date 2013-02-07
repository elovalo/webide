function define(module, id) {
    if(typeof module === 'function') {
        window[id] = module(require);
    }
    else {
        window[id] = module;
    }

    function require(name) {
        if(name.indexOf('./') === 0) name = name.slice(2);

        return  window[name];
    }
}
