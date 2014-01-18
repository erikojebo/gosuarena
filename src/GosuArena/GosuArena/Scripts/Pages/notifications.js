var ga = ga || {};

ga.showNotification = function(message, type) {
    $("#notificationContainer").notify({
        message: { text: message },
        type: type || "success",
        fadeOut: {
            enabled: true,
            delay: 2000
        }
    }).show();
};