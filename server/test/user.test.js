const mongoose = require('mongoose');
const User = require('../src/db/models/user');
const app = require('../src/app');

const chai = require('chai');
const chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach(done => {
        User.deleteMany({}, () => {
            done();
        });
    });
    describe('GET user/', () => {
        it('should not GET non-existent user', done => {
            chai.request(app)
                .get('/user/unknownuser')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
