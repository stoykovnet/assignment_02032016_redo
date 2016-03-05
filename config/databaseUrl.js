'use strict';

module.exports = function databaseUrl() {

    switch (process.env.NODE_ENV) {

        case 'development':
        default:
            return 'mongodb://localhost/UMS-development';
            break;

        case 'test':
            return 'mongodb://localhost/UMS-test';
            break;

        case 'production':
            return 'mongodb://localhost/UMS-production';
            break;
    }

};