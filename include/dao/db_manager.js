/*
    Copyright (C) 2014  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//requirements
var mongo       = require('mongodb').MongoClient;
global.ObjectID = require('mongodb').ObjectID;

/**
 * Wrapper that protects against direct access to the active connection pools
 * and DB references.
 *
 * @module Database
 * @class DBManager
 * @constructor
 */
function DBManager(){}

/**
 * Keeps track of all active DBs with active connection pools.
 *
 * @param dbs
 * @type {Object}
 */
var dbs  = {};

/**
 * Retrieves a handle to the specified database.
 *
 * @method getDB
 * @param {String} name The database name
 * @return {Object}     A promise object
 */
DBManager.prototype.getDB = function(name, cb) {
    var self = this;

    if (pb.utils.isFunction(name)) {
        cb = name;
        name = null;
    }
    if(!name){
        name = pb.config.db.name;
    }

    //when we already have a connection just pass back the handle
    if (this.hasConnected(name)) {
        return cb(null, dbs[name]);
    }

    
    var dbURL   = DBManager.buildConnectionStr(pb.config);
    var options = {
        w: pb.config.db.writeConcern
    };

    pb.log.debug("Attempting connection to: %s", dbURL);
    mongo.connect(dbURL, options, function(err, db){
        if (err) {
            return cb(err);
        }

        self.authenticate(pb.config.db.authentication, db, function(err, didAuthenticate) {
            if (util.isError(err)) {
                return cb(err);
            }
            else if (didAuthenticate !== true && didAuthenticate !== null) {
                return cb(new Error("Failed to authenticate to db "+name+": "+util.inspect(didAuthenticate)));
            }

            //save reference to connection in global connection pool
            dbs[db.databaseName]  = db;

            //keep directly accessible reference for instance of DBManager
            self[db.databaseName] = db;

            //Indicate the promise was kept.
            cb(null, db);
        });
    });
};

DBManager.prototype.authenticate = function(auth, db, cb) {
    if (!pb.utils.isObject(auth) || !pb.utils.isString(auth.un) || !pb.utils.isString(auth.pw)) {
        pb.log.debug('DBManager: An empty auth object was passed for DB [%s]. Skipping authentication.', db.databaseName);
        return cb(null, null);
    }

    db.authenticate(auth.un, auth.pw, auth.options ? auth.options : {}, cb);
};

DBManager.buildConnectionStr = function(config) {
    var str = 'mongodb://';
    for (var i = 0; i < config.db.servers.length; i++) {
        
        //check for prefix for backward compatibility
        var hostAndPort = config.db.servers[i];
        if (hostAndPort.indexOf('mongodb://') === 0) {
            hostAndPort = hostAndPort.substring('mongodb://'.length);
        }
        if (i > 0) {
            str += ',';
        }
        str += hostAndPort;
    };
    return pb.UrlService.urlJoin(str, config.db.name);
};

/**
 * Indicates if a connection pool to the specified database has already been
 * initialized
 *
 * @method hasConnected
 * @param {String} name
 * @return {Boolean} Whether the pool has been connected
 */
DBManager.prototype.hasConnected = function(name){
    return dbs.hasOwnProperty(name);
};

/**
 * Takes an Array of indexing procedures and delegates them out to paralleled
 * tasks.
 * @method processIndices
 * @param {Array} procedures An array of objects that describe the index to 
 * place upon a collection.  The object contains three properties.  
 * "collection" a string that represents the name of the collection to build an 
 * index for.  "specs" is an object that describes which fields to index.  The 
 * keys are the field names and the value is -1 for descending order and 1 for 
 * ascending.  "options" is an object that that provides specific index 
 * properties such as unique or sparse.  See 
 * http://mongodb.github.io/node-mongodb-native/api-generated/collection.html#ensureindex 
 * for specific MongoDB implementation details for specs and options.
 * @param {Function} cb A callback that provides two parameters: The first, an 
 * Error, if occurred.  Secondly, an object that contains two properties. 
 * "result" an array of the results where each object in the array represents 
 * the result of the request to ensure the index.  "errors" an array of errors 
 * that occurred while indexing.  The function does not terminate after the 
 * first error.  Instead it allows all indices to attempt to be created and 
 * defer the reporting of an error until the end.
 */
DBManager.prototype.processIndices = function(procedures, cb) {
    if (!util.isArray(procedures)) {
        cb(new Error('The procedures parameter must be an array of Objects'));
        return;
    }

    //to prevent a cirular dependency we do the require for DAO here.
    var DAO = require('./dao.js');

    //create the task list for executing indices.
    var errors = [];
    var tasks = pb.utils.getTasks(procedures, function(procedures, i) {
        return function(callback) {

            var dao = new DAO();
            dao.ensureIndex(procedures[i], function(err, result) {
                if (util.isError(err)) {
                    errors.push(err);
                    pb.log.error('DBManager: Failed to create INDEX=[%s] RESULT=[%s] ERROR[%s]', JSON.stringify(procedures[i]), util.inspect(result), err.stack);
                }
                else if (pb.log.isDebug()) {
                    pb.log.silly('DBManager: Attempted to create INDEX=[%s] RESULT=[%s]', JSON.stringify(procedures[i]), util.inspect(result));
                }
                callback(null, result);
            });
        };
    });
    async.parallel(tasks, function(err, results){
        var result = {
            errors: errors,
            results: results
        };
        cb(err, result);
    });
};

/**
 * Iterates over all database handles and call's their shutdown function.
 *
 * @method shutdown
 * @param {Function} cb Callback function
 * @return {Array}      Array of promise objects, one for each shutdown call
 */
DBManager.shutdown = function(cb){
    cb = cb || pb.utils.cb;

    var tasks = pb.utils.getTasks(Object.keys(dbs), function(keys, i) {
        return function(callback) {
            var d = domain.create();
            d.run(function() {
                dbs[keys[i]].close(true, function(err, result) {
                    if (util.isError(err)) {
                        throw err;
                    }
                    callback(null, result);
                });
            });
            d.on('error', function(err) {
                pb.log.error('DBManager: An error occurred while closing a DB connection. %s', err.stack);
                callback(null, false);
            });
        };
    });
    async.parallel(tasks, cb);
};

//register for shutdown
pb.system.registerShutdownHook('DBManager', DBManager.shutdown);

//exports
module.exports.DBManager = DBManager;
