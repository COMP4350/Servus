import { Router } from 'express';
const router = Router();

router.get('/:username', (req, res) => {
    res.json('user page xd');
});

/* Add a new user */
router.post('/:username', (req, res) => {
    const newUser = {
        username: req.params.username,
        name: {
            firstName: req.params.firstname,
            lastName: req.params.lastname
        },
        password: req.params.password,
        services: []
    };

    res.json(newUser);
});

/* Get all user's services */
router.get('/:username/services', (req, res) => {
    res.json([]);
});

/* Creating a new service for the user */
router.post('/:username/service/:id', (req, res) => {
    // do nothing yet
});

/* Delete a user's service TBD */
router.delete('/:username/service/:id', (req, res) => {
    // do nothing yet
});

export default router;