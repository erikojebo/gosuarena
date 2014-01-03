(function() {

    //    var botLegendsList = document.getElementById("botLegends");

    //    botLegendsList.innerHTML = "";

    //    gosuArena.engine.botLegends()
    //        .forEach(function (legend) {
    //            var li = document.createElement("li");

    //            var colorDiv = document.createElement("div");
    //            colorDiv.setAttribute("style", "background-color: " + legend.color);
    //            li.appendChild(colorDiv);

    //            var nameSpan = document.createElement("span");
    //            nameSpan.appendChild(document.createTextNode(legend.name || "-"));

    //            li.appendChild(nameSpan);

    //            botLegendsList.appendChild(li);
    //        });
    //};

    function initializeBotLegends() {
        var botLegends = gosuArena.engine.botLegends();
        var matchViewModel = gosuArena.factories.createMatchViewModel(botLegends);
        ko.applyBindings(matchViewModel);
    }

    gosuArena.matchStarted(initializeBotLegends);
})();