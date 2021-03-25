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
    duration: '0100',
    availability: [
        { weekday: 0, start_time: '0800', end_time: '1800' },
        { weekday: 1, start_time: '0800', end_time: '1800' },
        { weekday: 2, start_time: '0800', end_time: '1800' },
        { weekday: 3, start_time: '0800', end_time: '1800' },
        { weekday: 4, start_time: '0800', end_time: '1800' },
        { weekday: 5, start_time: '0800', end_time: '1800' },
        { weekday: 6, start_time: '0800', end_time: '1800' },
    ],
    location: { lat: 42, lng: 43, address: '123' },
};
const defaultServiceOptions2 = {
    username: 'testuser2',
    name: 'testservice',
    description: '123',
    cost: '123',
    duration: '0100',
    availability: [
        { weekday: 0, start_time: '0800', end_time: '1800' },
        { weekday: 1, start_time: '0800', end_time: '1800' },
        { weekday: 2, start_time: '0800', end_time: '1800' },
        { weekday: 3, start_time: '0800', end_time: '1800' },
        { weekday: 4, start_time: '0800', end_time: '1800' },
        { weekday: 5, start_time: '0800', end_time: '1800' },
        { weekday: 6, start_time: '0800', end_time: '1800' },
    ],
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

const getTestingDate = h => {
    let date = new Date(2026, 1, 1, 11, 30, 0, 0);
    date.setTime(date.getTime() + h * 60 * 60 * 1000);
    return date;
};

const createDummyUsersWithServicesAndAppointments = (
    usernameOne = 'testuser',
    usernameTwo = 'testuser2',
    options = defaultUserOptions,
    serviceOptions = defaultServiceOptions,
    serviceOptions2 = defaultServiceOptions2,
    booked_time1 = getTestingDate(1),
    booked_time2 = getTestingDate(2)
) => {
    return new Promise((resolve, reject) => {
        createDummyUserWithServices(usernameOne, options, serviceOptions)
            .then(serviceOne => {
                //at this point we have one user with one service. lets make another with another service
                createDummyUserWithServices(
                    usernameTwo,
                    options,
                    serviceOptions2
                )
                    .then(serviceTwo => {
                        //now we make appointsments
                        chai.request(app)
                            .post(`/appointment/${usernameOne}`)
                            .send({
                                service_id: serviceOne.body.result._id,
                                booked_time: booked_time1,
                            })
                            .then(appointmentOne => {
                                //now we create a service for this user
                                chai.request(app)
                                    .post(`/appointment/${usernameTwo}`)
                                    .send({
                                        service_id: serviceTwo.body.result._id,
                                        booked_time: booked_time2,
                                    })
                                    .then(appointmentTwo => {
                                        resolve({
                                            appointmentOne:
                                                appointmentOne.body.result,
                                            appointmentTwo:
                                                appointmentTwo.body.result,
                                        });
                                    })
                                    .catch(error => {
                                        reject(error);
                                    });
                            })
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = {
    createDummyUser,
    createDummyUserWithServices,
    createDummyUsersWithServicesAndAppointments,
    defaultServiceOptions,
    getTestingDate,
};
