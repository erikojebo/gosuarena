var gosu = gosu || {};
gosu.math = gosu.math || {};
gosu.math.rectangle = gosu.math.rectangle || {};

(function () {

    function createFromCorners(clockwiseCorners) {

        var corners = clockwiseCorners;

        // This was previously written as corners.map(...)
        // but was re-written for performance.
        var cornerXValues = new Array(4);
        var cornerYValues = new Array(4);

        for (var i = 0; i < 4; i++) {
            cornerXValues[i] = corners[i].x;
            cornerYValues[i] = corners[i].y;
        }

        // This was previously written as Math.min/max
        // but was rewritten inline to improve performance
        var minX = cornerXValues[0];
        var maxX = cornerXValues[0];
        var minY = cornerYValues[0];
        var maxY = cornerYValues[0];

        // Since all values are initialized with the first value,
        // skip the first value when comparing
        for (var i = 1; i < 4; i++) {

            if (cornerXValues[i] < minX) {
                minX = cornerXValues[i];
            } else if (cornerXValues[i] > maxX) {
                maxX = cornerXValues[i];
            }

            if (cornerYValues[i] < minY) {
                minY = cornerYValues[i];
            } else if (cornerYValues[i] > maxY) {
                maxY = cornerYValues[i];
            }
        }

        var center = { x: (maxX - minX) / 2 + minX, y: (maxY - minY) / 2 + minY };

        // This was previously extracted to a separate function, but was
        // inlined for performance
        var edges = [];

        for (var i = 0; i < 4; i++) {
            var nextIndex = (i + 1) % 4;
            var edge = {
                x1: corners[i].x,
                y1: corners[i].y,
                x2: corners[nextIndex].x,
                y2: corners[nextIndex].y
            };
            edges.push(edge);
        }

        function overlaps(otherRectangle) {

            if (maxY < otherRectangle.minY ||
                minY > otherRectangle.maxY ||
                maxX < otherRectangle.minX ||
                minX > otherRectangle.maxX) {
                return false;
            }

            var intersectingLineCount = 0;

            for (var i = 0; i < edges.length; i++) {
                for (var j = 0; j < otherRectangle.edges.length; j++) {
                    if (gosu.math.areLineSegmentsInternallyIntersecting(
                        edges[i],
                        otherRectangle.edges[j])) {

                        intersectingLineCount++;

                        if (intersectingLineCount >= 2) {
                            return true;
                        }
                    }
                }
            }

            var isOtherRectangleInsideThisOne =
                gosu.math.isPointInsideEdges(otherRectangle.corners[0], edges);

            var isThisRectangleInsideOther =
                gosu.math.isPointInsideEdges(corners[0], otherRectangle.edges);

            // If only one line is intersecting then one of the corners
            // of one rectangle is exactly on one edge of the other rectangle
            // which is not a proper overlap
            return intersectingLineCount >= 2 ||
                isOtherRectangleInsideThisOne ||
                isThisRectangleInsideOther;
        }

        function rotateAroundCenter(degrees) {
            return rotate(degrees, center);
        }

        function rotate(degrees, rotationCenter) {
            var rotatedCorners = corners.map(function (corner) {
                return gosu.math.point.rotate(corner, degrees, rotationCenter);
            });

            return createFromCorners(rotatedCorners);
        }

        return {
            center: center,
            corners: corners,
            edges: edges,
            overlaps: overlaps,
            rotateAroundCenter: rotateAroundCenter,
            rotate: rotate,
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY
        };
    }

    gosu.math.rectangle.createFromPoints = function (points) {

        var width = Math.abs(points.x1 - points.x2);
        var height = Math.abs(points.y1 - points.y2);

        var startPoint = {
            x: Math.min(points.x1, points.x2),
            y: Math.min(points.y1, points.y2)
        };

        return gosu.math.rectangle.create(startPoint, width, height);
    };


    gosu.math.rectangle.create = function (position, width, height) {

        var corners = [
            { x: position.x, y: position.y },
            { x: position.x, y: position.y + height },
            { x: position.x + width, y: position.y + height },
            { x: position.x + width, y: position.y }
        ];

        return createFromCorners(corners);
    };
})();
