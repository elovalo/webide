define(function() {
    return function(sb, dims, cbs) {
        var vars, ok, prevTime, curTime;

        sb._ops = [];
        sb.ticks = 0;
        prevTime = new Date().getTime();

        sb.eval('function getInit() {var init;' + cbs.code() + ';return init;}');
        vars = sb.evaluateInit(sb.getInit(), dims);

        cbs.execute({ops: sb._ops}, function(ticks) {
            sb._ops = [];

            curTime = new Date().getTime();
            sb.ticks += curTime - prevTime;
            prevTime = curTime;

            ok = true;

            try {
                sb.eval('function getEffect() {var effect;' + cbs.code() + ';return effect;}');

                sb.evaluateEffect(sb.getEffect(), dims, vars);

                cbs.ok();
            } catch(e) {
                ok = false;

                cbs.error(e);
            }

            return mergeInto({
                ok: ok,
                ops: sb._ops,
                ticks: sb.ticks
            }, cbs.playing());
        });
    };

    // http://stackoverflow.com/questions/4740806/native-way-to-merge-objects-in-javascript
    // using this so we avoid external deps
    function mergeInto(o1, o2) {
        if(o1 == null || o2 == null) return o1;

        for(var key in o2) if(o2.hasOwnProperty(key)) o1[key] = o2[key];

        return o1;
    }
});
