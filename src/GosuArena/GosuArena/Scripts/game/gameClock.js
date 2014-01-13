gosuArena = gosuArena || {};
gosuArena.gameClock = gosuArena.gameClock || {};

gosuArena.gameClock.create = function () {
    var callbacks = [];
    var isRunning = false;
    var hasStarted = false;

    var tickCount = 0;
    var roundTimeSampleLength = 500;
    var lastTimestamp = 0;

    function tick(callback) {
        callbacks.push(callback);
    }

    function callTickCallbacks(timestamp) {
        requestAnimationFrame(callTickCallbacks);
        
        if (isRunning) {
            callbacks.forEach(function (callback) {
                callback();
            });

            if (tickCount > 0 && tickCount % roundTimeSampleLength == 0) {
                var averageRoundTime = (timestamp - lastTimestamp) / roundTimeSampleLength;
                var averageFps = 1000 / averageRoundTime;

                console.log(
                    averageRoundTime.toFixed(3) + " ms / " +
                        Math.round(averageFps) + " fps");

                lastTimestamp = timestamp;
            }

            tickCount++;
        }
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
