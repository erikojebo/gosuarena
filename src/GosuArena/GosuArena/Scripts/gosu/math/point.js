var gosu = gosu || {};
gosu.math = gosu.math || {};
gosu.math.point = gosu.math.point || {};

gosu.math.point.rotate = function (point, degrees, rotationCenter) {

    rotationCenter = rotationCenter || { x: 0, y: 0 };

    var radians = gosu.math.degreesToRadians(degrees);

    var translatedPoint = gosu.math.point.translate(
        point,
        gosu.math.point.negate(rotationCenter));

    var rotatedPoint = {
        x: Math.cos(radians) * translatedPoint.x - Math.sin(radians) * translatedPoint.y,
        y: Math.sin(radians) * translatedPoint.x + Math.cos(radians) * translatedPoint.y
    };

    return gosu.math.point.translate(rotatedPoint, rotationCenter);
};

gosu.math.point.translate = function (point, vector) {
    return { x: point.x + vector.x, y: point.y + vector.y };
};

gosu.math.point.negate = function (point) {
    return { x: -point.x, y: -point.y };
};

gosu.math.point.subtract = function (point1, point2) {
    return { x: point1.x - point2.x, y: point1.y - point2.y };
}

gosu.math.point.add = function (point1, point2) {
    return { x: point1.x + point2.x, y: point1.y + point2.y };
}
