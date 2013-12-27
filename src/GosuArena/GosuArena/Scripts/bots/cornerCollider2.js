gosuArena.register(function (actionQueue, status) {
    if (status.angle < 45) {
        actionQueue.turn(2);
    } else
    {
        actionQueue.south();
    }
}, {
    color: "navy",
    startPosition: {
        x: 305,
        y: 270
    },
    name: "corner collider 2"
});