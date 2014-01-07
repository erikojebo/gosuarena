gosuArena = gosuArena || {};
gosuArena.gameClock = gosuArena.gameClock || {};

gosuArena.gameClock.create = function () {
    var callbacks = [];
    var isRunning = false;
    var hasStarted = false;

    function tick(callback) {
        callbacks.push(callback);
    }

    function callTickCallbacks(timestamp) {
        if (isRunning) {
            callbacks.forEach(function (callback) {
                callback();
            });
        }

        requestAnimationFrame(callTickCallbacks);
    }

    function start() {
        isRunning = true;

        if (!hasStarted) {
            hasStarted = true;
            requestAnimationFrame(callTickCallbacks);
        }
    }

    function stop() {
        isRunning = false;
    }

    return {
        start: start,
        stop: stop,
        tick: tick
    }
};
