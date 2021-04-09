const express = require('express');
const Service = require('../db/models/service.js');
const User = require('../db/models/user.js');
const Appointment = require('../db/models/appointment.js');
const Image = require('../db/models/image.js');

const router = express.Router();

const testUser1 = {
    username: 'testuser1',
    firstName: 'Test',
    lastName: 'User1',
    password: 'testuser1',
    bio: 'I am a test user',
};

const testUser2 = {
    username: 'testuser2',
    firstName: 'Test',
    lastName: 'User2',
    password: 'testuser2',
    bio: 'I am a test user',
};

const testService1 = {
    username: 'testuser',
    name: 'testservice1',
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
    tags: ['Gaming', 'Sports'],
    ratings: [{ testuser2: 5 }],
    location: { lat: 49.870929, lng: -97.162911, address: '915 Grosvenor Ave' },
};

const testService2 = {
    username: 'testuser',
    name: 'testservice2',
    description: '123',
    cost: '123',
    duration: '0100',
    availability: [
        { weekday: 3, start_time: '0800', end_time: '1800' },
        { weekday: 4, start_time: '0800', end_time: '1800' },
        { weekday: 5, start_time: '0800', end_time: '1800' },
        { weekday: 6, start_time: '0800', end_time: '1800' },
    ],
    tags: ['Gaming', 'Construction'],
    ratings: [{ testuser2: 5 }],
    location: {
        lat: 49.8866486,
        lng: -97.1992166,
        address: 'Polo Park Winnipeg',
    },
};

const testService3 = {
    username: 'testuser',
    name: 'testservice3',
    description: '123',
    cost: '123',
    duration: '0100',
    availability: [
        { weekday: 0, start_time: '0800', end_time: '1800' },
        { weekday: 1, start_time: '0800', end_time: '1800' },
        { weekday: 2, start_time: '0800', end_time: '1800' },
    ],
    tags: ['Finance', 'Seasonal'],
    ratings: [{ testuser2: 5 }],
    location: {
        lat: 49.810407,
        lng: -97.14376399999999,
        address: 'University Crescent Winnipeg',
    },
};

router.get('/fill', (req, res) => {
    const newUser1 = new User(testUser1);
    const newUser2 = new User(testUser2);
    const testS1 = new Service(testService1);
    const testS2 = new Service(testService2);
    const testS3 = new Service(testService3);

    newUser1
        .save()
        .then(u1res => {
            newUser2
                .save()
                .then(u2res => {
                    testS1
                        .save()
                        .then(s1res => {
                            testS2
                                .save()
                                .then(s2res => {
                                    testS3
                                        .save()
                                        .then(s3res => {
                                            res.status(200).json({
                                                success: true,
                                                result: {
                                                    testuser1: u1res,
                                                    testuser2: u2res,
                                                    service1: s1res,
                                                    service2: s2res,
                                                    service3: s3res,
                                                },
                                            });
                                        })
                                        .catch(err => {
                                            res.status(500).json({
                                                errors: [{ error: err }],
                                            });
                                        });
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        errors: [{ error: err }],
                                    });
                                });
                        })
                        .catch(err => {
                            res.status(500).json({ errors: [{ error: err }] });
                        });
                })
                .catch(err => {
                    res.status(500).json({ errors: [{ error: err }] });
                });
        })
        .catch(err => {
            res.status(500).json({ errors: [{ error: err }] });
        });
});

router.get('/empty', (req, res) => {
    User.deleteMany({}, () => {
        Service.deleteMany({}, () => {
            Appointment.deleteMany({}, () => {
                Image.deleteMany({}, () => {
                    res.status(200).json({ success: true });
                });
            });
        });
    });
});
