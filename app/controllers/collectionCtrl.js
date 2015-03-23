(function () {
    'use strict';

    var controllerName = 'collection';

    app.controller('CollectionCtrl', function ($rootScope, $router, $location, $alert, $modal, api) {
        var $scope = this;

        var refresh = function () {
            api.request(controllerName, 'list', { databaseLink: $scope.db.link }, function (error, cols) {
                if (error) {
                    $alert(JSON.stringify(error, null, 2));
                }
                else {
                    $scope.items = cols;
                }
            });
        };

        $scope.delete = function (id, selfLink) {
            var modalInstance = $modal.open({
                templateUrl: 'views/collection/delete.html',
                controller: 'CollectionDeleteCtrl',
                resolve: {
                    db: function () {
                        return $scope.db;
                    },
                    col: function () {
                        return {
                            id: id,
                            link: selfLink
                        }
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
                controller: 'CollectionCreateCtrl',
                resolve: {
                    db: function () {
                        return $scope.db;
                    }
                }
            });
            modalInstance.result.then(function () {
                refresh();
            }, function () {});
        };

        console.log($location.search());

        $scope.db = {
            id: $routeParams.did,
            link: $routeParams.dl
        };
        $rootScope.breadcrumb.items = [
            {
                href: $router.generate('database', undefined, undefined),
                text: 'Databases'
            },
            {
                text: $scope.db.id
            }
        ];

        refresh();
    });

    app.controller('CollectionCreateCtrl', function ($scope, $alert, $modalInstance, api, db) {
        $scope.id = '';
        $scope.db = db;

        $scope.ok = function (id) {
            api.request(controllerName, 'create', { id: id, databaseLink: db.link }, function (error, col) {
                if (error) {
                    $alert(JSON.stringify(error, null, 2));
                }
                else {
                    $modalInstance.close(col);
                }
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('CollectionDeleteCtrl', function ($scope, $alert, $modalInstance, api, db, col) {
        $scope.id = '';
        $scope.db = db;
        $scope.col = col;

        $scope.ok = function (id) {
            if (id === col.id) {
                api.request(controllerName, 'remove', { id: id, databaseLink: db.link }, function (error) {
                    if (error) {
                        $alert(JSON.stringify(error, null, 2));
                    }
                    else {
                        $modalInstance.close();
                    }
                });
            }
            else {
                $alert('The name of the collection you typed was incorrect.');
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
})();