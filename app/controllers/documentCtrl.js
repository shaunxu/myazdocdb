(function () {
    'use strict';

    var controllerName = 'document';

    app.controller('DocumentIndexCtrl', function ($scope, $stateParams, $alert, $modal, api) {
        var refresh = function () {
            api.request(controllerName, 'list', { collectionLink: $scope.col.collectionLink }, function (error, docs) {
                if (error) {
                    $alert(JSON.stringify(error, null, 2));
                }
                else {
                    docs.forEach(function (doc) {
                        var model = {
                            expanded: false,
                            id: doc.id,
                            _self: doc._self,
                            _ts: doc._ts,
                            _etag: doc._etag
                        };
                        delete doc.id;
                        delete doc._self;
                        delete doc._ts;
                        delete doc._etag;
                        model.body = doc;
                        $scope.documents.push(model);
                    });
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

        $scope.col = {
            databaseId: $stateParams.did,
            collectionId: $stateParams.cid,
            collectionLink: $stateParams.cl
        };

        refresh();
    });

    app.controller('DocumentCreateCtrl', function ($scope, $alert, $modalInstance, api, db) {
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

    app.controller('DocumentDeleteCtrl', function ($scope, $alert, $modalInstance, api, db, col) {
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