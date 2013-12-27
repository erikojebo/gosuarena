var gosu = gosu || {};
gosu.snapshot = gosu.snapshot || {};

gosu.snapshot.extend = function (obj) {

    var snapshotValues = {};

    obj.snapshot = function () {

        snapshotValues.length = 0;
        
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                snapshotValues[prop] = obj[prop];                
            }
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

