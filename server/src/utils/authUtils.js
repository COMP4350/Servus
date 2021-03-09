const User = require('../db/models/user.js');
const bcrypt = require('bcrypt');

/* Encryption Helper. Promises to return an encrypted password*/
exports.encryptPassword = password => {
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

exports.verifyPassword = (username, password) => {
    User.findOne({ username: username }).then(user => {
        if (!user) {
            return false;
        } else {
            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    return isMatch;
                })
                .catch(() => {
                    return false;
                    // TODO? error
                });
        }
    });
};
