import { Router } from 'express';
import Service from '../db/models/service.js';

const router = Router();

/* GET services. 
if empty body, returns ALL services.
filter services by adding params to body
*/
router.get('/', (req, res) => {
    Service.find(req.body).then(services => {
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
    Service.findOne({ provider: req.body.username, name: req.body.name }).then(
        service => {
            if (service)
                return res
                    .status(422)
                    .json({ errors: [{ service: 'service already exists' }] });
            else {
                const newService = new Service({
                    provider: req.body.username,
                    name: req.body.name,
                    description: req.body.description,
                    cost: req.body.cost,
                    duration: req.body.duration,
                    availability: req.body.availability,
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
        }
    );
});

/* UPDATE a service. Returns the OLD object */
router.put('/:service_id', (req, res) => {
    //can't change the username attached to service
    if (req.body.hasOwnProperty('username')) {
        return res.status(500).json({ error: 'Cannot change user in service' });
    }

    //update the service based on req.body
    Service.findByIdAndUpdate(
        req.params.service_id,
        req.body,
        (err, service) => {
            if (err) return res.status(500).json({ error: err });
            return res.status(200).json({ success: true, result: service });
        }
    );
});

/* DELETE service(s). */
router.delete('/:service_id', (req, res) => {
    Service.findByIdAndRemove(req.params.service_id, err => {
        if (err) throw err;
        res.status(200);
    });
});

export default router;
