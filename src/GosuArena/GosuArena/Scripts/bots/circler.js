
function moveTowardsCenter(actionQueue, status) {
    if (status.position.x < gosuArena.arenaWidth * 0.25) {
        actionQueue.east(10);
    } else if (status.position.x > gosuArena.arenaWidth * 0.75) {
        actionQueue.west(10);
    }

    if (status.position.y < gosuArena.arenaHeight * 0.25) {
        actionQueue.south(10);
    } else if (status.position.x > gosuArena.arenaHeight * 0.75) {
        actionQueue.north(10);
    }
}

gosuArena.register(function (actionQueue, status) {

    if (!status.canMoveForward || !status.canTurnRight) {
        actionQueue.clear();
        moveTowardsCenter(actionQueue, status);
        return;
    }

    if (status.canFire) {
        actionQueue.fire();
    }

    actionQueue.turn(1);
    actionQueue.forward(1);
}, {
    name: "circler"
});
