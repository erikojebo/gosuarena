var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createActionQueue = function (collisionDetector) {

    var actions = [];

    function north(count) {
        enqueueAction(function (bot) {
            changePosition(bot, function (b) {
                b.moveNorth();
            });
        }, count);
    }

    function south(count) {
        enqueueAction(function (bot) {
            changePosition(bot, function (b) {
                b.moveSouth();
            });
        }, count);
    }

    function west(count) {
        enqueueAction(function (bot) {
            changePosition(bot, function (b) {
                b.moveWest();
            });
        }, count);
    }

    function east(count) {
        enqueueAction(function(bot) {
            changePosition(bot, function (b) {
                b.moveEast();
            });
        }, count);
    }

    function turn(degrees) {
        enqueueAction(function (bot) {
            changePosition(bot, function(b) {
                b.turn(degrees);
            });            
        });
    }

    function forward(count) {
        enqueueAction(function (bot) {
            changePosition(bot, function(b) {
                b.moveForward();
            });            
        }, count);
    }

    function back(count) {
        enqueueAction(function (bot) {
            changePosition(bot, function(b) {
                b.moveBack();
            });            
        }, count);
    }

    function isEmpty() {
        return actions.length <= 0;
    }

    function length() {
        return actions.length;
    }

    function clear() {
        actions.length = 0;
    }

    function dequeueAction() {
        return actions.shift();
    }

    function enqueueAction(action, count) {
        count = count || 1;

        for (var i = 0; i < count; i++) {
            actions.push(action);
        }
    }

    function performNext(bot) {
        if (isEmpty()) {
            return;
        }

        var nextAction = dequeueAction();
        nextAction(bot);
    }

    function changePosition(bot, modifierFunction) {
        bot.snapshot();

        modifierFunction(bot);

        if (collisionDetector.hasCollided(bot)) {
            bot.restoreSnapshot();
        }
    }

    function fire(bot) {
        enqueueAction(function (b) {
            b.fire();
        });
    }

    return {
        north: north,
        south: south,
        west: west,
        east: east,
        performNext: performNext,
        clear: clear,
        isEmpty: isEmpty,
        length: length,
        turn: turn,
        forward: forward,
        back: back,
        fire: fire
    };
}
