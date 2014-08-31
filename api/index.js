(function () {
    'use strict';

    var DocumentDBClient = require('documentdb').DocumentClient;

    exports.initialize = function (app, logger) {
        var database = require('./database.js')(logger);

        app.use(function (req, res) {
            var host = req.headers['x-docdb-host'];
            var key = req.headers['x-docdb-key'];
            if (host && key) {
                var segments = req.path.split('/').filter(function (segment) {
                    return segment.length > 0;
                });
                // api request format: api/[controller name]/[action name]
                if (segments.length >= 3) {
                    var controllerName = segments[1];
                    var actionName = segments[2];
                    var controller = require('./' + controllerName + '.js')(logger);
                    if (controller) {
                        if (controller[actionName]) {
                            var client = new DocumentDBClient(host, { masterKey: key });
                            var params = req.body || {};
                            controller[actionName](client, params, function (error, result) {
                                if (error) {
                                    logger.error(error);
                                    res.send(500, error);
                                }
                                else {
                                    result = result || {};
                                    logger.debug(result);
                                    res.json(result);
                                }
                            });
                        }
                        else {
                            res.send(500, 'Cannot find action [' + actionName + '] in controller [' + controllerName + '] from request path [' + req.path + ']');
                        }
                    }
                    else {
                        res.send(500, 'Cannot find controller [' + controllerName + '] from request path [' + req.path + ']');
                    }
                }
                else {
                    res.send(500, 'Invalid api request [' + req.path + ']');
                }
            }
            else {
                res.send(401, 'Miss host or key.');
            }
        });
    };
})();
