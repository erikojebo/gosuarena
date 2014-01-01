$(function() {
    $(document).on("click", "li.bot", function() {
        $(this).toggleClass("selected-bot");
    });

    $(document).on("click", "#play-button", function () {
        var selectedBotElements = $(".selected-bot, .preselected-bot");

        var botIds = $.map(selectedBotElements, function(b) {
            return $(b).attr("data-bot-name");
        });

        $("#names").val(botIds.reduce(function(a, b) { return a + ',' + b; }));
    });
});