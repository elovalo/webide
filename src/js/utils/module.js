function define(module, id) {
    if(typeof module === 'function') {
        window[id] = module(require);
    }
    else {
        window[id] = module;
    }

    function require(name) {
        return  window[name.slice(2)];
    }
}
