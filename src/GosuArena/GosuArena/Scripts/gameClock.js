gosuArena = gosuArena || {};
gosuArena.gameClock = gosuArena.gameClock || {};

gosuArena.gameClock.create = function (desiredFramesPerSecond) {
    var callbacks = [];
    var tickIntervalInMilliseconds = 1000 / desiredFramesPerSecond;
    var intervalCallbackId = null;

    function tick(callback) {
        callbacks.push(callback);
    }

    function start() {
        if (intervalCallbackId) {
            stop();
        }

        intervalCallbackId = setInterval(function () {
            callbacks.forEach(function (callback) {
                callback();
            });
        }, tickIntervalInMilliseconds);
    }

    function stop() {
        if (intervalCallbackId) {
            clearInterval(intervalCallbackId);
            intervalCallbackId = null;
        }
    }

    return {
        start: start,
        stop: stop,
        tick: tick
    }
};



