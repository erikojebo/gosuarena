gosuArena.register(function (actionQueue, status) {

    if (status.seenBots.length > 0) {
        actionQueue.fire();        
    } else {
        actionQueue.turn(1);
    }
}, {
    name: "turnbot"
});
