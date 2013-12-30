var gosu = gosu || {};

gosu.eventAggregator = (function () {
    var callbacks = {};

    function publish(eventName, eventArgs) {
        if (callbacks[eventName]) {
            callbacks[eventName].forEach(function (callback) {
                callback(eventArgs);
            });
        }
    }

    function subscribe(eventName, callback) {
        if (!callbacks[eventName]) {
            callbacks[eventName] = [];
        }

        callbacks[eventName].push(callback);
    }

    return {
        publish: publish,
        subscribe: subscribe
    };
})();
