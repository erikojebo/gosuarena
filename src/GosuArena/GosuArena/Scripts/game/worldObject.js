var gosuArena = gosuArena || {};
gosuArena.worldObject = gosuArena.worldObject || {};

(function () {
    var worldObject = {
        x: 0,
        y: 0,
        angle: 0,
        color: "#000",
        width: 1,
        height: 1,
        center: function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        },
        rectangle: function () {
            var rectangle = gosu.math.rectangle.createFromPoints({
                x1: this.x,
                y1: this.y,
                x2: this.x + this.width,
                y2: this.y + this.height
            });

            return rectangle.rotateAroundCenter(this.angle);
        },
        translate: function (vector) {
            this.x += vector.x;
            this.y += vector.y;
        }
    };

    gosuArena.worldObject.create = function (properties) {
        var obj = Object.create(worldObject);

        gosuArena.extend(obj, properties);

        return obj;
    };
})();



