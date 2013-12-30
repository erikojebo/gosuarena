(function () {
    var fps = 60;
    var gameClock = null;

    gosuArena.events.matchEnded(function (result) {
        alert("The winner is: " + result.winner.name);
        stopMatch();
    });

    function restartMatch() {

        if (gameClock) {
            gameClock.stop();
        }
        
        gameClock = gosuArena.gameClock.create(fps);
        
        var canvas = document.getElementById("gameCanvas");
        var gameVisualizer = gosuArena.factories.createGameVisualizer(canvas);

        gosuArena.engine.start(gameVisualizer, gameClock);

        gameClock.start();
    };

    function stopMatch() {
        if (gameClock) {
            gameClock.stop();            
        }
    }

    document.getElementById("restartMatch").onclick = restartMatch;
    document.getElementById("stopMatch").onclick = stopMatch;
    window.onload = restartMatch;
})();
