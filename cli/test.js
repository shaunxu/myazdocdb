(function () {
    'use strict';

    var DocumentDBClient = require('documentdb').DocumentClient;
    var host = 'https://shx.documents.azure.com:443/';
    var key = 'uQ/c0mhNedWn28DghOLrqlmkcGT8juUoOuIGGViEwJe0/oQX9xLk+zLHlKRd85KTJOFn+1/ZwfXhF+eLPE9kiw==';

    var client = new DocumentDBClient(host, { masterKey: key });
    console.log(client);

//    client.queryDatabases('SELECT * FROM ROOT').toArray(function (error, results) {
//        if (error) {
//            console.log(JSON.stringify(error, null ,2));
//        }
//        else {
//            console.log(JSON.stringify(results, null ,2));
//
//            if (results.length <= 0 ) {
//                client.createDatabase({ id: 'testdb' }, function (error, database) {
//                    if (error) {
//                        console.log(JSON.stringify(error, null, 2));
//                    }
//                    else {
//                        console.log(JSON.stringify(database, null, 2));
//                    }
//                });
//            }
//        }
//    });
})();