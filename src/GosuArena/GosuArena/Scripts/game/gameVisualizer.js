﻿var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizer = function (canvas) {

    var hasMatchEnded = false;
    var hasDrawnWinnerName = false;
    var winnerName = null;
    
    var wallColor = "#000";
    var fieldColor = "#fff";

    var context = canvas.getContext("2d");
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var wallThickness = 10;
    var healthIndicatorWidth = 30;
    var healthIndicatorHeight = 5;
    var healthIndicatorTopMargin = 8;
    var nameTopMargin = 27;

    var arena = {
        top: wallThickness,
        bottom: canvasHeight - wallThickness,
        left: wallThickness,
        right: canvasWidth - wallThickness
    };

    arena.width = arena.right - arena.left;
    arena.height = arena.bottom - arena.top;

    gosuArena.events.matchEnded(function (result) {
        hasMatchEnded = true;
        winnerName = result.winner.name;
    });

    function clearField() {
        context.fillStyle = fieldColor;

        // Clear playing field within walls
        context.clearRect(
            arena.left,
            arena.top,
            arena.width,
            arena.height);
    }

    function adjustToCanvasCoordinates(point) {
        return {
            x: point.x + wallThickness,
            y: point.y + wallThickness
        };
    }

    function drawTerrain(arenaState) {
        context.fillStyle = wallColor;

        arenaState.terrain.forEach(function(terrain) {

            context.beginPath();
            var startPoint = adjustToCanvasCoordinates(terrain.corners[0]);
            context.moveTo(startPoint.x, startPoint.y);

            for(var i = 1; i < terrain.corners.length; i++) {
                var point = adjustToCanvasCoordinates(terrain.corners[i]);
                context.lineTo(point.x, point.y);
            }

            context.closePath();
            context.fill();
        });

        // For some reason the fill of the last shape gets filled
        // with a different fill color if another shape is drawn later with
        // a different fill color. This is a workaround to fix that issue
        // by creating a zero size path
        context.beginPath();
        context.closePath();
    }

    function drawBotName(bot) {

        if (!gosuArena.settings.showBotNames() || !bot.name) {
            return;
        }

        context.fillStyle = "black";
        context.font = "bold 12px sans-serif";

        var nameTextMeasurement = context.measureText(bot.name);

        context.fillText(
            bot.name,
            (-nameTextMeasurement.width / 2),
            bot.height / 2 + nameTopMargin);
    }

    function drawBotHealthIndicator(bot) {

        context.fillStyle = "red";
        context.strokeStyle = "black";

        context.rect(
            (-healthIndicatorWidth / 2),
            bot.height / 2 + healthIndicatorTopMargin,
            healthIndicatorWidth * bot.healthPercentage(),
            healthIndicatorHeight);

        context.fill();
        context.stroke();
    }

    function drawBots(arenaState) {
        arenaState.livingBots().forEach(function(bot) {
            context.fillStyle = bot.color;

            context.save();

            var botCenter = adjustToCanvasCoordinates(bot.center());
            var angleInRadians = gosu.math.degreesToRadians(bot.angle);

            context.translate(botCenter.x, botCenter.y);
            context.rotate(angleInRadians);

            drawBotBody(bot);
            drawWeapon(bot);
            drawSight(bot);

            context.rotate(-angleInRadians);

            drawBotHealthIndicator(bot);
            drawBotName(bot);

            context.restore();
        });
    }

    function drawBotBody(bot) {
        // The context is translated to the center of the bot, so the
        // position is relative to that
        context.fillRect(-bot.width / 2, -bot.height / 2, bot.width, bot.height);
    }

    function drawWeapon(bot) {
        var relativeWeaponMountingPoint = bot.weapon.botRelativeMountingPoint();

        context.save();
        context.translate(relativeWeaponMountingPoint.x, relativeWeaponMountingPoint.y);

        context.fillRect(-bot.weapon.width / 2, 0, bot.weapon.width, bot.weapon.height);

        context.restore();
    }

    function drawSight(bot) {
        if (!gosuArena.settings.showBotSights()) {
            return;
        }

        context.save();

        context.fillStyle = "rgba(255, 0, 0, 0.3)";

        var relativeWeaponMuzzlePoint = bot.weapon.botRelativeMuzzlePosition();

        context.translate(relativeWeaponMuzzlePoint.x, relativeWeaponMuzzlePoint.y);

        context.fillRect(-bot.sight.width / 2, 0, bot.sight.width, bot.sight.length);

        context.restore();
    }

    function drawBullets(arenaState) {
        arenaState.bullets.forEach(function (bullet) {
            context.fillStyle = bullet.color;

            context.save();

            var bulletCenter = adjustToCanvasCoordinates(bullet.center());
            var angleInRadians = gosu.math.degreesToRadians(bullet.angle);

            context.translate(bulletCenter.x, bulletCenter.y);
            context.rotate(angleInRadians);

            // The context is translated to the center of the bullet, so the
            // position is relative to that
            context.fillRect(
                (-bullet.width / 2),
                (-bullet.height / 2),
                bullet.width,
                bullet.height);

            context.restore();
        });
    }

    function drawWinnerName() {
        context.save();

        context.fillStyle = "black";
        context.font = "bold 30px verdana";

        var message = "The winner is " + winnerName + "!";

        var textMeasurement = context.measureText(message);

        context.translate(arena.width / 2, arena.height / 2);

        context.fillText(
            message,
            (-textMeasurement.width / 2),
            -100);

        hasDrawnWinnerName = true;
        
        context.restore();
    }

    function render(arenaState) {

        // No need to draw any more if the match is over and the result
        // has been rendered to the screen
        if (hasMatchEnded && hasDrawnWinnerName) {
            return;
        }
        
        context.save();

        clearField();

        drawTerrain(arenaState);
        drawBots(arenaState);
        drawBullets(arenaState);

        if (hasMatchEnded && !hasDrawnWinnerName) {
            drawWinnerName();
        }
        
        context.restore();
    }

    return {
        arenaWidth: arena.right - arena.left,
        arenaHeight: arena.bottom - arena.top,
        render: render
    };
};