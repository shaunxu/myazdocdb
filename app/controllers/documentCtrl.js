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
                templateUrl: 'views/document/delete.html',
                controller: 'DocumentDeleteCtrl',
                resolve: {
                    col: function () {
                        return $scope.col;
                    },
                    doc: function () {
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

        $scope.createOrUpdate = function (doc) {
            var modalInstance = $modal.open({
                templateUrl: 'views/document/create-update.html',
                controller: 'DocumentCreateOrUpdateCtrl',
                resolve: {
                    col: function () {
                        return $scope.col;
                    },
                    doc: function () {
                        return doc;
                    }
                }
            });
            modalInstance.result.then(function () {
                refresh();
            }, function () {});
        };

        $scope.validate = function (body) {

        };

        $scope.col = {
            databaseId: $stateParams.did,
            collectionId: $stateParams.cid,
            collectionLink: $stateParams.cl
        };

        refresh();
    });

    app.controller('DocumentCreateOrUpdateCtrl', function ($scope, $alert, $modalInstance, api, col, doc) {
        $scope.doc = doc || {};
        $scope.col = col;
        $scope.isUpdate = $scope.doc && $scope.doc.id;

        $scope.ok = function (id, body) {
            // set body and id again in case user didn't put anything
            var doc;
            try
            {
                doc = JSON.parse(body);
                doc.id = id;
            }
            catch (ex)
            {
                $alert('Failed to parse document body with error \n' + ex);
                return;
            }
            // invoke api to create or update document
            $alert(JSON.stringify(doc, null, 2));
            $alert(col.collectionLink);
            api.request(controllerName, $scope.isUpdate ? 'update' : 'create', { body: doc, collectionLink: col.collectionLink }, function (error, doc) {
                if (error) {
                    $alert(error);
                    //$alert(JSON.stringify(error, null, 2));
                }
                else {
                    $modalInstance.close(doc);
                }
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('DocumentDeleteCtrl', function ($scope, $alert, $modalInstance, api, col, doc) {
        $scope.id = '';
        $scope.col = col;
        $scope.doc = doc;

        $scope.ok = function (id) {
            if (id === doc.id) {
                api.request(controllerName, 'remove', { id: id, collectionLink: col.link }, function (error) {
                    if (error) {
                        $alert(JSON.stringify(error, null, 2));
                    }
                    else {
                        $modalInstance.close();
                    }
                });
            }
            else {
                $alert('The name of the document you typed was incorrect.');
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
})();