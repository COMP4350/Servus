import { Router } from 'express';
import Service from '../db/models/service.js';
import User from '../db/models/user.js';
import bcrypt from 'bcrypt';

const router = Router();

/* Encryption Helper. Promises to return an encrypted password*/
const encryptPassword = password => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    //reject, we couldn't encrypt :(
                    reject(new TypeError('Password Encryption Failed!'));
                } else {
                    //send the hash!
                    resolve(hash);
                }
            });
        });
    });
};

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
                services: [],
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
    if (req.body.hasOwnProperty('password'))
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
router.delete('/', (req, res) => {
    User.remove(req.body, err => {
        if (err) throw err;
        res.status(200);
    });
});

export default router;
