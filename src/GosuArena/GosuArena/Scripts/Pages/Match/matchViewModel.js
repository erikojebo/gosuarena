var gosuArena = gosuArena || {};
gosuArena.facories = gosuArena.facories || {};

gosuArena.factories.createMatchViewModel = function () {

    var botLegends = ko.observableArray();

    function initialize(arenaState) {
        botLegends.removeAll();
        arenaState.onBotAdded(function (bot) {
            botLegends.push(bot);
        });
    }
    
    return {
        botLegends: botLegends,
        initialize: initialize
    };
};
