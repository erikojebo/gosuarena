﻿var gosuArena = gosuArena || {};
gosuArena.facories = gosuArena.facories || {};

gosuArena.factories.createMatchViewModel = function () {

    var botLegends = ko.observableArray();

    function sortLegendsByHealth() {
        botLegends.sort(function (a, b) {
            return b.health() - a.health();
        });
    }

    function refresh() {
        botLegends().forEach(function (viewModel) {
            viewModel.refresh();
        });

        sortLegendsByHealth();
    }

    function initialize(arenaState) {

        botLegends.removeAll();

        arenaState.onBotAdded(function (bot) {
            var viewModel = gosuArena.factories.createBotViewModel(bot);
            botLegends.push(viewModel);
        });

        arenaState.onBotKilled(function (bot) {
            refresh();
        });

        arenaState.onBotHitByBullet(function (bot) {
            refresh();
        });
    }

    return {
        botLegends: botLegends,
        initialize: initialize
    };
};