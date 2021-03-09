const mongoose = require('mongoose');
const User = require('../src/db/models/user');
const Service = require('../src/db/models/service');
const app = require('../src/app');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

const createDummyUser = () => {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post('/user/testuser')
            .send({
                firstName: 'FirstName',
                lastName: 'LastName',
                password: 'test123!@#',
            })
            .then(response => {
                resolve(response.body);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const createDummyUserWithServices = () => {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post('/user/testuser')
            .send({
                firstName: 'FirstName',
                lastName: 'LastName',
                password: 'test123!@#',
            })
            .then(response => {
                //now we create a service for this user
                chai.request(app)
                    .post('/services/')
                    .send({
                        username: response.body.result.username,
                        name: 'testservice',
                        description: '123',
                        cost: '123',
                        duration: '123',
                        availability: '123',
                        location: { lat: 42, lng: 43, address: '123' },
                    })
                    .then(service => {
                        resolve(service.body);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
            .catch(error => {
                reject(error);
            });
    });
};

describe('Users', () => {
    beforeEach(done => {
        User.deleteMany({}, () => {
            Service.deleteMany({}, () => {
                done();
            });
        });
    });
    describe('GET user/', () => {
        it('should not GET non-existent user', done => {
            chai.request(app)
                .get('/user/unknownuser')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('should GET a created user', done => {
            // first we have to create the user
            createDummyUser()
                .then(res => {
                    const user = res.result;
                    chai.request(app)
                        .get('/user/testuser')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.result.should.have
                                .property('username')
                                .eql(user.username);
                            res.body.result.should.have
                                .property('firstName')
                                .eql(user.firstName);
                            res.body.result.should.have
                                .property('lastName')
                                .eql(user.lastName);
                            res.body.result.should.have
                                .property('password')
                                .eql(user.password);
                            //TODO check cookie?
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    it('should GET a non-existent users empty services', done => {
        // first we have to create the user
        chai.request(app)
            .get('/user/nonexistent/services')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('result').eql([]);
                done();
            });
    });
    it('should GET a users empty services', done => {
        // first we have to create the user
        createDummyUser()
            .then(() => {
                chai.request(app)
                    .get('/user/testuser/services')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('result').eql([]);
                        done();
                    });
            })
            .catch(err => {
                throw err;
            });
    });
    it('should GET a users services', done => {
        // first we have to create the user
        createDummyUserWithServices()
            .then(res => {
                const service = res.result;

                chai.request(app)
                    .get('/user/testuser/services')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('result');
                        res.body.result[0].should.have
                            .property('provider')
                            .eql(service.provider);
                        res.body.result[0].should.have
                            .property('name')
                            .eql(service.name);
                        res.body.result[0].should.have
                            .property('description')
                            .eql(service.description);
                        res.body.result[0].should.have
                            .property('cost')
                            .eql(service.cost);
                        res.body.result[0].should.have
                            .property('duration')
                            .eql(service.duration);
                        res.body.result[0].should.have
                            .property('availability')
                            .eql(service.availability);
                        res.body.result[0].should.have
                            .property('location')
                            .eql(service.location);
                        done();
                    });
            })
            .catch(err => {
                throw err;
            });
    });
    describe('POST user/', () => {
        it('should POST new user', done => {
            createDummyUser()
                .then(res => {
                    res.should.have.property('result');
                    res.should.have.property('success').eql(true);
                    res.result.should.have.property('username');
                    res.result.should.have.property('firstName');
                    res.result.should.have.property('lastName');
                    res.result.should.have.property('password');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should fail to create duplicate user', done => {
            createDummyUser()
                .then(res => {
                    res.should.have.property('result');
                    res.should.have.property('success').eql(true);
                    createDummyUser()
                        .then(response => {
                            response.errors[0].should.have
                                .property('user')
                                .eql('username already exists');
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
