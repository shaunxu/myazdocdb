(function () {
    'use strict';

    var http = require('http');
    var https = require('https');
    var __httpRequest = http.request;

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
        var req = __httpRequest.apply(http, [__options, function (res) {
            return callback(res);
        }]);
        return req;
    };

    https.request = function (options, callback) {
        var __options = {
            protocol: 'http:',
            host: proxy.host,
            port: proxy.port,
            method: options.method,
            path: options.protocol + '//' + options.host + options.path,
            headers: options.headers
        };
        __options.headers['host'] = options.host;
        if (_logger) {
            _logger.debug('=== request-proxy.js [https] begin debug ===');
            _logger.debug('=== original options');
            _logger.debug(JSON.stringify(options, null, 2));
            _logger.debug('=== actual options');
            _logger.debug(JSON.stringify(__options, null, 2));
            _logger.debug('=== request-proxy.js [https] end debug ===');
        }

        var req = __httpRequest.apply(http, [__options, function (res) {
            return callback(res);
        }]);
        return req;

        //var __options = options;
        //__options.path = 'https://' + options.host + options.path;
        //__options.host = proxy.host;
        //__options.port = proxy.port;
        //if (_logger) {
        //    _logger.debug('=== request-proxy.js [https] begin debug ===');
        //    _logger.debug(JSON.stringify(__options, null, 2));
        //    _logger.debug('=== request-proxy.js [https] end debug ===');
        //}
        //var req = __httpsRequest.apply(https, [__options, function (res) {
        //    callback(res);
        //}]);
        //return req;
    };

    module.exports = function (host, port, logger) {
        proxy.host = host;
        proxy.port = port;
        _logger = logger;
    };
})();
