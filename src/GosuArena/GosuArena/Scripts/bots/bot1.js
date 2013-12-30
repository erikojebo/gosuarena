gosuArena.register({
    tick: function(actionQueue) {
        var random = Math.random();

        if (random < 0.25) {
            actionQueue.north();
        } else if (random < 0.5) {
            actionQueue.south();
        } else if (random < 0.75) {
            actionQueue.west();
        } else {
            actionQueue.east();
            actionQueue.east();
        }
    },
    options: {
        name: "bot1"
    }
});
