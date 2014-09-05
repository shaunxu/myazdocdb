(function () {
    'use strict';

    app.controller('ConnectionCtrl', function ($scope, $state, $alert, credentials) {
        var refresh = function () {
            $scope.host = credentials.host;
            $scope.key = credentials.key;
            $scope.connect = connect;
        };

        var connect = function () {
            credentials.set($scope.host, $scope.key);
            if (credentials.isConnected() === true) {
                refresh();
                $state.go('databases', undefined, undefined);
            }
            else {
                $alert('Please specify host and key.');
            }
        };

        // TODO: test purpose remove them release
        credentials.set(
            'https://shx.documents.azure.com:443/',
            'uQ/c0mhNedWn28DghOLrqlmkcGT8juUoOuIGGViEwJe0/oQX9xLk+zLHlKRd85KTJOFn+1/ZwfXhF+eLPE9kiw==');

        refresh();
    });
})();