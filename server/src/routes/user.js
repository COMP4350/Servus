import { Router } from 'express';
import Service, { create } from '../db/models/service.js';
import User, { create } from '../db/models/user.js';
import bcrypt from 'bcrypt';
const router = Router();

router.get('/:username', (req, res) => {
    res.json('user page xd');
});

/* Add a new user */
router.post('/:username', (req, res) => {
    User.findOne({ username: req.params.username }).then(user => {
        if (user)
            return res
                .status(422)
                .json({ errors: [{ user: 'username already exists' }] });
        else
        {
            const newUser = new User({
                username: req.params.username,
                name: {
                    firstName: req.params.firstName,
                    lastName: req.params.lastName,
                },
                password: req.params.password,
                services: [],
            });

            bcrypt.genSalt(10, function(err, salt) { bcrypt.hash(password, salt, function(err, hash) {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(response => {
                        res.status(200).json({
                            success: true,
                            result: response
                       })
                    })
                    .catch(err => {
                        res.status(500).json({
                            errors: [{ error: err }]
                        });
                    });
                });
            });
        }
    })
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