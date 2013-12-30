describe("Bot", function () {
    var visualizer = null;
    var clock = null;
    var botOptions = null;

    var arenaHeight = 400;
    var arenaWidth = 400;

    var botWidth = null;
    var botHeight = null;

    beforeEach(function () {
        visualizer = {
            render: function() { },
            arenaHeight: arenaHeight,
            arenaWidth: arenaWidth
        };

        botOptions = gosuArena.factories.createSafeBotOptions({}, true);

        botWidth = botOptions.width;
        botHeight = botOptions.height;

        clock = gosuArena.gameClock.createFake();

        gosuArena.engine.start(visualizer, clock);
    });

    it("can move forward, back, east, west and north when facing west next to south wall", function () {
        gosuArena.register({
            tick: function (actionQueue, status) {
                expect(status.canMoveForward).toEqual(true);
                expect(status.canMoveBack).toEqual(true);
                expect(status.canMoveNorth).toEqual(true);
                expect(status.canMoveEast).toEqual(true);
                expect(status.canMoveWest).toEqual(true);
                expect(status.canMoveSouth).toEqual(false);
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
                expect(status.canMoveForward).toEqual(false);
                expect(status.canMoveBack).toEqual(true);
                expect(status.canMoveNorth).toEqual(false);
                expect(status.canMoveEast).toEqual(true);
                expect(status.canMoveWest).toEqual(false);
                expect(status.canMoveSouth).toEqual(true);
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
                expect(status.canMoveForward).toEqual(true);
                expect(status.canMoveBack).toEqual(false);
                expect(status.canMoveNorth).toEqual(true);
                expect(status.canMoveEast).toEqual(false);
                expect(status.canMoveWest).toEqual(true);
                expect(status.canMoveSouth).toEqual(false);
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
                expect(status.canTurnLeft).toEqual(true);
                expect(status.canTurnRight).toEqual(true);
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
                expect(status.canTurnLeft).toEqual(false);
                expect(status.canTurnRight).toEqual(false);
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

    it("raises gameEnded event when there is only one bot left", function () {
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

        // This bot spawns aiming directly at the two other bots, which are
        // in a straight westward line.
        gosuArena.register({
            tick: function (actionQueue, status) {
                if (status.canFire) {
                    actionQueue.fire();
                }
            },
            options: {
                name: "expected winner",
                startPosition: {
                    x: botWidth * 2 + 20,
                    y: 0,
                    angle: 90
                }
            }
        });

        var hasMatchEnded = false;

        gosuArena.events.matchEnded(function (result) {
            hasMatchEnded = true;

            var livingBots = gosuArena.engine.botLegends().filter(function (bot) {
                return bot.isAlive;
            });

            expect(livingBots.length).toEqual(1);
            expect(livingBots[0].name).toEqual("expected winner");
            expect(result.winner.name).toEqual("expected winner");
        });

        // Tick a bunch of rounds to make sure that the third bot had the time needed
        // to kill the other two bots.
        for (var tickCount = 0; tickCount < 1000 && !hasMatchEnded; tickCount++) {
            clock.doTick();
        }

        expect(hasMatchEnded).toEqual(true);
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
});
