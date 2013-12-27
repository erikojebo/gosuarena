describe("math", function () {
    describe("vector", function () {
        var vector1, vector2;

        beforeEach(function () {
            this.addMatchers({
                toBeCloseTo: function(expectedValue) {
                    var actualValue = this.actual;
                    return Math.abs(expectedValue - actualValue) < 0.00001;
                }
            });

            vector0 = gosu.math.createVector(0, 0)
            vector1 = gosu.math.createVector(1, 0);
            vector2 = gosu.math.createVector(0, 1);
            vector3 = gosu.math.createVector(2, 2);
        });

        it("is initialized with given coordinates", function () {
            expect(vector1.x).toEqual(1);
            expect(vector1.y).toEqual(0);

            expect(vector2.x).toEqual(0);
            expect(vector2.y).toEqual(1);
        });

        describe("length", function () {
            it("is zero for vector ending in (0,0)", function () {
                expect(vector0.length()).toEqual(0);
            });

            it("is 1 for vector ending in (1,0)", function () {
                expect(vector1.length()).toEqual(1);
            });

            it("is sqrt(8) for vector ending in (2,2)", function () {
                expect(vector3.length()).toEqual(Math.sqrt(8));
            });
        });

        describe("scalar product", function () {
            it("is 0 for (0,0) and (0,0)", function () {
                expect(vector0.scalarProduct(vector0)).toEqual(0);
            })

            it("is 2 for (1,0) and (2,2)", function () {
                expect(vector1.scalarProduct(vector3)).toEqual(2);
            })

            it("is 8 for (2,2) and (2,2)", function () {
                expect(vector3.scalarProduct(vector3)).toEqual(8);
            })
        });

        describe("angle", function () {

            it("has no angle to itself", function () {
                expect(vector1.angleTo(vector1)).toEqual(0);
            });

            it("is 1 for vector ending in (1,0)", function () {
                expect(vector1.length()).toEqual(1);
            });

            it("is 90 degrees to orthogonal vector", function () {
                expect(vector1.angleTo(vector2)).toEqual(90);
            });

            it("is 180 degrees to vector pointing in the opposite direction", function () {
                expect(vector3.angleTo(gosu.math.createVector(-2, -2))).toBeCloseTo(180);
            });
        });
    });
});
