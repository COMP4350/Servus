const User = require('../src/db/models/user');
const { createDummyUser } = require('./test_utils');
const chai = require('chai');
chai.should();
const { encryptPassword, verifyPassword } = require('../src/utils/authUtils');

describe('Authentication Utils', () => {
    beforeEach(done => {
        User.deleteMany({}, () => {
            done();
        });
    });
    describe('Test Password Encryption', () => {
        it('should not encrpyt non-string', done => {
            encryptPassword(123123).catch(() => {
                done();
            });
        });
        it('should encrpyt string', done => {
            encryptPassword('123123')
                .then(password => {
                    password.should.not.eql('123123');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    describe('Test Password Verification', () => {
        it('should not verify for unknown user', done => {
            verifyPassword('unknown', 'password')
                .then(match => {
                    match.should.eql(false);
                    done();
                })
                .catch(() => {
                    done();
                });
        });
        it('check wrong password for existing user', done => {
            createDummyUser()
                .then(() => {
                    verifyPassword('testuser', 'password')
                        .then(match => {
                            match.should.eql(false);
                            done();
                        })
                        .catch(() => {
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('check correct password for existing user', done => {
            createDummyUser()
                .then(() => {
                    verifyPassword('testuser', 'test123!@#')
                        .then(match => {
                            match.should.eql(true);
                            done();
                        })
                        .catch(err => {
                            throw err;
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
    });
});
