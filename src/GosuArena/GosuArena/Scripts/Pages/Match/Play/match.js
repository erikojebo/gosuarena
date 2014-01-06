(function () {
    
    var fps = 60;
    var gameClock = null;

    gosuArena.events.matchEnded(function (result) {
        stopMatch();
    });

    gosuArena.matchViewModel = gosuArena.factories.createMatchViewModel();
    
    function restartMatch() {

        if (gameClock) {
            gameClock.stop();
        }
        
        gameClock = gosuArena.gameClock.create(fps);

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


    $(function () {
        restartMatch();
        ko.applyBindings(gosuArena.matchViewModel); 
    });
})();
