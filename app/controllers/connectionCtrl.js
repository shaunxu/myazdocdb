(function () {
    'use strict';

    app.controller('ConnectionCtrl', function ($scope, $router, $alert, credentials) {
        var connect = function () {
            credentials.set($scope.host, $scope.key);
            if (credentials.isConnected() === true) {
                refresh();
            }
            else {
                $alert('Please specify host and key.');
            }
        };

        var disconnect = function () {
            credentials.reset();
            refresh();
            $router.navigate('/dashboard');
        };

        var refresh = function () {
            $scope.host = credentials.host;
            $scope.key = credentials.key;
            $scope.isConnected = credentials.isConnected();
            $scope.connect = connect;
            $scope.disconnect = disconnect;
        };

        refresh();
    });
})();