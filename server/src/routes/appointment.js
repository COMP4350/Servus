import { Router } from 'express';
import Service from '../db/models/service.js';
import Appointment from '../db/models/appointment.js';

const router = Router();

/* Get appointments for username */
//TODO: Refine filter by date.
router.get('/:username', (req, res) => {
    Appointment.find({
        $or: [
            { buyer: req.params.username, ...req.body },
            { provider: req.params.username, ...req.body },
        ],
    }).then(appointments => {
        if (appointments) {
            return res.status(200).json(appointments);
        }
        return res.status(404).json([]);
    });
});

/* Create new appointment */
//TODO: Availability?
router.post('/:buyer', (req, res) => {
    let provider = '';

    Service.findById(req.body.service_id).then(service => {
        if (service) provider = service.provider;
        else
            return res
                .status(404)
                .json({ error: 'service does not exist for appointment' });
    });

    Appointment.findOne({ ...req.body, buyer: req.params.buyer }).then(
        appointment => {
            if (appointment)
                return res.status(422).json({
                    errors: [{ appointment: 'appointment already exists' }],
                });
            else {
                const newAppointment = new Appointment({
                    buyer: req.params.buyer,
                    provider: provider,
                    service_id: req.body.service_id,
                    date_time: req.body.date_time,
                    booked_time: Date.now(),
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
            }
        }
    );
});

/* DELETE appointments(s). */
router.delete('/:appointment_id', (req, res) => {
    Appointment.findByIdAndRemove(req.params.appointment_id, err => {
        if (err) throw err;
        res.status(200);
    });
});

export default router;
