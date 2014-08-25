(function () {
    'use strict';

    app.factory('ConnectionService', function ($http) {
        return {
            token: '',
            connect: function (account, key, callback) {
                var self = this;
            },
            disconnect: function () {
                var self = this;
                self.token = '';
            }
        };
    });
})();
