var gosu = gosu || {};
gosu.math = gosu.math || {};

(function () {
    gosu.math.createVector = function(x, y) {
        var self = {};

        self.x = x;
        self.y = y;

        self.length = function() {
            return Math.sqrt(x * x + y * y);
        };

        self.scalarProduct = function(other) {
            return self.x * other.x + self.y * other.y;
        };

        self.angleTo = function(other) {
            var dotProduct = self.scalarProduct(other);
            var cosAngle = dotProduct / self.length() / other.length();

            var angleInRadians = Math.acos(cosAngle);
            return angleInRadians / (2 * Math.PI) * 360;
        };

        return self;
    };
})();
