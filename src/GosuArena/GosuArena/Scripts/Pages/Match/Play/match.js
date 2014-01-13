(function () {
    
    var gameClock = null;

    gosuArena.events.matchEnded(function (result) {
        stopMatch();
    });

    gosuArena.matchViewModel = gosuArena.factories.createMatchViewModel();
    
    function restartMatch() {

        if (gameClock) {
            gameClock.stop();
        }
        
        gameClock = gosuArena.gameClock.create();

        var canvas = document.getElementById("gameCanvas");
        var gameVisualizer = gosuArena.factories.createGameVisualizer(canvas);

        gosuArena.engine.start(gameVisualizer, gameClock, {
            isTraining: gosuArena.settings.isTraining(),
            listeners: [gosuArena.matchViewModel]
        });

        gameClock.start();
    };

    function stopMatch() {
        if (gameClock) {
            gameClock.stop();            
        }
    }

    document.getElementById("restartMatch").onclick = restartMatch;
    document.getElementById("stopMatch").onclick = stopMatch;

    // Make sure the match is not started until all resources have been loaded
    // that are needed for the game (e.g. sprites)
    gosuArena.events.resourcesLoaded(function() {
        restartMatch();
    });

    $(function () {
        ko.applyBindings(gosuArena.matchViewModel); 
    });
})();
