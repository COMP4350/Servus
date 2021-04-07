const express = require('express');
const Service = require('../db/models/service.js');
const User = require('../db/models/user.js');

const router = express.Router();

/* GET services.
 */
router.get('/', (req, res) => {
    Service.find().then(services => {
        if (services) {
            return res.status(200).json({
                success: true,
                result: services,
            });
        } else {
            return res
                .status(404)
                .json({ errors: [{ service: 'services are empty' }] });
        }
    });
});

/* GET 1 service.
 */
router.get('/:service_id', (req, res) => {
    Service.findById(req.params.service_id)
        .then(services => {
            if (services) {
                return res.status(200).json({
                    success: true,
                    result: services,
                });
            } else {
                return res
                    .status(404)
                    .json({ errors: [{ service: 'services are empty' }] });
            }
        })
        .catch(err => {
            return res
                .status(404)
                .json({ errors: [{ service: "service doesn't exist" }, err] });
        });
});

/* Retrieve services with specified tags.
 */
router.post('/filter', (req, res) => {
    const filter = {};
    if (req.body.tags && req.body.tags.length > 0) {
        filter.tags = { $all: req.body.tags };
    }
    if (req.body.search && req.body.search.length > 0) {
        filter.$or = [
            { name: new RegExp(req.body.search, 'i') },
            { provider: new RegExp(req.body.search, 'i') },
        ];
    }
    Service.find(filter).then(services => {
        if (services) {
            return res.status(200).json({
                success: true,
                result: services,
            });
        } else {
            return res
                .status(404)
                .json({ errors: [{ service: 'services are empty' }] });
        }
    });
});

/* ADD a service. */
router.post('/', (req, res) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                Service.findOne({
                    provider: req.body.username,
                    name: req.body.name,
                }).then(service => {
                    if (service)
                        return res.status(422).json({
                            errors: [{ service: 'service already exists' }],
                        });
                    else {
                        const newService = new Service({
                            provider: req.body.username,
                            name: req.body.name,
                            description: req.body.description,
                            cost: req.body.cost,
                            duration: req.body.duration,
                            availability: req.body.availability,
                            location: req.body.location,
                            tags: req.body.tags,
                        });
                        newService
                            .save()
                            .then(response => {
                                return res.status(200).json({
                                    success: true,
                                    result: response,
                                });
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    errors: [{ error: err }],
                                });
                            });
                    }
                });
            } else {
                return res.status(500).json({
                    errors: [{ error: 'user not found' }],
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                errors: [{ error: err }],
            });
        });
});

/* Add a rating to a service. */
router.put('/:service_id/rate', (req, res) => {

    if (!req.body.rating || req.body.rating <= 0 || req.body.rating > 5) {
        return res
            .status(400)
            .json({ errors: 'Rating outside of valid range' });
    }

    // Push the rating to the service's ratings array.
    Service.findByIdAndUpdate(
        req.params.service_id,
        { $push: { ratings: req.body.rating } }
    );
});


/* UPDATE a service. Returns the OLD object */
router.put('/:service_id', (req, res) => {
    //can't change the username attached to service
    if (Object.prototype.hasOwnProperty.call(req.body, 'username')) {
        return res
            .status(500)
            .json({ errors: 'Cannot change user in service' });
    }

    //update the service based on req.body
    Service.findByIdAndUpdate(
        req.params.service_id,
        req.body,
        (err, service) => {
            if (err) return res.status(500).json({ errors: err });
            return res.status(200).json({ success: true, result: service });
        }
    );
});

/* DELETE service(s). */
router.delete('/:service_id', (req, res) => {
    Service.findOneAndRemove({ _id: req.params.service_id })
        .then(() => {
            return res.status(200).json({ success: true });
        })
        .catch(err => {
            return res.status(500).json({ errors: [{ error: err }] });
        });
});

module.exports = router;
