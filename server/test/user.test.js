const User = require('../src/db/models/user');
const Service = require('../src/db/models/service');
const app = require('../src/app');
const {
    createDummyUser,
    createDummyUserWithServices,
} = require('./test_utils');

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

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
                    const user = res.body.result;
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
            .then(response => {
                const service = response.body.result;
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
                    res = res.body;
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
                    res = res.body;
                    res.should.have.property('result');
                    res.should.have.property('success').eql(true);
                    createDummyUser()
                        .then(response => {
                            response.should.have.status(422);
                            response.body.errors[0].should.have
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
        it('should fail to create without password', done => {
            createDummyUser({ firstName: 'John', lastname: 'Doe' })
                .then(res => {
                    res.should.have.status(500);

                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should fail to create without firstname', done => {
            createDummyUser({ password: 'John', lastname: 'Doe' })
                .then(res => {
                    res.should.have.status(500);
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should fail to create without lastname', done => {
            createDummyUser({ firstName: 'John', password: 'Doe' })
                .then(res => {
                    res.should.have.status(500);
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should fail to create without username', done => {
            chai.request(app)
                .post('/user/')
                .send({
                    //default options
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    password: 'test123!@#',
                })
                .then(res => {
                    //path doesnt exist
                    res.should.have.status(404);
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should fail to create with only username', done => {
            createDummyUser({})
                .then(res => {
                    res.should.have.status(500);
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should fail to create without anything', done => {
            chai.request(app)
                .post('/user/')
                .send({})
                .then(res => {
                    //path doesnt exist
                    res.should.have.status(404);
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should encrpyt password', done => {
            const testPassword = '123';
            createDummyUser({
                firstName: 'John',
                lastName: 'Doe',
                password: testPassword,
            })
                .then(res => {
                    res.should.have.status(200);
                    res.body.result.should.have
                        .property('password')
                        .not.eql(testPassword);
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not login with non-existent user', done => {
            chai.request(app)
                .post('/user/nonexistent/login')
                .send({ password: 'testPassword' })
                .then(res => {
                    res.should.have.status(404);
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not login with wrong password for  user', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post('/user/testuser/login')
                        .send({ password: 'testPassword' })
                        .then(res => {
                            res.should.have.status(400);
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
        it('should login with corecct password for  user', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post('/user/testuser/login')
                        .send({ password: 'test123!@#' })
                        .then(res => {
                            res.should.have.status(200);
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
    describe('PUT user/', () => {
        it('should not update non-existent user', done => {
            chai.request(app)
                .put('/user/testuser')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    password: '123',
                })
                .then(res => {
                    res.should.have.status(200);
                    done();
                })
                .catch(error => {
                    throw error;
                });
        });
        it('should update username', done => {
            createDummyUser()
                .then(res => {
                    const newUsername = 'newuser';
                    res = res.body;
                    res.should.have.property('result');
                    res.should.have.property('success').eql(true);
                    chai.request(app)
                        .put('/user/testuser')
                        .send({
                            username: newUsername,
                        })
                        .then(res => {
                            res.should.have.status(200);
                            chai.request(app)
                                .get(`/user/${newUsername}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.result.should.have
                                        .property('username')
                                        .eql(newUsername);
                                    done();
                                });
                        })
                        .catch(error => {
                            throw error;
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should update firstname', done => {
            createDummyUser()
                .then(res => {
                    const newProperty = 'newprop';
                    res = res.body;
                    res.should.have.property('result');
                    res.should.have.property('success').eql(true);
                    chai.request(app)
                        .put('/user/testuser')
                        .send({
                            firstName: newProperty,
                        })
                        .then(res => {
                            res.should.have.status(200);
                            chai.request(app)
                                .get(`/user/testuser`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.result.should.have
                                        .property('firstName')
                                        .eql(newProperty);
                                    done();
                                });
                        })
                        .catch(error => {
                            throw error;
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should update lastname', done => {
            createDummyUser()
                .then(res => {
                    const newProperty = 'newprop';
                    res = res.body;
                    res.should.have.property('result');
                    res.should.have.property('success').eql(true);
                    chai.request(app)
                        .put('/user/testuser')
                        .send({
                            lastName: newProperty,
                        })
                        .then(res => {
                            res.should.have.status(200);
                            res.should.have.status(200);
                            chai.request(app)
                                .get(`/user/testuser`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.result.should.have
                                        .property('lastName')
                                        .eql(newProperty);
                                    done();
                                });
                        })
                        .catch(error => {
                            throw error;
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should update password', done => {
            createDummyUser()
                .then(res => {
                    const newProperty = 'newprop';
                    res = res.body;
                    const oldPassword = res.result.password;
                    res.should.have.property('result');
                    res.should.have.property('success').eql(true);
                    chai.request(app)
                        .put('/user/testuser')
                        .send({
                            password: newProperty,
                        })
                        .then(res => {
                            res.should.have.status(200);
                            res.should.have.status(200);
                            chai.request(app)
                                .get(`/user/testuser`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.result.should.have
                                        .property('password')
                                        .not.eql(oldPassword);
                                    done();
                                });
                        })
                        .catch(error => {
                            throw error;
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    describe('DELETE user/', () => {
        it('should not DELETE non-existent user', done => {
            chai.request(app)
                .delete('/user/fakeuser')
                .send({
                    password: 'test123!@#',
                })
                .end((err, res) => {
                    //path doesnt exist
                    res.should.have.status(404);
                    done();
                });
        });
        it('should not DELETE user without password', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .delete('/user/testuser')
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not DELETE user without correct password', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .delete('/user/testuser')
                        .send({
                            password: 'notrealpassword',
                        })
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should DELETE user with correct password', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .delete('/user/testuser')
                        .send({
                            password: 'test123!@#',
                        })
                        .then(res => {
                            res.should.have.status(200);
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
