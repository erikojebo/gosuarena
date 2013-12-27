describe("Bot", function () {
    var visualizer = null;
    var clock = null;
    var botOptions = null;

    var arenaHeight = 400;
    var arenaWidth = 400;

    beforeEach(function () {
        visualizer = {
            render: function() { },
            arenaHeight: arenaHeight,
            arenaWidth: arenaWidth
        };

        botOptions = gosuArena.factories.createSafeBotOptions({}, true);

        clock = gosuArena.gameClock.createFake();

        gosuArena.engine.start(visualizer, clock);
    });

    it("can move forward, back, east, west and north when facing west next to south wall", function () {
        gosuArena.register(function (actionQueue, status) {
            expect(status.canMoveForward).toEqual(true);
            expect(status.canMoveBack).toEqual(true);
            expect(status.canMoveNorth).toEqual(true);
            expect(status.canMoveEast).toEqual(true);
            expect(status.canMoveWest).toEqual(true);
            expect(status.canMoveSouth).toEqual(false);
        }, {
            startPosition: {
                x: arenaWidth / 2,
                y: arenaHeight - botOptions.width,
                angle: 90
            }
        });

        clock.doTick();
    });

    it("can move back, east and south when facing west in north west corner", function () {
        gosuArena.register(function (actionQueue, status) {
            expect(status.canMoveForward).toEqual(false);
            expect(status.canMoveBack).toEqual(true);
            expect(status.canMoveNorth).toEqual(false);
            expect(status.canMoveEast).toEqual(true);
            expect(status.canMoveWest).toEqual(false);
            expect(status.canMoveSouth).toEqual(true);
        }, {
            startPosition: {
                x: 0,
                y: 0,
                angle: 90
            }
        });

        clock.doTick();
    });

    it("can move forward, west and north when facing north in south east corner", function () {
        gosuArena.register(function (actionQueue, status) {
            expect(status.canMoveForward).toEqual(true);
            expect(status.canMoveBack).toEqual(false);
            expect(status.canMoveNorth).toEqual(true);
            expect(status.canMoveEast).toEqual(false);
            expect(status.canMoveWest).toEqual(true);
            expect(status.canMoveSouth).toEqual(false);
        }, {
            startPosition: {
                x: arenaWidth - botOptions.width,
                y: arenaHeight -botOptions.height,
                angle: 180
            }
        });

        clock.doTick();
    });

    it("can turn both ways when in the middle of the field", function () {
        gosuArena.register(function (actionQueue, status) {
            expect(status.canTurnLeft).toEqual(true);
            expect(status.canTurnRight).toEqual(true);
        }, {
            startPosition: {
                x: 100,
                y: 100,
                angle: 0
            }
        });

        clock.doTick();
    });

    it("can not turn at all when in a corner", function () {
        gosuArena.register(function (actionQueue, status) {
            expect(status.canTurnLeft).toEqual(false);
            expect(status.canTurnRight).toEqual(false);
        }, {
            startPosition: {
                x: 0,
                y: 0,
                angle: 0
            }
        });

        clock.doTick();
    });
});
