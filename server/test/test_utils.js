const app = require('../src/app');

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const defaultUserOptions = {
    //default options
    firstName: 'FirstName',
    lastName: 'LastName',
    password: 'test123!@#',
};

const defaultServiceOptions = {
    username: 'testuser',
    name: 'testservice',
    description: '123',
    cost: '123',
    duration: '123',
    availability: '123',
    location: { lat: 42, lng: 43, address: '123' },
};

const createDummyUser = (
    options = defaultUserOptions,
    username = 'testuser'
) => {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post(`/user/${username}`)
            .send(options)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const createDummyUserWithServices = (
    username = 'testuser',
    options = defaultUserOptions,
    serviceOptions = defaultServiceOptions
) => {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post(`/user/${username}`)
            .send(options)
            .end(() => {
                //now we create a service for this user
                chai.request(app)
                    .post('/services/')
                    .send(serviceOptions)
                    .then(service => {
                        resolve(service);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
    });
};

module.exports = {
    createDummyUser,
    createDummyUserWithServices,
    defaultServiceOptions,
};
