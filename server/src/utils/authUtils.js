const User = require('../db/models/user.js');
const bcrypt = require('bcrypt');

/* Encryption Helper. Promises to return an encrypted password*/
const encryptPassword = password => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(new TypeError('Password Encryption Failed!'));
                } else {
                    resolve(hash);
                }
            });
        });
    });
};

const verifyPassword = (username, password) => {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username })
            .then(user => {
                if (user) {
                    bcrypt
                        .compare(password, user.password)
                        .then(isMatch => {
                            resolve(isMatch);
                        })
                        .catch(err => {
                            reject(err);
                        });
                } else {
                    resolve(false);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = { verifyPassword, encryptPassword };
