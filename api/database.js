(function () {
    'use strict';

    var utitlies = require('./utils.js');

    module.exports.list = function (req, res) {
        var client = utitlies.createDocumentDBClientFromRequest(req);
        if (client) {
            client.queryDatabases('SELECT * FROM ROOT').toArray(function (error, dbs) {
                if (error) {
                    res.send(500, error);
                }
                else {
                    res.json(dbs);
                }
            });
        }
        else {
            res.send(500, 'Invalid authentication information.');
        }
    };
})();