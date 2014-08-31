(function () {
    'use strict';

    var _logger = null;

    var _select = function (client, params, callback) {
        var id = params.id;
        var query = 'SELECT * FROM ROOT' + (id ? ' r WHERE r.id = "' + id + '"' : '');
        client.queryDatabases(query).toArray(function (error, dbs) {
            if (error) {
                return callback(error, null);
            }
            else {
                return callback(null, dbs);
            }
        });
    };

    var _create = function (client, params, callback) {
        var id = params.id;
        if (id && id.length > 0) {
            _select(client, { id: id }, function (error, dbs) {
                if (error) {
                    return callback(error, null);
                }
                else {
                    if (dbs && dbs.length > 0) {
                        return callback('Database with id [' + id + '] exists.', null);
                    }
                    else {
                        client.createDatabase({ id: id }, function (error, db) {
                            if (error) {
                                return callback(error, null);
                            }
                            else {
                                return callback(null, db);
                            }
                        });
                    }
                }
            });
        }
        else {
            callback('Database id was null or empty.', null);
        }
    };

    var _removeDirect = function (client, params, callback) {
        var resourceId = params.resourceId;
        var selfLink = params.selfLink || ('dbs/' + resourceId);
        client.deleteDatabase(selfLink, function (error) {
            if (error) {
                return callback(error);
            }
            else {
                return callback(null);
            }
        });
    };

    var _remove = function (client, params, callback) {
        var id = params.id;
        if (id && id.length > 0) {
            _select(client, { id: id }, function (error, dbs) {
                if (error) {
                    return callback(error);
                }
                else {
                    if (dbs && dbs.length > 0) {
                        if (dbs.length > 1) {
                            return callback('Multiple databases with same id [' + id + '].');
                        }
                        else {
                            _removeDirect(client, { selfLink: dbs[0]['_self'] }, callback);
                        }
                    }
                    else {
                        return callback('Database with id [' + id + '] does not exist.');
                    }
                }
            });
        }
        else {
            callback('Database id was null or empty.');
        }
    };

    module.exports = function (logger) {
        _logger = logger;

        return {
            list: _select,
            create: _create,
            remove: _remove,
            removeDirect: _removeDirect
        };
    };
})();