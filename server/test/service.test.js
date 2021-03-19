const User = require('../src/db/models/user');
const Service = require('../src/db/models/service');
const app = require('../src/app');
const {
    createDummyUser,
    createDummyUserWithServices,
    defaultServiceOptions,
} = require('./test_utils');
const chai = require('chai');

const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Services', () => {
    beforeEach(done => {
        User.deleteMany({}, () => {
            Service.deleteMany({}, () => {
                done();
            });
        });
    });
    describe('GET service/', () => {
        it('should not GET non-existent service list', done => {
            chai.request(app)
                .get('/services/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('result').eql([]);
                    done();
                });
        });
        it('should not GET non-existent service', done => {
            chai.request(app)
                .get('/services/12312313')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('should GET a service list', done => {
            // first we have to create the user
            createDummyUserWithServices()
                .then(() => {
                    chai.request(app)
                        .get('/services')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('result').not.eql([]);
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should GET a specific service', done => {
            // first we have to create the user
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .get(`/services/${service.body.result._id}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have
                                .property('result')
                                .not.eql(null);
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    describe('POST service/', () => {
        it('should not POST service without user', done => {
            chai.request(app)
                .post('/services/')
                .send(defaultServiceOptions)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('should not POST a service without name', done => {
            // first we have to create the user
            let noPropService = JSON.parse(
                JSON.stringify(defaultServiceOptions)
            );
            noPropService['name'] = undefined;
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post(`/services/`)
                        .send(noPropService)
                        .end((err, res) => {
                            res.should.have.status(500);
                            res.body.should.have.property('errors');
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not POST a service without username', done => {
            // first we have to create the user
            let noPropService = JSON.parse(
                JSON.stringify(defaultServiceOptions)
            );
            noPropService['username'] = undefined;
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post(`/services/`)
                        .send(noPropService)
                        .end((err, res) => {
                            res.should.have.status(500);
                            res.body.should.have.property('errors');
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not POST a service without cost', done => {
            // first we have to create the user
            let noPropService = JSON.parse(
                JSON.stringify(defaultServiceOptions)
            );
            noPropService['cost'] = undefined;
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post(`/services/`)
                        .send(noPropService)
                        .end((err, res) => {
                            res.should.have.status(500);
                            res.body.should.have.property('errors');
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not POST a service without location', done => {
            // first we have to create the user
            let noPropService = JSON.parse(
                JSON.stringify(defaultServiceOptions)
            );
            noPropService['location'] = undefined;
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post(`/services/`)
                        .send(noPropService)
                        .end((err, res) => {
                            res.should.have.status(500);
                            res.body.should.have.property('errors');
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should POST a service without availability', done => {
            // first we have to create the user
            let noPropService = JSON.parse(
                JSON.stringify(defaultServiceOptions)
            );
            noPropService['availability'] = undefined;
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post(`/services/`)
                        .send(noPropService)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });

        it('should not POST a service without anything', done => {
            // first we have to create the user
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post(`/services/`)
                        .send({})
                        .end((err, res) => {
                            res.should.have.status(500);
                            res.body.should.have.property('errors');
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should POST a normal service', done => {
            // first we have to create the user
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post(`/services/`)
                        .send(defaultServiceOptions)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('result');
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    describe('PUT service/', () => {
        it('should not update non-existent service', done => {
            chai.request(app)
                .put('/services/123123')
                .send(defaultServiceOptions)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('should not update service username', done => {
            const newProps = { username: 'newuser' };
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .put(`/services/${service.body.result._id}`)
                        .send(newProps)
                        .end((err, res) => {
                            res.should.have.status(500);
                            res.body.should.have.property('errors');
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should update service name', done => {
            const newProps = { name: 'newname' };
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .put(`/services/${service.body.result._id}`)
                        .send(newProps)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('result');
                            chai.request(app)
                                .get(`/services/${service.body.result._id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.result.should.have
                                        .property('name')
                                        .eql(newProps.name);
                                    done();
                                });
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should update service description', done => {
            const newProps = { description: 'description' };
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .put(`/services/${service.body.result._id}`)
                        .send(newProps)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('result');
                            chai.request(app)
                                .get(`/services/${service.body.result._id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.result.should.have
                                        .property('description')
                                        .eql(newProps.description);
                                    done();
                                });
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should update service cost', done => {
            const newProps = { cost: 'cost' };
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .put(`/services/${service.body.result._id}`)
                        .send(newProps)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('result');
                            chai.request(app)
                                .get(`/services/${service.body.result._id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.result.should.have
                                        .property('cost')
                                        .eql(newProps.cost);
                                    done();
                                });
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should update service duration', done => {
            const newProps = { duration: 'duration' };
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .put(`/services/${service.body.result._id}`)
                        .send(newProps)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('result');
                            chai.request(app)
                                .get(`/services/${service.body.result._id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.result.should.have
                                        .property('duration')
                                        .eql(newProps.duration);
                                    done();
                                });
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should update service availability ', done => {
            const newProps = { availability: 'availability' };
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .put(`/services/${service.body.result._id}`)
                        .send(newProps)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('result');
                            chai.request(app)
                                .get(`/services/${service.body.result._id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.result.should.have
                                        .property('availability')
                                        .eql(newProps.availability);
                                    done();
                                });
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should update service location ', done => {
            const newProps = { location: { lat: 4, lng: 5, address: '234' } };
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .put(`/services/${service.body.result._id}`)
                        .send(newProps)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('result');
                            chai.request(app)
                                .get(`/services/${service.body.result._id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.result.should.have
                                        .property('location')
                                        .eql(newProps.location);
                                    done();
                                });
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    describe('DELETE service/', () => {
        it('should not delete non-existent service', done => {
            chai.request(app)
                .delete('/services/123123')
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('should delete service', done => {
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .delete(`/services/${service.body.result._id}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('success').eql(true);
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
    });
});
