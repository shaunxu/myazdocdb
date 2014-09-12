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

        var _logAndSendErrorOrResult = function (controllerName, actionName, params, error, result, res) {
            var message = {
                controllerName: controllerName,
                actionName: actionName,
                params: params,
            };
            if (error) {
                message.error = error;
                logger.error(message);
                res.status(500).send(message);
            }
            else {
                message.result = result;
                logger.debug(message);
                res.json(message);
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
                                    _logAndSendErrorOrResult(controllerName, actionName, params, error, null, res);
                                }
                                else {
                                    // perform the action
                                    var client = new DocumentDBClient(host, { masterKey: key });
                                    controller[actionName](client, params, function (error, result) {
                                        if (error) {
                                            _logAndSendErrorOrResult(controllerName, actionName, params, error, null, res);
                                        }
                                        else {
                                            result = result || {};
                                            _logAndSendErrorOrResult(controllerName, actionName, params, null, result, res);
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            _logAndSendErrorOrResult(controllerName, actionName, null, 'Cannot find action [' + actionName + '] in controller [' + controllerName + '] from request path [' + req.path + ']', null, res);
                        }
                    }
                    else {
                        _logAndSendErrorOrResult(controllerName, null, null, 'Cannot find controller [' + controllerName + '] from request path [' + req.path + ']', null, res);
                    }
                }
                else {
                    _logAndSendErrorOrResult(null, null, null, 'Invalid api request [' + req.path + ']', null, res);
                }
            }
            else {
                _logAndSendErrorOrResult(null, null, null, 'Miss host or key.', null, res);
            }
        });
    };
})();
