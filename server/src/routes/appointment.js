import { Router } from 'express';
import Service from '../db/models/service.js';
import Appointment from '../db/models/appointment.js';

const router = Router();

/* Get appointments for username */
router.get('/:username', (req, res) => {
    let appointments = {}

    Appointment.find({ buyer: req.params.username }).then(buyerAppointments => {
        if (buyerAppointments)
            appointments = {...appointments, ...buyerAppointments}
    })
    Appointment.find({ provider: req.params.username }).then(providerAppointments => {
        if (providerAppointments)
            appointments = {...appointments, ...providerAppointments}
    })

    return res.status(200).json({ success: true, result: appointments });
}) 


/* Create new appointment */
router.post('/:buyer', (req, res) => {
    let provider = ''

    Service.findById(req.body.service_id)
    .then(service => {
        if (service)
            provider = service.provider;
         else 
            return res.status(404).json({ error: 'service does not exist for appointment' })
    });

    Appointment.findOne({...req.body, buyer: req.params.buyer }).then(
        appointment => {
            if (appointment)
                return res.status(422).json({ errors: [{ appointment: 'appointment already exists' }]})
            else {
                const newAppointment = new Appointment({
                    buyer: req.params.buyer,
                    provider: provider,
                    service_id: req.body.service_id,
                    date_time: req.body.date_time,
                    booked_time: Date.now()
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
                        })
                    })
            }
        }
    )
});

export default router;
