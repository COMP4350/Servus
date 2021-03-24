const User = require('../src/db/models/user');
const Service = require('../src/db/models/service');
const Appointment = require('../src/db/models/appointment');

const app = require('../src/app');
const {
    createDummyUser,
    createDummyUserWithServices,
    createDummyUsersWithServicesAndAppointments,
    getTestingDate,
    defaultUserOptions,
} = require('./test_utils');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

describe('Appointment', () => {
    beforeEach(done => {
        User.deleteMany({}, () => {
            Service.deleteMany({}, () => {
                Appointment.deleteMany({}, () => {
                    done();
                });
            });
        });
    });
    describe('GET appointment/', () => {
        it('should not GET non-existent users appointments', done => {
            chai.request(app)
                .get('/appointment/unknownuser')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('should GET users empty appointments', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .get('/appointment/testuser')
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
        it('should GET users appointments', done => {
            createDummyUsersWithServicesAndAppointments()
                .then(() => {
                    chai.request(app)
                        .get('/appointment/testuser')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('result').not.eql([]);
                            chai.request(app)
                                .get('/appointment/testuser2')
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have
                                        .property('result')
                                        .not.eql([]);
                                    done();
                                });
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    describe('POST appointment/', () => {
        it('should not create appointment without existing buyer', done => {
            chai.request(app)
                .post('/appointment/unknownuser')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should not create appointment without existing service', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post('/appointment/unknownuser')
                        .send({ booked_time: getTestingDate(2) })
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
        it('can not create an appointment with conflicting time', done => {
            const time = getTestingDate(2);
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .post(`/appointment/testuser`)
                        .send({
                            service_id: service.body.result._id,
                            booked_time: time,
                        })
                        .then(() => {
                            chai.request(app)
                                .post(`/appointment/testuser`)
                                .send({
                                    service_id: service.body.result._id,
                                    booked_time: time,
                                })
                                .then(res => {
                                    res.should.have.status(500);
                                    res.body.should.have.property('errors');
                                    done();
                                })
                                .catch(error => {
                                    throw error;
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
        it('can not create an appointment out of the availability', done => {
            const time = getTestingDate(2);
            createDummyUserWithServices('testuser', defaultUserOptions, {
                username: 'testuser',
                name: 'testservice',
                description: '123',
                cost: '123',
                duration: '0000',
                availability: [], //NO AVAILABILITY
                location: { lat: 42, lng: 43, address: '123' },
            })
                .then(service => {
                    chai.request(app)
                        .post(`/appointment/testuser`)
                        .send({
                            service_id: service.body.result._id,
                            booked_time: time,
                        })
                        .then(() => {
                            chai.request(app)
                                .post(`/appointment/testuser`)
                                .send({
                                    service_id: service.body.result._id,
                                    booked_time: time,
                                })
                                .then(res => {
                                    res.should.have.status(500);
                                    res.body.should.have.property('errors');
                                    done();
                                })
                                .catch(error => {
                                    throw error;
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
        it('should create appointment', done => {
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .post(`/appointment/testuser`)
                        .send({
                            service_id: service.body.result._id,
                            booked_time: getTestingDate(2),
                        })
                        .then(res => {
                            res.should.have.status(200);
                            res.body.should.have.property('result');
                            done();
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
    describe('DELETE appointment/', () => {
        it('should not delete non-existent appointment', done => {
            chai.request(app)
                .delete('/appointment/123123')
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
        it('should delete appointment', done => {
            createDummyUserWithServices()
                .then(service => {
                    chai.request(app)
                        .post(`/appointment/testuser`)
                        .send({
                            service_id: service.body.result._id,
                            booked_time: getTestingDate(2),
                        })
                        .then(appointment => {
                            chai.request(app)
                                .delete(
                                    `/appointment/${appointment.body.result._id}`
                                )
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have
                                        .property('success')
                                        .eql(true);
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
});
