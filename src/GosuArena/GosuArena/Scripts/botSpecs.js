describe("bot", function () {
    var tick = function () {};

    /* When referencing the cardinal directions (north, south, ...) they
       are aligned as follows: North = positive y, East = positive x
    */

    it("moves 1 distance unit north when moving forward with angle 0", function () {
        var bot = gosuArena.factories.createBot(tick, {
            x: 0,
            y: 0,
            angle: 0
        });

        bot.moveForward();

        expect(bot.position()).toEqualPoint({ x: 0, y: 1 });
    });

    it("moves 1 distance unit north west when moving forward with angle 45", function () {
        var bot = gosuArena.factories.createBot(tick, {
            x: 1,
            y: 2,
            angle: 45
        });

        bot.moveForward();

        expect(bot.position()).toEqualPoint({
            x: 1 - 1/Math.sqrt(2),
            y: 2 + 1/Math.sqrt(2)
        });
    });

    it("notifies listeners when weapon is fired", function () {
        var wasNotified = 0;

        var bot = gosuArena.factories.createBot(tick, {
            weaponCooldownTime: 2
        });

        bot.onShotFired(function () {
            wasNotified = true;
        });

        bot.fire();

        expect(wasNotified).toEqual(true);
    });

    it("only fires weapon when weapon has had time to cool down after last firing", function () {
        var shotsFired = 0;

        var bot = gosuArena.factories.createBot(tick, {
            weaponCooldownTime: 2
        }, {
            seenBots: function () {
                return [];
            },
            canPerformMoveAction: function () {
                return true;
            }
        });

        bot.onShotFired(function () {
            shotsFired++;
        });

        // Round 1
        bot.fire();
        bot.tick();

        // Round 2, cooldown: 2
        bot.fire();
        bot.tick();

        // Round 3, cooldown: 1
        bot.fire();
        bot.tick();

        // Round 4, cooldown: 0, so now a new shot should be fired
        bot.fire();
        bot.tick();

        expect(shotsFired).toEqual(2);
    });

    it("considers x value of left-most corner to be its left position", function () {
        var bot = gosuArena.factories.createBot(tick, {
            x: 1,
            y: 2,
            width: 3.5,
            height: 4,
            angle: 0
        });

        expect(bot.left()).toEqual(1);
        expect(bot.right()).toEqual(4.5);
        expect(bot.top()).toEqual(6);
        expect(bot.bottom()).toEqual(2);
    });

    it("takes rotation into account when determining top, bottom, left and right", function () {
        var bot = gosuArena.factories.createBot(tick, {
            x: 1,
            y: 2,
            width: 2,
            height: 2,
            angle: 45
        });

        // center is at (2,3)
        expect(bot.left()).toBeCloseTo(2 - Math.sqrt(2));
        expect(bot.right()).toBeCloseTo(2 + Math.sqrt(2));
        expect(bot.top()).toBeCloseTo(3 + Math.sqrt(2));
        expect(bot.bottom()).toBeCloseTo(3 - Math.sqrt(2));
    });

    it("has weapong mounting point is in the middle of the top side", function () {
        var bot = gosuArena.factories.createBot(tick, {
            x: 1,
            y: 2,
            width: 3,
            height: 5,
            angle: 0
        });

        expect(bot.weapon.mountingPoint()).toEqualPoint({ x: 2.5, y: 7 });
    });

    it("takes rotation into account when determining weapon mounting point", function () {
        var bot = gosuArena.factories.createBot(tick, {
            x: -1,
            y: -1,
            width: 2,
            height: 2,
            angle: 45
        });

        expect(bot.weapon.mountingPoint()).toEqualPoint({
            x: -1/Math.sqrt(2),
            y: 1/Math.sqrt(2)
        });
    });

    it("weapon mounting point in bot coordinate system is the vector from center to mounting point relative to bot", function () {
        var bot = gosuArena.factories.createBot(tick, {
            x: -1,
            y: -1,
            width: 2,
            height: 3,
            angle: 45
        });

        expect(bot.weapon.botRelativeMountingPoint()).toEqualPoint({ x: 0, y: 1.5 });
    });

    it("weapon muzzle is at the forward end of the weapon", function () {
       var bot = gosuArena.factories.createBot(tick, {
           x: -1,
           y: -1,
           width: 2,
           height: 2,
           angle: 45,
           weaponHeight: 1
        });

        expect(bot.weapon.muzzlePosition()).toEqualPoint({
            x: -Math.sqrt(2),
            y: Math.sqrt(2)
        }); 
    });

    it("weapon muzzle point in bot coordinate system is the vector from center to the farthest point of the weapon relative to bot", function () {
        var bot = gosuArena.factories.createBot(tick, {
            x: -1,
            y: -1,
            width: 2,
            height: 3,
            angle: 45,
            weaponHeight: 1.3
        });

        expect(bot.weapon.botRelativeMuzzlePosition()).toEqualPoint({ x: 0, y: 2.8 });
    });

    it("raises event when killed", function () {
        var bot = gosuArena.factories.createBot(tick, {
            initialHealthPoints: 50
        });
        var enemyBot = gosuArena.factories.createBot(tick, { });

        var wasKilledEventRaised = false;

        bot.onKilled(function () {
            wasKilledEventRaised = true;
        });

        for (var i = 0; i < 100 && bot.isAlive(); i++) {
            bot.hitBy(gosuArena.factories.createBullet(enemyBot));
        }

        expect(wasKilledEventRaised).toEqual(true);
    });

    it("raises event when hit by bullet", function () {
        var bot = gosuArena.factories.createBot(tick, {
            initialHealthPoints: 50
        });
        var enemyBot = gosuArena.factories.createBot(tick, { });

        var bullet = gosuArena.factories.createBullet(enemyBot);

        var wasHitByBulletEventRaised = false;

        bot.onHitByBullet(function () {
            wasHitByBulletEventRaised = true;
        });
        
        bot.hitBy(bullet);

        expect(wasHitByBulletEventRaised).toBe(true);
    });

    it("sends south-east as angle from which the bullet came with the onHitByBullet event when hit by bullet travelling north-west", function () {
        var bot = gosuArena.factories.createBot(tick, {
            initialHealthPoints: 50
        });
        var enemyBot = gosuArena.factories.createBot(tick, {
            angle: 135 // north-west
        });

        var bullet = gosuArena.factories.createBullet(enemyBot);

        var actualAngle = null;

        bot.onHitByBullet(function (eventArgs) {
            actualAngle = eventArgs.angle;
        });
        
        bot.hitBy(bullet);

        expect(actualAngle).toEqual(315);
    });

        it("sends north-east as angle from which the bullet came with the onHitByBullet event when hit by bullet travelling south-west", function () {
            
        var bot = gosuArena.factories.createBot(tick, { });
        var enemyBot = gosuArena.factories.createBot(tick, {
            angle: 45
        });

        var bullet = gosuArena.factories.createBullet(enemyBot);

        var actualAngle = null;

        bot.onHitByBullet(function (eventArgs) {
            actualAngle = eventArgs.angle;
        });
        
        bot.hitBy(bullet);

        expect(actualAngle).toEqual(225);
    });
});
