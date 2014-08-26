(function () {
    'use strict';

    exports.initialize = function (app) {
        var database = require('./database.js');

        app.post('/api/databases', database.list);
    };
})();
