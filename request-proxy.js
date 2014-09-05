(function () {
    'use strict';

    var http = require('http');
    var https = require('https');
    var __httpRequest = http.request;
    var __httpsRequest = https.request;

    var proxy = {
        host: '',
        port: 0
    };

    var _logger;

    http.request = function (options, callback) {
        var __options = options;
        __options.path = 'http://' + options.host + options.path;
        __options.host = proxy.host;
        __options.port = proxy.port;
        if (_logger) {
            _logger.debug('=== request-proxy.js [http] begin debug ===');
            _logger.debug(JSON.stringify(__options, null, 2));
            _logger.debug('=== request-proxy.js [http] end debug ===');
        }
        var req = __httpRequest(__options, function (res) {
            callback(res);
        });
        return req;
    };

    https.request = function (options, callback) {
        var __options = options;
        __options.path = 'https://' + options.host + options.path;
        __options.host = proxy.host;
        __options.port = proxy.port;
        if (_logger) {
            _logger.debug('=== request-proxy.js [https] begin debug ===');
            _logger.debug(JSON.stringify(__options, null, 2));
            _logger.debug('=== request-proxy.js [https] end debug ===');
        }
        var req = __httpsRequest(__options, function (res) {
            callback(res);
        });
        return req;
    };

    module.exports = function (host, port, logger) {
        proxy.host = host;
        proxy.port = port;
        _logger = logger;
    };
})();
