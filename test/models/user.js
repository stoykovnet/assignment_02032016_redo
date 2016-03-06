'use strict';

// Test imports.
var expect = require('chai');
require('../utils').utils();
var testUserData = require('../testUserData');

// Database imports.
var mongoose = require('mongoose');
var User = mongoose.model('User');

describe('User Model', function () {

    describe('#save', function () {

        it('should NOT allow users without required properties', function (done) {
            var user = new User();

            User.save(function (err) {
                expect(err).to.not.be.null;
                done();
            });
        });

        it('should NOT allow users with the same email address', function (done) {
            var userA = new User(testUserData);
            var userB = new User(testUserData);

            userA.save(userB.save(function (err) {
                expect(err).to.not.be.null;
                done();
            }));
        });

        it('should NOT store password in plain text', function (done) {
            var user = new User(testUserData);

            user.password = 'password';

            user.save(function (err) {
                expect(err).to.not.be.null;
                done();
            });
        });

    });

    describe('#setPassword', function () {
        it('should hash and salt the password before save', function (done) {
            var user = new User(testUserData);

            var password = 'password';
            user.setPassword(password);

            expect(user.hash).to.not.be.null;
            expect(user.salt).to.not.be.null;

            expect(user.hash).to.not.be.empty;
            expect(user.salt).to.not.be.empty;

            expect(user.hash).to.not.equal(password);
            expect(user.salt).to.not.equal(password);

            done();
        });
    });

    describe('#validatePassword', function () {
        it('should accept correct password', function (done) {
            var user = new User(testUserData);
            var password = 'password';

            user.setPassword(password);

            user.save(function (err, saved) {
                var isValid = saved.validatePassword(password);

                expect(isValid).to.be.true;
                done();
            });
        });

        it('should NOT accept wrong password', function (done) {
            var user = new User(testUserData);
            var password = 'password';

            user.setPassword(password);

            user.save(function (err, saved) {
                var isValid = saved.validatePassword(password);

                expect(isValid).to.be.false;
                done();
            });
        });
    });

    describe('#generateToken', function () {
        it('should be able to create a token', function (done) {
            var user = User(testUserData);

            user.setPassword('password');

            user.save(function (err, saved) {
                var token = saved.generateToken();

                expect(token).to.not.be.null;
                expect(token).to.not.be.empty;
                expect(token).to.be.a('string');
            });

            done();
        });
    });
});