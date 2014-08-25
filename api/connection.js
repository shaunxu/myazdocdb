(function () {
    'use strict';

    var DocumentDBClient = require('documentdb').DocumentClient;
    var current = null;

    exports.connect = function (req, res) {
        var host =req.params.endpoint;
        var key = req.params.key;
        if (current) {
            res.send(200);
        }
        else {
            current = new DocumentDBClient(host, { masterKey: key });
            res.send(200);
        }
    };

    exports.disconnect = function (req, res) {
        current = null;
        res.send(200);
    };

    exports.current = current;
})();