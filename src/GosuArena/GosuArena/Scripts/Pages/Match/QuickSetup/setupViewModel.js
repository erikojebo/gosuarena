var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createSetupViewModel = function (bots, preselectedBots) {
    var selectedBots = ko.observableArray();
    var filterString = ko.observable();

    var createdBotViewModels = bots.map(function (bot) {
        return gosuArena.factories.createBotSelectionViewModel(bot);
    });

    var botViewModels = ko.observableArray(createdBotViewModels);

    var filteredBots = ko.computed(function () {
        return botViewModels().filter(function (bot) {
            var regex = new RegExp(filterString());
            return regex.test(bot.name) || regex.test(bot.authorName);
        }).sort();
    });

    var visibleBots = ko.computed(function () {
        return _.first(filteredBots(), 50);
    });

    var isResultLimited = ko.computed(function () {
        return visibleBots().length < filteredBots().length;
    });

    var hasSelectedBots = ko.computed(function () {
        return selectedBots().length > 0;
    });

    var isSelectionEmpty = ko.computed(function () {
        return !hasSelectedBots();
    });

    var selectedBotNames = ko.computed(function () {

        var allSelectedBots = [];

        selectedBots().forEach(function (bot) {
            allSelectedBots.push(bot);
        });

        preselectedBots.forEach(function (bot) {
           allSelectedBots.push(bot);
        });

        return allSelectedBots.map(function (bot) {
            return bot.name;
        });
    });

    function select(bot) {
        bot.isSelected(true);

        selectedBots.push(bot);
    }

    function deselect(bot) {
        bot.isSelected(false);

        selectedBots.remove(bot);
    }

    function toggleSelection (bot) {
        if (bot.isSelected()) {
            deselect(bot);
        } else {
            select(bot);
        }
    }

    return {
        allBots: botViewModels,
        selectedBots: selectedBots,
        filteredBots: filteredBots,
        visibleBots: visibleBots,
        selectedBotNames: selectedBotNames,
        toggleSelection: toggleSelection,
        isResultLimited: isResultLimited,
        filterString: filterString,
        hasSelectedBots: hasSelectedBots,
        isSelectionEmpty: isSelectionEmpty
    };
}
