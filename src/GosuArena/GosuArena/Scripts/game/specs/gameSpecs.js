describe("Game", function () {
    var visualizer = null;
    var clock = null;
    var botOptions = null;

    var arenaHeight = 400;
    var arenaWidth = 400;
    var wallThickness = 10;
    var botWidth = null;
    var botHeight = null;

    var arenaState = null;

    var arenaStateInterceptor = {
        initialize: function (state) {
            arenaState = state;
        }
    };

    beforeEach(function () {
        visualizer = {
            render: function() { },
            arenaHeight: arenaHeight,
            arenaWidth: arenaWidth,
            wallThickness: wallThickness
        };

        botOptions = gosuArena.factories.createSafeBotOptions({}, true);

        botWidth = botOptions.width;
        botHeight = botOptions.height;

        clock = gosuArena.gameClock.createFake();

        gosuArena.engine.reset();
        gosuArena.engine.start(visualizer, clock,{
            isTraining: true
        });
    });

    describe("Bot", function () {
        it("can move forward, back, east, west and north when facing west next to south wall", function () {
            gosuArena.register({
                tick: function (actionQueue, status) {
                    expect(status.canMoveForward()).toEqual(true);
                    expect(status.canMoveBack()).toEqual(true);
                    expect(status.canMoveNorth()).toEqual(true);
                    expect(status.canMoveEast()).toEqual(true);
                    expect(status.canMoveWest()).toEqual(true);
                    expect(status.canMoveSouth()).toEqual(false);
                    expect(status.canMoveLeft()).toEqual(false);
                    expect(status.canMoveRight()).toEqual(true);
                }, options: {
                    startPosition: {
                        x: arenaWidth / 2,
                        y: arenaHeight - botWidth,
                        angle: 90
                    }
                }
            });

            clock.doTick();
        });

        it("can move back, east and south when facing west in north west corner", function () {
            gosuArena.register({
                tick: function (actionQueue, status) {
                    expect(status.canMoveForward()).toEqual(false);
                    expect(status.canMoveBack()).toEqual(true);
                    expect(status.canMoveNorth()).toEqual(false);
                    expect(status.canMoveEast()).toEqual(true);
                    expect(status.canMoveWest()).toEqual(false);
                    expect(status.canMoveSouth()).toEqual(true);
                    expect(status.canMoveLeft()).toEqual(true);
                    expect(status.canMoveRight()).toEqual(false);
                },
                options: {
                    startPosition: {
                        x: 0,
                        y: 0,
                        angle: 90
                    }
                }
            });

            clock.doTick();
        });

        it("can move forward, west and north when facing north in south east corner", function () {
            gosuArena.register({
                tick: function (actionQueue, status) {
                    expect(status.canMoveForward()).toEqual(true);
                    expect(status.canMoveBack()).toEqual(false);
                    expect(status.canMoveNorth()).toEqual(true);
                    expect(status.canMoveEast()).toEqual(false);
                    expect(status.canMoveWest()).toEqual(true);
                    expect(status.canMoveSouth()).toEqual(false);
                    expect(status.canMoveLeft()).toEqual(true);
                    expect(status.canMoveRight()).toEqual(false);
                },
                options: {
                    startPosition: {
                        x: arenaWidth - botWidth,
                        y: arenaHeight - botHeight,
                        angle: 180
                    }
                }
            });

            clock.doTick();
        });

        it("can turn both ways when in the middle of the field", function () {
            gosuArena.register({
                tick: function (actionQueue, status) {
                    expect(status.canTurnLeft()).toEqual(true);
                    expect(status.canTurnRight()).toEqual(true);
                },
                options: {
                    startPosition: {
                        x: 100,
                        y: 100,
                        angle: 0
                    }
                }
            });

            clock.doTick();
        });

        it("can not turn at all when in a corner", function () {
            gosuArena.register({
                tick: function (actionQueue, status) {
                    expect(status.canTurnLeft()).toEqual(false);
                    expect(status.canTurnRight()).toEqual(false);
                },
                options: {
                    startPosition: {
                        x: 0,
                        y: 0,
                        angle: 0
                    }
                }
            });

            clock.doTick();
        });

        it("receives a tick for each tick of the game", function () {

            var tickCountForBot1 = 0;
            var tickCountForBot2 = 0;

            gosuArena.register({
                tick: function (actionQueue, status) {
                    tickCountForBot1++;
                }
            });

            gosuArena.register({
                tick: function (actionQueue, status) {
                    tickCountForBot2++;
                }
            });

            clock.doTick();

            expect(tickCountForBot1).toBe(1);
            expect(tickCountForBot2).toBe(1);

            clock.doTick();

            expect(tickCountForBot1).toBe(2);
            expect(tickCountForBot2).toBe(2);
        });

        it("gets call to specified hitByBullet callback when the bot is hit by a bullet", function () {
            gosuArena.register({
                tick: function (actionQueue, status) { },
                onHitByBullet: function (actionQueue, status, eventArgs) {

                    expect(actionQueue.left).toBeDefinedFunction();
                    expect(status.angle).toEqual(180);
                    expect(status.position.x).toEqual(2);
                    expect(status.position.y).toEqual(1);
                    expect(eventArgs.angle).toEqual(270);

                    hitByBulletCallbackCount++;
                },
                options: {
                    startPosition: {
                        x: 2,
                        y: 1,
                        angle: 180
                    }
                }
            });

            // This bot spawns aiming directly at the other bot
            gosuArena.register({
                tick: function (actionQueue, status) {
                    actionQueue.fire();
                },
                options: {
                    startPosition: {
                        x: botWidth + 5,
                        y: 0,
                        angle: 90
                    }
                }
            });

            var hitByBulletCallbackCount = 0;

            clock.doTick(3);

            expect(hitByBulletCallbackCount).toEqual(1);
        });

        it("includes arena size in bot status of the tick event", function () {

            var wasTickCalled = false;

            gosuArena.register({
                tick: function (actionQueue, status) {
                    expect(status.arena.width).toEqual(arenaWidth);
                    expect(status.arena.height).toEqual(arenaHeight);

                    wasTickCalled = true;
                }
            });

            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });

        it("can turn a negative amount of degrees", function () {

            var tickCount = 0;

            gosuArena.register({
                tick: function (actionQueue, status) {
                    actionQueue.turn(-1);

                    if (tickCount == 1) {
                        expect(status.angle).toEqual(89);
                    }

                    tickCount++;
                },
                options: {
                    startPosition: {
                        x: 100,
                        y: 100,
                        angle: 90
                    }
                }
            });

            clock.doTick();
            clock.doTick();

            expect(tickCount).toEqual(2);
        });


        it("passes statuses of seen bots to tick callback rather than the bots themselves", function () {

            var bot1Position = { x: 1, y: 2 };
            var bot2Position = { x: botWidth + 10, y: 0 };

            gosuArena.register({
                tick: function (actionQueue, status) { },
                options: {
                    startPosition: {
                        x: bot1Position.x,
                        y: bot1Position.y,
                        angle: 0
                    }
                }
            });

            gosuArena.register({
                tick: function (actionQueue, status) { },
                options: {
                    startPosition: {
                        x: bot2Position.x,
                        y: bot2Position.y,
                        angle: 0
                    }
                }
            });

            var wasTickCalled = false;

            // This bot spawns aiming directly at the two other bots, which are
            // in a straight westward line.
            gosuArena.register({
                tick: function (actionQueue, status) {

                    expect(status.seenBots.length).toEqual(2);

                    // Make sure that the object passed as a seen bot
                    // doesn't have actual move actions defined
                    expect(status.seenBots[0].moveForward).toBe(undefined);

                    // Make sure there are seen bots matching the positions
                    // of the actual bots
                    expect(status.seenBots.filter(function (b) {
                        return b.position.x == bot1Position.x &&
                            b.position.y == bot1Position.y;
                    }).length).toEqual(1);

                    expect(status.seenBots.filter(function (b) {
                        return b.position.x == bot2Position.x &&
                            b.position.y == bot2Position.y;
                    }).length).toEqual(1);

                    wasTickCalled = true;
                },
                options: {
                    startPosition: {
                        x: botWidth * 2 + 20,
                        y: 0,
                        angle: 90
                    }
                }
            });

            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });

        it("status for seen bots contain direction information", function () {

            var bot1Position = { x: 1, y: 2 };

            gosuArena.register({
                tick: function (actionQueue, status) {
                    actionQueue.east();
                },
                options: {
                    startPosition: {
                        x: bot1Position.x,
                        y: bot1Position.y,
                        angle: 0
                    }
                }
            });

            var wasTickCalled = false;
            var round = 0;
            
            // This bot spawns aiming directly at the other bot, which is
            // to the west
            gosuArena.register({
                tick: function (actionQueue, status) {

                    expect(status.seenBots.length).toEqual(1);
                    
                    if (round > 0) {
                        expect(status.seenBots[0].direction).toEqualVector({ x: 1, y: 0 });
                    }
                    
                    wasTickCalled = true;
                    round++;
                },
                options: {
                    startPosition: {
                        x: 100,
                        y: 0,
                        angle: 90
                    }
                }
            });

            clock.doTick();
            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });        
    });

    it("raises gameEnded event when there is only one bot left", function () {
        gosuArena.initiateBotRegistration("loser 1", function () {
            gosuArena.register({
                tick: function (actionQueue, status) { },
                options: {
                    name: "loser 1",
                    startPosition: {
                        x: 0,
                        y: 0,
                        angle: 0
                    }
                }
            });
        });

        gosuArena.initiateBotRegistration("loser 2", function () {
            gosuArena.register({
                tick: function (actionQueue, status) { },
                options: {
                    name: "loser 2",
                    startPosition: {
                        x: botWidth + 10,
                        y: 0,
                        angle: 0
                    }
                }
            });
        });

        // Wrap the creation of bot options so that we can modify the default
        // values without messing directly with the internal state of the engine
        // and without having to reimplement the whole createSafeBotOptions
        var defaultCreateSafeBotOptions = gosuArena.factories.createSafeBotOptions;

        gosuArena.factories.createSafeBotOptions = function (userOptions, isTraining) {
            var options = defaultCreateSafeBotOptions(userOptions, isTraining);

            options.weaponDamage = 50;
            options.weaponCooldownTime = 1;

            return options;
        }

        // This bot spawns aiming directly at the two other bots, which are
        // in a straight westward line.
        gosuArena.initiateBotRegistration("expected winner", function () {
            gosuArena.register({
                tick: function (actionQueue, status) {
                    if (status.canFire) {
                        actionQueue.fire();
                    }
                },
                options: {
                    startPosition: {
                        x: botWidth * 2 + 20,
                        y: 0,
                        angle: 90
                    }
                }
            });
        });

        var hasMatchEnded = false;

        gosuArena.events.matchEnded(function (result) {
            hasMatchEnded = true;

            var livingBots = arenaState.livingBots();

            expect(livingBots.length).toEqual(1);
            expect(livingBots[0].name).toEqual("expected winner");
            expect(result.winner.name).toEqual("expected winner");
        });

        gosuArena.engine.start(visualizer, clock, {
            isTraining: true,
            listeners: [arenaStateInterceptor]
        });

        // Tick a bunch of rounds to make sure that the third bot had the time needed
        // to kill the other two bots.
        for (var tickCount = 0; tickCount < 1000 && !hasMatchEnded; tickCount++) {
            clock.doTick();
        }

        expect(hasMatchEnded).toEqual(true);
    });

    it("Initializes listeners before bot registration when the game starts", function () {
        gosuArena.initiateBotRegistration("bot", function () {
            gosuArena.register({
                tick: function () { }
            });
        });

        var actualArenaState = null;
        var wasInitializeCalled = false;

        var listener = {
            initialize: function (arenaState) {
                wasInitializeCalled = true;
                actualArenaState = arenaState;
                expect(arenaState.livingBots()).toBeEmpty();
            }
        };

        gosuArena.engine.start(visualizer, clock, {
            isTraining: true,
            listeners: [listener]
        });

        expect(wasInitializeCalled).toBe(true);
        expect(actualArenaState.livingBots()).not.toBeEmpty();
    });

    it("gives unique ids to bots in order of registration", function () {

        gosuArena.engine.reset();

        gosuArena.initiateBotRegistration("bot1", function () {
            gosuArena.register({
                tick: function () { }
            });
        });

        gosuArena.initiateBotRegistration("bot2", function () {
            gosuArena.register({
                tick: function () { }
            });
        });

        gosuArena.engine.start(visualizer, clock, {
            isTraining: true,
            listeners: [arenaStateInterceptor]
        });

        expect(arenaState.bots.length).toEqual(2);
        expect(arenaState.bots[0].id).toBeTruthy();
        expect(arenaState.bots[1].id).toBeTruthy();

        // The ids should be running numbers incrementing for each registered bot
        // so that there is a defined ordering of the bots by their ids
        expect(arenaState.bots[0].id < arenaState.bots[1].id).toBe(true);
    });
});
