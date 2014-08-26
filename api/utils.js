(function () {
    'use strict';

    var createDocumentDBClient = function (host, key) {
        var DocumentDBClient = require('documentdb').DocumentClient;
        var client = new DocumentDBClient(host, { masterKey: key });
        return client;
    };
    module.exports.createDocumentDBClient = createDocumentDBClient;

    var createDocumentDBClientFromRequest = function (req) {
        var host = req.headers['x-docdb-host'];
        var key = req.headers['x-docdb-key'];
        if (host && key) {
            return createDocumentDBClient(host, key);
        }
        else {
            return null;
        }
    };
    module.exports.createDocumentDBClientFromRequest = createDocumentDBClientFromRequest;
})();