var gosu = gosu || {};
gosu.snapshot = gosu.snapshot || {};

gosu.snapshot.extend = function (obj) {

    var snapshotValues = {};

    function snapshotSelectedProperties(propertyNames) {
        for (var i = 0; i < propertyNames.length; i++) {
            snapshotValues[propertyNames[i]] = obj[propertyNames[i]];
        }
    }

    function snapshotAllOwnProperties() {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                snapshotValues[prop] = obj[prop];
            }
        }
    }

    obj.snapshot = function () {

        snapshotValues.length = 0;

        if (arguments.length > 0) {
            snapshotSelectedProperties(arguments);
        } else {
            snapshotAllOwnProperties();
        }
    };

    obj.restoreSnapshot = function () {
        for (var prop in snapshotValues) {
            if (snapshotValues.hasOwnProperty(prop)) {
                obj[prop] = snapshotValues[prop];
            }
        }
    };
}
