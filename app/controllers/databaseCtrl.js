(function () {
    'use strict';

    var controllerName = 'database';

    app.controller('DatabaseIndexCtrl', function ($scope, $alert, api) {
        api.request(controllerName, 'list', null, function (error, dbs) {
            if (error) {
                $alert(JSON.stringify(error, null, 2));
            }
            else {
                $scope.databases = dbs;
            }
        });
    });
})();