﻿var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizer = function (canvas) {

    var botCanvases = [];
    var hasMatchEnded = false;
    var hasDrawnWinnerName = false;
    var matchResult = null;

    var wallColor = "#000";
    var fieldColor = "#fff";

    var context = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var wallThickness = 25;
    var tileWidth = 53;
    var tileHeight = 53;
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
        matchResult = result;
    });

    function clearField() {

        if (gosuArena.sprites.background) {
            context.drawImage(
                gosuArena.sprites.background,
                wallThickness,
                wallThickness,
                arena.width,
                arena.height);
        } else {
            context.fillStyle = fieldColor;

            // Clear playing field within walls
            context.clearRect(
                arena.left,
                arena.top,
                arena.width,
                arena.height);
        }
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

            context.save();

            var terrainRectangle = terrain.rectangle();

            var tileCount = Math.ceil(terrain.width / tileWidth);

            var center = adjustToCanvasCoordinates(terrainRectangle.center);

            context.translate(center.x, center.y);

            var angleInRadians = gosu.math.degreesToRadians(terrain.angle);

            context.rotate(angleInRadians);
            context.translate(-terrain.width / 2, -terrain.height / 2);

            var image = gosuArena.sprites.wallNorth;

            if (terrain.angle > 45 && terrain.angle <= 135) {
                image = gosuArena.sprites.wallEast;
            } else if (terrain.angle > 135 && terrain.angle <= 225) {
                image = gosuArena.sprites.wallSouth;
            } else if (terrain.angle > 225 && terrain.angle <= 315) {
                image = gosuArena.sprites.wallWest;
            }

            for (var i = 0; i <= tileCount; i++) {
                context.save();

                // Translate to center of image to draw
                context.translate(
                    i * image.width + image.width / 2,
                    image.height / 2
                );

                // Rotate back to neutral since the images are
                // already rotated
                context.rotate(-angleInRadians);

                context.drawImage(
                    image,
                        -image.width / 2,
                        -image.height / 2,
                    image.width,
                    image.height
                );

                context.restore();
            }

            image = gosuArena.sprites.wallCornerLeft;

            context.drawImage(image, 0, 0, image.width, image.height);

            image = gosuArena.sprites.wallCornerRight;

            context.drawImage(
                image, terrain.width - image.width, 0, image.width, image.height);

            context.restore();
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

        context.fillStyle = "white";
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
            drawSight(bot);

            context.rotate(-angleInRadians);

            drawBotHealthIndicator(bot);
            drawBotName(bot);

            context.restore();
        });
    }

    function hexToRgb(hex) {
        var hexR, hexG, hexB;

        if (hex.length <= 4) {
            result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
            hexR = result[1] + result[1];
            hexG = result[2] + result[2];
            hexB = result[3] + result[3];
        } else {
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            hexR = result[1];
            hexG = result[2];
            hexB = result[3];
        }

        return result ? {
            r: parseInt(hexR, 16),
            g: parseInt(hexG, 16),
            b: parseInt(hexB, 16)
        } : null;
    }

    function drawBotBody(bot) {
        // The context is translated to the center of the bot, so the
        // position is relative to that
        var image = gosuArena.sprites.bot;

        if (!botCanvases[bot.uniqueId]) {
            var canvas = document.createElement('canvas');

            canvas.width = image.width;;
            canvas.height = image.height;;

            var tintingContext = canvas.getContext('2d');

            tintingContext.drawImage(image, 0, 0);

            var imageData = tintingContext.getImageData(0, 0, image.width, image.height);
            var rgba = imageData.data;

            var botColor = hexToRgb(bot.color);

            // Step by 4 since there are 4 values for each pixel (rgba)
            for (var px = 0; px < rgba.length - 4; px += 4) {

                var r = rgba[px];
                var g = rgba[px+1];
                var b = rgba[px+2];

                // Color distance allowed for pixel to be kept at
                // original color (not tinted)
                var tintTolerance = 20;

                // If the rgb values are on the same level (i.e 12,12,12)
                // then the pixel is considered to be gray scale and should
                // not be tinted
                var isGrayScale = Math.abs(r - b) < tintTolerance &&
                    Math.abs(r - g) < tintTolerance &&
                    Math.abs(g - b) < tintTolerance;

                if (isGrayScale) {
                    continue;
                }

                var tintFactor = 0.5;

                rgba[px] = rgba[px] * (1 - tintFactor) + botColor.r * tintFactor;   // r
                rgba[px+1] = rgba[px+1] * (1 - tintFactor) + botColor.g * tintFactor; // g
                rgba[px+2] = rgba[px+2] * (1 - tintFactor) + botColor.b * tintFactor; // b
                rgba[px+3]; // a
            }

            tintingContext.putImageData(imageData, 0, 0);

            botCanvases[bot.uniqueId] = canvas;
        }

        var botCanvas = botCanvases[bot.uniqueId];

        context.drawImage(botCanvas, -botCanvas.width / 2, -botCanvas.height / 2);
    }

    function drawSight(bot) {
        if (!gosuArena.settings.showBotSights()) {
            return;
        }

        context.save();

        context.fillStyle = "rgba(255, 0, 0, 0.7)";

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

        context.fillStyle = "white";
        context.font = "bold 30px verdana";

        var message = "The winner is " + matchResult.winner.name + "!";

        if (matchResult.winner.type == "team") {
            message = "The winner is team " + matchResult.winner.name + "!";
        }
        
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
        wallThickness: wallThickness,
        render: render
    };
};
