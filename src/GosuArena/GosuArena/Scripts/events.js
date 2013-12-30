var gosuArena = gosuArena || {};

gosuArena.events = (function () {

    function raiseMatchEnded(eventArgs) {
        gosu.eventAggregator.publish("matchEnded", eventArgs);
    }

    function matchEnded(callback) {
        gosu.eventAggregator.subscribe("matchEnded", callback);
    }
    
    return {
        raiseMatchEnded: raiseMatchEnded,
        matchEnded: matchEnded
    };
})();

