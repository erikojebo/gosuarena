gosuArena.register(function (actionQueue, status) {
    actionQueue.east(20);
}, {
    color: "#a0a",
    startPosition: {
        x: gosuArena.arenaWidth - 100,
        y: gosuArena.arenaHeight / 5
    },
    name: "eastbot"
});
