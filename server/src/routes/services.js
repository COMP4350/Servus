import { Router } from 'express';
import Service from '../db/models/service.js';

const router = Router();

/* GET all services. */
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

/* UPDATE a service. */
router.put('/', (req, res) => {
    //TODO
});

export default router;
