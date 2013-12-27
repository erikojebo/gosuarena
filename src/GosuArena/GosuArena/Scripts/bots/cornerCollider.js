gosuArena.register(function (actionQueue, status) {
    if (status.angle < 45) {
        actionQueue.turn(2);
    } else {
        actionQueue.north();
    }
}, {
    color: "navy",
    startPosition: {
        x: 300,
        y: 300
    },
    name: "corner collider"
});