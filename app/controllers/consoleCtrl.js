(function () {
    'use strict';

    app.controller('ConsoleCtrl', function ($rootScope, $scope, $alert, api) {
        $scope.options = {
            databases: {
                operation: 'queryDatabases',
                text: 'Databases',
                links: []
            },
            collections: {
                operation: 'queryCollections',
                text: 'Collections',
                links: []
            },
            documents: {
                operation: 'queryDocuments',
                text: 'Documents',
                links: []
            }
        };

        $scope.query = {
            operation: '',
            link: ''
        };

        $rootScope.breadcrumb.items = [
            {
                text: 'Console'
            }
        ];

        // retrieve all databases and collections' self link
        // and push them into $scope.options for selection
        api.request('database', 'list', null, function (error, dbs) {
            if (error) {
                $alert(error);
            }
            else {
                dbs.forEach(function (db) {
                    $scope.options.collections.links.push({
                        id: db.id,
                        self: db._self,
                        text: db.id
                    });
                    api.request('collection', 'list', { databaseLink: db._self }, function (error, cols) {
                        if (error) {
                            $alert(error);
                        }
                        else {
                            cols.forEach(function (col) {

                            });
                        }
                    });
                });
            }
        });
    });
})();