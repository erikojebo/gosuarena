var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createBullet = function (bot) {

    var botMuzzlePosition = bot.weapon.muzzlePosition();

    var width = 3;
    var height = 6;


    var bullet = {
        x: botMuzzlePosition.x - width / 2,
        y: botMuzzlePosition.y - height / 2,
        width: width,
        height: height,
        color: "#f00",
        angle: bot.angle,
        firedBy: bot,
        damage: bot.weapon.damage
    };

    function translate(vector) {
        bullet.x += vector.x;
        bullet.y += vector.y;
    }

    bullet.tick = function () {
        var movementVector = gosu.math.point.rotate({ x: 0, y: 10 }, bullet.angle);
        translate(movementVector);
    };

    bullet.center = function () {
        return {
            x: bullet.x + bullet.width / 2,
            y: bullet.y + bullet.height / 2
        };
    };

    bullet.rectangle = function() {
        var bulletRectangle = gosu.math.rectangle.createFromPoints({
            x1: bullet.x,
            y1: bullet.y,
            x2: bullet.x + bullet.width,
            y2: bullet.y + bullet.height
        });

        return bulletRectangle.rotateAroundCenter(bullet.angle);
    };

    return bullet;
};
