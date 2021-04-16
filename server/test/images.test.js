const Image = require('../src/db/models/user');
const app = require('../src/app');
const fs = require('fs');
const { createDummyUser } = require('./test_utils');

const chai = require('chai');

const chaiHttp = require('chai-http');
chai.should();

chai.use(chaiHttp);

describe('Images', () => {
    beforeEach(done => {
        Image.deleteMany({}, () => {
            done();
        });
    });
    describe('POST image/', () => {
        it('Should upload test image', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post('/images/upload')
                        .field('ownerUsername', 'testuser')
                        .field('imageName', 'test-file')
                        .attach('imageData', `${__dirname}/test-file.png`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('success').eql(true);
                            fs.unlink(
                                res.body.result.imageData,
                                function (err) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log(
                                            'Successfully deleted the file.'
                                        );
                                    }
                                }
                            );
                            done();
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    describe('GET image/', () => {
        it('Should not get image', done => {
            chai.request(app)
                .get('/images/testuser')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('Should get no images', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .get('/images/testuser')
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
        it('Should get test image', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post('/images/upload')
                        .field('ownerUsername', 'testuser')
                        .field('imageName', 'test-file')
                        .attach('imageData', `${__dirname}/test-file.png`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('success').eql(true);
                            fs.unlink(
                                res.body.result.imageData,
                                function (err) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log(
                                            'Successfully deleted the file.'
                                        );
                                    }
                                }
                            );
                            chai.request(app)
                                .get('/images/testuser')
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have
                                        .property('success')
                                        .eql(true);
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
    describe('DELETE image/', () => {
        it('Should delete uploaded test image', done => {
            createDummyUser()
                .then(() => {
                    chai.request(app)
                        .post('/images/upload')
                        .field('ownerUsername', 'testuser')
                        .field('imageName', 'test-file')
                        .attach('imageData', `${__dirname}/test-file.png`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('success').eql(true);
                            fs.unlink(
                                res.body.result.imageData,
                                function (err) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log(
                                            'Successfully deleted the file.'
                                        );
                                    }
                                }
                            );
                            chai.request(app)
                                .delete(`/images/${res.body.result._id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have
                                        .property('success')
                                        .eql(true);
                                    done();
                                });
                        });
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    it('Should not delete unuploaded test image', done => {
        chai.request(app)
            .delete(`/images/123123`)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
});
