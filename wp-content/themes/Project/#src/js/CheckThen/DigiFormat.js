// === DigiFormat ===
function digi(str) {
    var r = str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
    return r;
}
//=================
//DiGiAnimate
function digi_animate(digi_animate) {
    if (digi_animate.length > 0) {
        for (let index = 0; index < digi_animate.length; index++) {
            const el = digi_animate[index];
            const el_to = parseInt(el.innerHTML.replace(' ', ''));
            if (!el.classList.contains('_done')) {
                digi_animate_value(el, 0, el_to, 1500);
            }
        }
    }
}
function digi_animate_value(el, start, end, duration) {
    var obj = el;
    var range = end - start;
    // no timer shorter than 50ms (not really visible any way)
    var minTimer = 50;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(duration / range));

    // never go below minTimer
    stepTime = Math.max(stepTime, minTimer);

    // get current time and calculate desired end time
    var startTime = new Date().getTime();
    var endTime = startTime + duration;
    var timer;

    function run() {
        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / duration, 0);
        var value = Math.round(end - (remaining * range));
        obj.innerHTML = digi(value);
        if (value == end) {
            clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    run();

    el.classList.add('_done');
}
