import User from '../db/models/user.js';
import bcrypt from 'bcrypt';

/* Encryption Helper. Promises to return an encrypted password*/
export const encryptPassword = password => {
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

export const login = (username, password, res) => {
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

export const verifyPassword = (username, password) => {
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

export default { login, verifyPassword, encryptPassword };
