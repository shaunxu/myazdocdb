(function () {
    'use strict';

    var connection = require('./connection.js');

    exports.list = function (req, res) {
        connection.current.queryDatabases('SELECT * FROM root').toArray(function (error, databases) {
            if (error) {
                res.send(500, error);
            }
            else {
                res.json(databases);
            }
        });
    };
})();