var gosuArena = gosuArena || {};

gosuArena.engine = (function () {
    var arenaState = gosuArena.arenaState.create();
    var readyCallbacks = [];
    var matchStartedCallbacks = [];
    var actionsPerRound = 2;
    var isTraining = true;
    var gameListeners = [];
    var visualizer = null;
    var collisionDetector = gosuArena.factories.createCollisionDetector(arenaState);

    var nextBotId = 0;
    var currentRegisteringBot = null;

    gosuArena.ready = function(callback) {
        readyCallbacks.push(callback);
    };

    gosuArena.initiateBotRegistration = function (name, callback) {

        // This makes sure that we keep track of the name of the bot being
        // registered during the execution of the bot script, so that
        // we can automatically initialize the bot with the name
        // given when creating the bot.
        gosuArena.ready(function () {
            currentRegisteringBot = name;

            callback();

            currentRegisteringBot = null;
        });
    };

    gosuArena.matchStarted = function (callback) {
        matchStartedCallbacks.push(callback);
    }

    gosuArena.register = function (options) {

        var botOptions =
            gosuArena.factories.createSafeBotOptions(options.options, isTraining);

        botOptions.name = currentRegisteringBot;
        botOptions.actionsPerRound = actionsPerRound;
        botOptions.id = ++nextBotId; // Increment first to start with id 1
        
        var bot = gosuArena.factories.createBot(options.tick, botOptions, collisionDetector);

        bot.onShotFired(onShotFiredByBot);

        if (options.onHitByBullet) {
            bot.onHitByBullet(options.onHitByBullet);
        }

        arenaState.addBot(bot);
    };

    function initializeTerrain() {
        var wallMargin = 100;

        var westWall = gosu.math.rectangle.createFromPoints({
            x1: -wallMargin,
            y1: -wallMargin,
            x2: 0,
            y2: gosuArena.arenaHeight + wallMargin
        });

        var eastWall = gosu.math.rectangle.createFromPoints({
            x1: gosuArena.arenaWidth,
            y1: -wallMargin,
            x2: gosuArena.arenaWidth + wallMargin,
            y2: gosuArena.arenaHeight + wallMargin
        });

        var norhtWall = gosu.math.rectangle.createFromPoints({
            x1: -wallMargin,
            y1: -wallMargin,
            x2: gosuArena.arenaWidth + wallMargin,
            y2: 0
        });

        var southWall = gosu.math.rectangle.createFromPoints({
            x1: -wallMargin,
            y1: gosuArena.arenaHeight + wallMargin,
            x2: gosuArena.arenaWidth + wallMargin,
            y2: gosuArena.arenaHeight
        });

        arenaState.addTerrain(eastWall);
        arenaState.addTerrain(westWall);
        arenaState.addTerrain(norhtWall);
        arenaState.addTerrain(southWall);
    }

    function fixStartPositionsToAvoidCollisions() {
        arenaState.bots.forEach(function (bot) {
            while (collisionDetector.hasCollided(bot)) {
                bot.teleportToRandomLocation();
            }
        });
    }

    function onShotFiredByBot(bot) {
        var bullet = gosuArena.factories.createBullet(bot);
        arenaState.addBullet(bullet);
    }

    function updateBots() {
        arenaState.livingBots().forEach(function(bot) {
            bot.tick();
        });
    }

    function updateBullets() {

        arenaState.bullets.forEach(function (bullet) {
            bullet.tick();
        });

        arenaState.livingBots().forEach(function (bot) {
            var hitBullets = collisionDetector.hitBullets(bot);

            hitBullets.forEach(function (bullet) {
                bot.hitBy(bullet);
                arenaState.removeBullet(bullet);
            });
        });

        arenaState.terrain.forEach(function (terrain) {
            var hitBullets = collisionDetector.bulletsHitTerrain(terrain);

            hitBullets.forEach(function (bullet) {
                arenaState.removeBullet(bullet);
            });
        });
    }

    function startGameLoop(gameClock) {
        gameClock.tick(tick);
    }

    function tick() {
        updateBots();
        updateBullets();

        visualizer.render(arenaState);
    }

    function initializeGameListeners() {
        gameListeners.forEach(function (listener) {
            listener.initialize(arenaState);
        });
    }

    function raiseReadyEvent() {
        readyCallbacks.forEach(function (callback) {

            // Invoke the callback with an empty object as this
            // to reduce hacking opportunities
            callback.call({});
        });
    }

    function raiseMatchStartedEvent() {
        matchStartedCallbacks.forEach(function (callback) {
            callback.call({});
        })
    }

    function restartMatch(gameVisualizer, gameClock, options) {
        options = options || {};

        gameListeners = options.listeners || [];
        isTraining = options.isTraining;

        visualizer = gameVisualizer;

        arenaState.clear();

        gosuArena.arenaWidth = gameVisualizer.arenaWidth;
        gosuArena.arenaHeight = gameVisualizer.arenaHeight;

        initializeTerrain();
        initializeGameListeners();

        raiseReadyEvent();

        fixStartPositionsToAvoidCollisions();

        startGameLoop(gameClock);

        raiseMatchStartedEvent();
    }

    function reset() {
        arenaState.clear();
        readyCallbacks.length = 0;
        nextBotId = 0;
    }

    return {
        start: restartMatch,
        reset: reset
    };
})();
