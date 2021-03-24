const express = require('express');
const Service = require('../db/models/service.js');
const Appointment = require('../db/models/appointment.js');
const User = require('../db/models/user.js');
const { noConflicts, inTimeSlot } = require('../utils/apptUtils');
const router = express.Router();

/* Get appointments for username */
router.get('/:username', (req, res) => {
    const { start_date, end_date } = req.query;
    let searchQuery = {
        $or: [
            { buyer: req.params.username },
            { provider: req.params.username },
        ],
    };
    if (start_date || end_date) searchQuery.booked_time = {};

    if (start_date) searchQuery.booked_time.$gte = new Date(start_date);
    if (end_date) searchQuery.booked_time.$lt = new Date(end_date);

    User.findOne({ username: req.params.username })
        .then(user => {
            if (user) {
                Appointment.find(searchQuery)
                    .then(appointments => {
                        if (appointments) {
                            return res
                                .status(200)
                                .json({ result: appointments });
                        } else {
                            return res.status(404).json([]);
                        }
                    })
                    .catch(err => {
                        return res
                            .status(500)
                            .json({ errors: [{ error: err }] });
                    });
            } else {
                return res
                    .status(404)
                    .json({ errors: [{ user: 'not found' }] });
            }
        })
        .catch(err => {
            return res.status(500).json({ errors: [{ error: err }] });
        });
});

router.get('/service/:id', (req, res) => {
    let searchQuery = {
        service_id: req.params.id,
    };

    Appointment.find(searchQuery)
        .then(appointments => {
            if (appointments) {
                return res.status(200).json({ result: appointments });
            } else {
                return res.status(404).json([]);
            }
        })
        .catch(err => {
            return res.status(500).json({ errors: [{ error: err }] });
        });
});

/* Create new appointment */
//TODO: Availability?
router.post('/:buyer', (req, res) => {
    let provider = '';

    //if the date is in the past, you cannot book an appointment
    if (new Date(req.body.booked_time) < Date.now()) {
        return res.status(500).json({
            errors: [{ appointment: 'appointment time invalid – in the past' }],
        });
    }

    Service.findById(req.body.service_id)
        .then(service => {
            if (service) {
                provider = service.provider;

                //we need to verify that the buyer is able to book for the time they choose
                //so we need to check that:
                //1: this fits in the service timeslot
                //2: there are no conflicting appointments with this service

                if (service.availability && !inTimeSlot(service, req)) {
                    return res.status(500).json({
                        errors: [
                            {
                                appointment:
                                    'appointment time invalid – not available',
                            },
                        ],
                    });
                }

                noConflicts(service, req)
                    .then(nocons => {
                        if (nocons) {
                            Appointment.findOne({
                                ...req.body,
                                buyer: req.params.buyer,
                            }).then(() => {
                                const newAppointment = new Appointment({
                                    buyer: req.params.buyer,
                                    provider: provider,
                                    service_id: req.body.service_id,
                                    booked_time: req.body.booked_time,
                                    created_at: Date.now(),
                                });
                                newAppointment
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
                            });
                        } else {
                            return res.status(500).json({
                                errors: [
                                    {
                                        error:
                                            'appointment time invalid – conflicts with other appointments',
                                    },
                                ],
                            });
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({
                            errors: [{ error: err }],
                        });
                    });
            } else {
                return res
                    .status(404)
                    .json({ error: 'service does not exist for appointment' });
            }
        })
        .catch(() => {
            console.log('we in catch');
            return res
                .status(404)
                .json({ error: 'service does not exist for appointment' });
        });
});

/* DELETE appointments(s). */
router.delete('/:appointment_id', (req, res) => {
    Appointment.findByIdAndRemove(req.params.appointment_id, err => {
        if (err) {
            return res.status(500).json({ success: false });
        } else {
            return res.status(200).json({ success: true });
        }
    });
});

module.exports = router;
