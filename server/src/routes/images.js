const express = require('express');
const multer = require('multer');
const Image = require('../db/models/image.js');
const User = require('../db/models/user.js');

const router = express.Router();

// Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // reject storing a non png/jpg file.
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6, // 6mb
    },
    fileFilter: fileFilter,
});

/* GET all of a user's images (i.e., loading an entire portfolio)
 */
router.get('/:username', (req, res) => {
    User.findOne({ username: req.params.username })
        .then(user => {
            if (user) {
                Image.find({ ownerUsername: user.username })
                    .then(images => {
                        return res.status(200).json({
                            success: true,
                            result: images,
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            errors: [{ error: err }],
                        });
                    });
            } else {
                return res.status(404).json({
                    errors: [{ error: 'User not found!' }],
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                errors: [{ error: err }],
            });
        });
});

/* POST a new image.
 */
router.route('/upload').post(upload.single('imageData'), (req, res) => {
    const newImage = new Image({
        ownerUsername: req.body.ownerUsername,
        uploadDate: Date.now(),
        imageName: req.body.imageName,
        imageData: req.file.path,
    });

    newImage
        .save()
        .then(response => {
            res.status(200).json({
                success: true,
                result: response,
            });
        })
        .catch(err => {
            return res.status(500).json({
                errors: [{ error: err }],
            });
        });
});

router.delete('/:image_id', (req, res) => {
    Image.findByIdAndRemove(req.params.image_id, err => {
        if (err) return res.status(500).json({ errors: [err] });
        res.status(200).json({ success: true });
    });
});

module.exports = router;
