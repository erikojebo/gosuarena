$(function() {
    $(document).on("click", "li.bot", function() {
        $(this).toggleClass("selected-bot");
    });

    $(document).on("click", "#play-button", function () {
        var selectedBotElements = $(".selected-bot");

        var botIds = $.map(selectedBotElements, function(b) {
            return $(b).attr("data-bot-name");
        });

        $("#names").val(botIds.reduce(function(a, b) { return a + ',' + b; }));

        //$.ajax({
        //    url: gosuArena.pageData.playUrl,
        //    type: 'post',
        //    contentType: 'application/json; charset=utf-8',
        //    data: JSON.stringify(botIds),
        //    traditional: true
        //}).done(function(data) {
        //    $("#page-container").html(data);
        //});
    });
});