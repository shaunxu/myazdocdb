(function () {
    'use strict';

    exports.initialize = function (app) {
        var connection = require('./connection.js');
        var database = require('./database.js');

        app.post('/api/connect', connection.connect);
        app.post('/api/disconnect', connection.disconnect);

        app.get('/api/databases', database.list);
    };
})();
