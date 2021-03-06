gosuArena = gosuArena || {};
gosuArena.arenaState = gosuArena.arenaState || {};

gosuArena.arenaState.create = function () {

    var botKilledCallbacks = [];
    var botAddedCallbacks = [];
    var botHitByBulletCallbacks = [];
    var shotFiredCallbacks = [];

    var arenaState = {
        bots: [],
        terrain: [],
        bullets: []
    };

    function handleOnBotKilled(bot) {
        var livingBots = arenaState.livingBots();

        raiseOnBotKilled(bot);

        if (areAllLivingBotsOnTheSameTeam()) {
            gosuArena.events.raiseMatchEnded({
                winner: {
                    name: livingBots[0].teamId.toString(),
                    type: "team"
                }
            });
        } else if (livingBots.length == 1) {
            gosuArena.events.raiseMatchEnded({
                winner: {
                    name: livingBots[0].name,
                    type: "bot"
                }
            });
        }
    }

    function areAllLivingBotsOnTheSameTeam() {
        var livingBots = arenaState.livingBots();

        if (livingBots.length < 1 || !livingBots[0].teamId) {
            return false;
        }
        
        for (var i = 1; i < livingBots.length; i++) {
            if (livingBots[i].teamId != livingBots[0].teamId) {
                return false;
            }
        }

        return true;
    }
    
    arenaState.livingBots = function () {
        return arenaState.bots.filter(function (bot) {
            return bot.isAlive();
        });
    };

    arenaState.removeBullet = function (bullet) {
        var index = arenaState.bullets.indexOf(bullet);
        arenaState.bullets.splice(index, 1);
    };

    arenaState.clear = function () {
        arenaState.bots.length = 0;
        arenaState.terrain.length = 0;
        arenaState.bullets.length = 0;
    };

    arenaState.addBot = function (bot) {
        bot.onKilled(handleOnBotKilled);

        // Handle this inline so that we can pass the bot as the
        // parameter to the event handlers instead of the parameters
        // sent by the bot itself, since that passes arguments
        // suited for the bot developers, and hence cannot pass the
        // actual bot as an argument.
        bot.onHitByBullet(function () {
            raiseOnBotHitByBullet(bot);
        });

        bot.onShotFired(onShotFiredByBot);

        arenaState.bots.push(bot);

        raiseOnBotAdded(bot);
    };

    arenaState.addTerrain = function (terrain) {
        arenaState.terrain.push(terrain);
    };

    arenaState.addBullet = function (bullet) {
        arenaState.bullets.push(bullet);
    };

    arenaState.onBotAdded = function (callback) {
        botAddedCallbacks.push(callback);
    };

    arenaState.onBotKilled = function (callback) {
        botKilledCallbacks.push(callback);
    };

    arenaState.onBotHitByBullet = function (callback) {
        botHitByBulletCallbacks.push(callback);
    };

    function raiseOnBotKilled(bot) {
        botKilledCallbacks.forEach(function (callback) {
            callback(bot);
        });
    }

    function raiseOnBotHitByBullet(bot) {
        botHitByBulletCallbacks.forEach(function (callback) {
            callback(bot);
        });
    }

    function raiseOnBotAdded(bot) {
        botAddedCallbacks.forEach(function (callback) {
            callback(bot);
        });
    }

    function onShotFiredByBot(bot) {
        var bullet = gosuArena.factories.createBullet(bot);
        arenaState.addBullet(bullet);
    }

    return arenaState;
}
