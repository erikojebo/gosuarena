gosuArena.register({
    tick: function (actionQueue, status) {

        if (status.seenBots.length > 0) {
            actionQueue.clear();
            
            if (status.roundsUntilWeaponIsReady <= 0) {
                actionQueue.fire();
            }
        } else {
            actionQueue.turn(status.actionsPerRound);
        }
    }
});
