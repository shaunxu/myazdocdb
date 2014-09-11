(function () {
    'use strict';

    var DocumentDBClient = require('documentdb').DocumentClient;

    exports.initialize = function (app, logger) {
        var _validate = function (controller, params, callback) {
            var validator = controller['validate'];
            if (validator) {
                validator(params, function (error) {
                    return callback(error);
                });
            }
            else {
                return callback(null);
            }
        };

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
                            var params = req.body || {};
                            // perform validate if defined inside controller
                            _validate(controller, params, function (error) {
                                if (error) {
                                    res.status(500).send(error);
                                }
                                else {
                                    // perform the action
                                    var client = new DocumentDBClient(host, { masterKey: key });
                                    controller[actionName](client, params, function (error, result) {
                                        if (error) {
                                            var message = controllerName + '/' + actionName + ' ...\n' + 'params: ' + JSON.stringify(params, null, 2) + '\n' + 'error: ' + JSON.stringify(error, null, 2);
                                            logger.error(message);
                                            res.status(500).send(message);
                                        }
                                        else {
                                            result = result || {};
                                            logger.debug(controllerName + '/' + actionName + ' ...\n' + 'params: ' + JSON.stringify(params, null, 2) + '\n' + 'result: ' + JSON.stringify(result, null, 2));
                                            res.json(result);
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            res.status(500).send('Cannot find action [' + actionName + '] in controller [' + controllerName + '] from request path [' + req.path + ']');
                        }
                    }
                    else {
                        res.status(500).send('Cannot find controller [' + controllerName + '] from request path [' + req.path + ']');
                    }
                }
                else {
                    res.status(500).send('Invalid api request [' + req.path + ']');
                }
            }
            else {
                res.status(500).send('Miss host or key.');
            }
        });
    };
})();
