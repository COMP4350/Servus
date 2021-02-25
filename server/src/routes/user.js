import { Router } from 'express';
import Service from '../db/models/service.js';
import User from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { verifyPassword, encryptPassword } from '../utils/authUtils.js';

const router = Router();

router.get('/:username', (req, res) => {
    User.findOne({ username: req.params.username }).then(user => {
        if (!user)
            return res
                .status(422)
                .json({ errors: [{ user: "username doesn't exist" }] });
        else {
            res.status(200).json({
                success: true,
                result: user,
            });
        }
    });
});

router.post('/:username/login', (req, res) => {
    const username = req.params.username;
    const password = req.body.password;
    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    errors: [{ user: 'not found' }],
                });
            } else {
                bcrypt
                    .compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res
                                .status(400)
                                .json({ errors: [{ password: 'incorrect' }] });
                        }
                        res.cookie('username', user.username, {
                            maxAge: 2 * 60 * 60 * 1000,
                        });
                        return res.status(200).json({
                            result: user,
                        });
                    })
                    .catch(err => {
                        res.status(500).json({ errors: err });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ errors: err });
        });
});

/* Add a new user */
router.post('/:username', (req, res) => {
    User.findOne({ username: req.params.username }).then(user => {
        if (user)
            return res
                .status(422)
                .json({ errors: [{ user: 'username already exists' }] });
        else {
            const newUser = new User({
                username: req.params.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
            });
            encryptPassword(newUser.password)
                .then(encrpytedPassword => {
                    newUser.password = encrpytedPassword;
                    newUser
                        .save()
                        .then(response => {
                            res.status(200).json({
                                success: true,
                                result: response,
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
        }
    });
});

/* Update a new user. DOES NOT ADD IF IT DOESN'T EXIST. */
/* Returns the OLD object */
router.put('/:username', (req, res) => {
    const updateOneUser = (query, filter) => {
        User.findOneAndUpdate(query, filter, (err, user) => {
            if (err) return res.status(500).json({ error: err });
            return res.status(200).json({ success: true, result: user });
        });
    };
    let query = { username: req.params.username }; //what user are we updating?

    //if we want to change the password we have to encrypt it
    if (Object.prototype.hasOwnProperty.call(req.body, 'password'))
        encryptPassword(req.body.password)
            .then(encrpytedPassword => {
                req.body.password = encrpytedPassword;
                return updateOneUser(query, req.body);
            })
            .catch(err => {
                return res.status(500).json({ error: err });
            });
    else {
        //if we aren't encrypting a password, just update the user properties
        return updateOneUser(query, req.body);
    }
});

/* Get all user's services */
router.get('/:username/services', (req, res) => {
    Service.find({ providers: req.params.username }).then(services => {
        res.status(200).json({
            success: true,
            result: services,
        });
    });
});

/* DELETE user(s). */
router.delete('/:username', (req, res) => {
    if (Object.prototype.hasOwnProperty.call(req.body, 'password')) {
        if (verifyPassword(req.params.username, req.body.password)) {
            User.remove({ username: req.params.username }, err => {
                if (err) throw err;
                res.status(200);
            });
        }
    }
});

export default router;
