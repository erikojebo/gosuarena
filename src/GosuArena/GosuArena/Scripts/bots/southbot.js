gosuArena.register(function (actionQueue, status) {
    actionQueue.south(20);
}, {
    color: "#a0a",
    startPosition: {
        x: gosuArena.arenaWidth / 5,
        y: gosuArena.arenaHeight - 100
    },
    name: "southbot"
});
