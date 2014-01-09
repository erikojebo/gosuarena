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
        var wallThickness = visualizer.wallThickness;

        var westWallWidth = gosuArena.arenaHeight + 2 * wallThickness;
        var westWallHeight = wallThickness;
        var westWall = gosuArena.factories.createTerrain({
            x: -westWallWidth / 2 + westWallHeight / 2,
            y: westWallWidth / 2 - westWallHeight / 2,
            width: westWallWidth,
            height: westWallHeight,
            angle: 270
        });

        var eastWallWidth = gosuArena.arenaHeight + 2 * wallThickness;
        var eastWallHeight = wallThickness;
        
        var eastWall = gosuArena.factories.createTerrain({
            x: -eastWallWidth / 2 + gosuArena.arenaWidth + wallThickness + wallThickness / 2,
            y: (gosuArena.arenaHeight + 2 * wallThickness) / 2 - wallThickness / 2,
            width: eastWallWidth,
            height: eastWallHeight,
            angle: 90
        });

        var northWall = gosuArena.factories.createTerrain({
            x: -wallThickness,
            y: 0,
            width: gosuArena.arenaWidth + 2 * wallThickness,
            height: wallThickness,
            angle: 0
        });

        var southWall = gosuArena.factories.createTerrain({
            x: -wallThickness,
            y: gosuArena.arenaHeight + wallThickness,
            width: gosuArena.arenaWidth + 2 * wallThickness,
            height: wallThickness,
            angle: 180
        });

        arenaState.addTerrain(eastWall);
        arenaState.addTerrain(westWall);
        arenaState.addTerrain(northWall);
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

    var hasStartedBenchmark = false;

    // 1000 iterations: 1000 ms @ 2014-01-08
    function benchmark() {

        if (hasStartedBenchmark) {
            return;
        }

        hasStartedBenchmark = true;

        var startTime = new Date().getTime();

        for (var i = 0; i < 1000; i++) {
            updateBots();
            updateBullets();
        }

        var endTime = new Date().getTime();
        console.log("Time (ms): "  + (endTime - startTime));

        visualizer.render(arenaState);
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
