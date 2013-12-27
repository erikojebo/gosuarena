gosuArena.register(function (actionQueue, status) {
    
    if (status.angle < 15) {
        actionQueue.turn(2);
    }

    actionQueue.north(20);
}, {
    color: "#70f",
    startPosition: {
        x: 100,
        y: 100
    },
    name: "northbot"
});
