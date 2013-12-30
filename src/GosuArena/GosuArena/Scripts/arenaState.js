gosuArena = gosuArena || {};
gosuArena.arenaState = gosuArena.arenaState || {};

gosuArena.arenaState.create = function () {

    var arenaState = {
        bots: [],
        terrain: [],
        bullets: []
    };

    function onBotKilled(bot) {
        var livingBots = arenaState.livingBots();
        
        if (livingBots.length == 1) {
            gosuArena.events.raiseMatchEnded({
                winner: {
                    name: livingBots[0].name
                }
            });
        }
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
        bot.onKilled(onBotKilled);
        arenaState.bots.push(bot);
    };

    arenaState.addTerrain = function (terrain) {
        arenaState.terrain.push(terrain);
    };

    arenaState.addBullet = function (bullet) {
        arenaState.bullets.push(bullet);
    };

    return arenaState;
}
