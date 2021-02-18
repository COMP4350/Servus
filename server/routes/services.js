const express = require('express');
const router = express.Router();
const stubDb = require('../db/stub.json');

/* GET all services. */
router.get('/', (req, res) => {
    res.json(stubDb['services']);
});

/* ADD a service. */
router.post('/:id', (req, res) => {
    const newService = {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        duration: req.body.duration,
        availability: req.body.availability,
    };
    //TODO: add the new service to the stub db
    res.json(newService);
});

module.exports = router;
