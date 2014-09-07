(function () {
    'use strict';

    var controllerName = 'collection';

    app.controller('CollectionIndexCtrl', function ($scope, $stateParams, $alert, $modal, api) {
        var refresh = function () {
            api.request(controllerName, 'list', { databaseLink: $stateParams.l }, function (error, dbs) {
                if (error) {
                    $alert(JSON.stringify(error, null, 2));
                }
                else {
                    $scope.databases = dbs;
                }
            });
        };

        $scope.delete = function (id, selfLink) {
            var modalInstance = $modal.open({
                templateUrl: 'views/collection/delete.html',
                controller: 'CollectionDeleteCtrl',
                resolve: {
                    db: function () {
                        return {
                            id: id,
                            _self: selfLink
                        };
                    }
                }
            });
            modalInstance.result.then(function () {
                refresh();
            }, function () {});
        };

        $scope.create = function () {
            var modalInstance = $modal.open({
                templateUrl: 'views/collection/create.html',
                controller: 'CollectionCreateCtrl'
            });
            modalInstance.result.then(function () {
                refresh();
            }, function () {});
        };

        refresh();
    });

    app.controller('CollectionCreateCtrl', function ($scope, $alert, $modalInstance, api) {
        $scope.id = '';

        $scope.ok = function (id) {
            api.request(controllerName, 'create', { id: id }, function (error, db) {
                if (error) {
                    $alert(JSON.stringify(error, null, 2));
                }
                else {
                    $modalInstance.close(db);
                }
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('CollectionDeleteCtrl', function ($scope, $alert, $modalInstance, api, db) {
        $scope.id = '';
        $scope.db = db;

        $scope.ok = function (id) {
            if (id === db.id) {
                api.request(controllerName, 'remove', { id: id }, function (error) {
                    if (error) {
                        $alert(JSON.stringify(error, null, 2));
                    }
                    else {
                        $modalInstance.close();
                    }
                });
            }
            else {
                $alert('The name of the database you typed was incorrect.');
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
})();