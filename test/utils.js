'use strict';

// Database imports.
var mongoose = require('mongoose');
var databaseUrl = require('../config/databaseUrl');


module.exports.utils = function utils() {

    /**
     * Connect to the database before each test, if the connection is not already
     * established. In both scenarios, it invokes the database cleaning method
     * to ensure that the database is in a clean state before each test.
     * @param done
     * @throws err if there is a problem with connecting.
     */
    beforeEach(function connectToDatabase(done) {

        //console.log('Trying to connect to: ' + databaseUrl());

        if (mongoose.connection.readyState === 0) {
            mongoose.connect(databaseUrl(), function (err) {
                if (err) {
                    throw err;
                }

                _cleanDatabase(done)
            });
        } else {
            _cleanDatabase(done);
        }
    });

    /**
     * Close database connection after every test.
     * @param done
     */
    afterEach(function disconnectFromDatabase(done) {

        mongoose.disconnect();
        done();
    });

    /**
     * Clean the whole database. All collections are removed.
     * @param done
     */
    function _cleanDatabase(done) {

        var collections = mongoose.connection.collections;
        for (var i = 0; i < collections.length; i++) {
            collections[i].remove();
        }

        done();
    }

};