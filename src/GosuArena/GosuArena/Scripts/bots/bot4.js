var xDirection = 1;

gosuArena.register(function (actionQueue, status) {
    if (status.position.x > gosuArena.arenaWidth / 2.0) {
        xDirection = -1;
    } else if (status.position.x < gosuArena.arenaWidth / 4.0) {
        xDirection = 1;
    }
    
    if (xDirection == 1) {
        actionQueue.east(2);
    } else {
        actionQueue.west(2);
    }
}, {
    color: "#a00",
    startPosition: {
        x: gosuArena.arenaWidth / 2,
        y: gosuArena.arenaHeight / 3
    },
    name: "bot4"
});
