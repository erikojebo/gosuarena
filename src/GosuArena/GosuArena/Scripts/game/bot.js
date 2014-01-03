var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createBot = function (tickCallback, options, collisionDetector) {

    var shotFiredCallbacks = [];
    var killedCallbacks = [];
    var hitByBulletCallbacks = [];
    var actionQueue = gosuArena.factories.createActionQueue(collisionDetector);
    var userActionQueue = gosuArena.factories.createUserActionQueue(actionQueue);

    var bot = {
        id: options.id,
        x: options.x,
        y: options.y,
        width: options.width,
        height: options.height,
        angle: options.angle,
        color: options.color,
        name: options.name,
        health: options.initialHealthPoints,
        weapon: {
            width: options.weaponWidth,
            height: options.weaponHeight,
            cooldownTime: options.weaponCooldownTime,
            cooldownTimeLeft: 0,
            damage: options.weaponDamage
        },
        sight: {
            width: options.sightWidth,
            length: options.sightLength
        }
    };

    bot.top = function() {
        return bot.rectangle().maxY;
    };

    bot.bottom = function () {
        return bot.rectangle().minY;
    };

    bot.left = function () {
        return bot.rectangle().minX;
    };

    bot.right = function () {
        return bot.rectangle().maxX;
    };

    bot.isAlive = function () {
        return bot.health > 0;
    }

    bot.healthPercentage = function () {
        return bot.health / options.initialHealthPoints;
    };

    bot.weapon.mountingPoint = function() {
        var offsetVectorFromCenter = gosu.math.point.rotate(
            bot.weapon.botRelativeMountingPoint(),
            bot.angle);

        return gosu.math.point.translate(bot.center(), offsetVectorFromCenter);
    };

    bot.weapon.botRelativeMountingPoint = function () {
        return { x: 0, y: bot.height / 2 };
    };

    bot.weapon.botRelativeMuzzlePosition = function () {
        return gosu.math.point.add(
            bot.weapon.botRelativeMountingPoint(),
            { x: 0, y: bot.weapon.height });
    };

    bot.weapon.muzzlePosition = function () {
        var offsetVectorFromCenter = gosu.math.point.rotate(
            bot.weapon.botRelativeMuzzlePosition(),
            bot.angle);

        return gosu.math.point.translate(bot.center(), offsetVectorFromCenter);
    };

    bot.center = function () {
        return { x: bot.x + bot.width / 2, y: bot.y + bot.height / 2 };
    };

    bot.position = function () {
        return { x: bot.x, y: bot.y };
    };

    bot.turn = function (degrees) {
        bot.angle = gosu.math.normalizeAngleInDegrees(bot.angle + degrees);
    };

    bot.moveForward = function () {
        moveRelativeToBot({ x: 0, y: 1 });
    };

    bot.moveBack = function () {
        moveRelativeToBot({ x: 0, y: -1 });
    };

    bot.moveLeft = function () {
        moveRelativeToBot({ x: -1, y: 0 });
    };

    bot.moveRight = function () {
        moveRelativeToBot({ x: 1, y: 0 });
    };

    function moveRelativeToBot(vector) {
        var movementVector = gosu.math.point.rotate(vector, bot.angle);

        translate(movementVector);
    }

    bot.moveNorth = function () {
        bot.y--;
    };

    bot.moveSouth = function () {
        bot.y++;
    };

    bot.moveWest = function () {
        bot.x--;
    };

    bot.moveEast = function () {
        bot.x++;
    };

    bot.fire = function () {

        if (bot.weapon.cooldownTimeLeft > 0) {
            return;
        }

        raiseShotFiredEvent();

        bot.weapon.cooldownTimeLeft = bot.weapon.cooldownTime;
    };

    bot.onShotFired = function (callback) {
        shotFiredCallbacks.push(callback);
    }

    bot.onKilled = function (callback) {
        killedCallbacks.push(callback);
    }

    bot.onHitByBullet = function (callback) {
        hitByBulletCallbacks.push(callback);
    }

    function translate(vector) {
        bot.x += vector.x;
        bot.y += vector.y;
    }

    bot.createStatus = function (simplified) {

        var seenBots = null;

        // Since seenBots calls createStatus for the other bots
        // this is an endless loop waiting to happen if two bots see
        // each other at the same time. 
        if (!simplified) {
            seenBots = collisionDetector.seenBots(bot).map(function (bot) {
                // Use simplified status to avoid endless loop
                return bot.createStatus(true);
            });
        }

        return {
            position: {
                x: bot.x,
                y: bot.y,
                width: bot.width,
                height: bot.height,
                isAtSouthWall: gosuArena.arenaHeight - bot.bottom() < 1,
                isAtNorthWall: bot.top() < 1,
                isAtWestWall: bot.left() < 1,
                isAtEastWall: gosuArena.arenaWidth - bot.right() < 1
            },
            arena: {
                width: gosuArena.arenaWidth,
                height: gosuArena.arenaHeight
            },
            angle: bot.angle,
            roundsUntilWeaponIsReady: bot.weapon.cooldownTimeLeft,
            canFire: bot.weapon.cooldownTimeLeft <= 0,
            seenBots: seenBots,
            canMoveForward: collisionDetector.canPerformMoveAction(bot, bot.moveForward),
            canMoveBack: collisionDetector.canPerformMoveAction(bot, bot.moveBack),
            canMoveNorth: collisionDetector.canPerformMoveAction(bot, bot.moveNorth),
            canMoveSouth: collisionDetector.canPerformMoveAction(bot, bot.moveSouth),
            canMoveEast: collisionDetector.canPerformMoveAction(bot, bot.moveEast),
            canMoveWest: collisionDetector.canPerformMoveAction(bot, bot.moveWest),
            canTurnLeft: collisionDetector.canPerformMoveAction(bot, function () {
                bot.turn(-1);
            }),
            canTurnRight: collisionDetector.canPerformMoveAction(bot, function () {
                bot.turn(1);
            })
        };
    }

    bot.tick = function() {

        if (bot.weapon.cooldownTimeLeft > 0) {
            bot.weapon.cooldownTimeLeft--;
        }

        var status = bot.createStatus();

        tickCallback(userActionQueue, status);

        for (var i = 0; i < options.actionsPerRound; i++) {
            actionQueue.performNext(bot);
        }
    }

    bot.teleportToRandomLocation = function () {
        bot.x = Math.random() * (gosuArena.arenaWidth - bot.width);
        bot.y = Math.random() * (gosuArena.arenaHeight - bot.height);
    };

    var rectangleCache = gosuArena.rectangleCache.create(bot);
    var sightRectangleCache = gosuArena.rectangleCache.create(bot);

    bot.rectangle = function() {
        if (!rectangleCache.isValidFor(bot)) {
            rectangleCache.addEntry(bot, calculateRectangle());
        }

        return rectangleCache.getEntry(bot);
    };

    function calculateRectangle() {
        var botRectangle = gosu.math.rectangle.createFromPoints({
            x1: bot.x,
            y1: bot.y,
            x2: bot.x + bot.width,
            y2: bot.y + bot.height
        });

        return botRectangle.rotateAroundCenter(bot.angle);
    };

    bot.sightRectangle = function () {

        if (!sightRectangleCache.isValidFor(bot)) {
            sightRectangleCache.addEntry(bot, calculateSightRectangle());
        }

        return sightRectangleCache.getEntry(bot);
    }

    function calculateSightRectangle() {
        var sightArea = gosu.math.rectangle.createFromPoints({
            x1: bot.x + bot.width / 2 - bot.sight.width / 2,
            y1: bot.y,
            x2: bot.x + bot.width / 2 + bot.sight.width / 2,
            y2: bot.y + bot.sight.length
        });

        return sightArea.rotate(bot.angle, bot.center());
    };

    function raiseKilledEvent() {
        killedCallbacks.forEach(function(callback) {
            callback(bot);
        });
    }

    function raiseShotFiredEvent() {
        shotFiredCallbacks.forEach(function (callback) {
            callback(bot);
        });
    }

    function raiseHitByBulletEvent(bullet) {

        var status = bot.createStatus();
        var eventArgs = {
            angle: gosu.math.normalizeAngleInDegrees(bullet.angle - 180)
        };

        hitByBulletCallbacks.forEach(function (callback) {
            callback(userActionQueue, status, eventArgs);
        });
    }

    bot.hitBy = function (bullet) {
        bot.health -= bullet.damage;

        raiseHitByBulletEvent(bullet);

        if (!bot.isAlive()) {
            raiseKilledEvent();
        }
    };

    gosu.snapshot.extend(bot);

    return bot;
};
