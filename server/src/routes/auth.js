import User from '../db/models/user.js';
import bcrypt from 'bcrypt';

const login = (req, res) => {
    let { username, password } = req.body;
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
                        return res.status(200).json({
                            firstname: user.firstname,
                            lastname: user.lastname,
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
};

const verifyPassword = (username, password) => {
    User.findOne({ username: username }).then(user => {
        if (!user) {
            return false;
        } else {
            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    return isMatch;
                })
                .catch(err => {
                    return false;
                    // TODO? error
                });
        }
    });
};

export default { login, verifyPassword };
