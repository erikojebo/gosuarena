var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createSafeBotOptions = function (userOptions, isTraining) {

    var width = 20;
    var height = 20;
    var weaponCooldownTime = 25;
    var weaponWidth = width * 0.2;
    var weaponLength = height * 0.3;
    var weaponDamage = 10;
    var initialHealthPoints = 100;
    var sightWidth = 1;
    var sightLength = 1000;

    function isValidX(value) {
        return value >= 0 && value <= gosuArena.arenaWidth - width;
    }

    function isValidY(value) {
        return value >= 0 && value <= gosuArena.arenaHeight - height;
    }


    userOptions = userOptions || {};
    userOptions.startPosition = userOptions.startPosition || {};

    var x = Math.random() * (gosuArena.arenaWidth - width);
    var y = Math.random() * (gosuArena.arenaHeight - height);

    var angle = 0;

    if (isTraining) {
        if (isValidX(userOptions.startPosition.x)) {
            x = userOptions.startPosition.x;
        }

        if (isValidY(userOptions.startPosition.y)) {
            y = userOptions.startPosition.y;
        }

        angle = userOptions.startPosition.angle || angle;
    }

    return {
        width: width,
        height: height,
        x: x,
        y: y,
        angle: angle,
        color: userOptions.color || "#cecece",
        name: null, // Set through the registration process
        weaponCooldownTime: weaponCooldownTime,
        weaponWidth: weaponWidth,
        weaponHeight: weaponLength,
        weaponDamage: weaponDamage,
        sightWidth: sightWidth,
        sightLength: sightLength,
        initialHealthPoints: initialHealthPoints
    };
};
