(function () {
    'use strict';

    exports.initialize = function (app) {
        var database = require('./database.js');

        app.post('/api/database/list', database.list);
    };
})();
