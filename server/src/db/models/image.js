const mongoose = require('mongoose');

const { Schema } = mongoose;

const imageSchema = new Schema({
    ownerUsername: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
    },
    imageName: {
        type: String,
        default: 'none',
        required: true,
    },
    imageData: {
        type: String,
        required: true,
    },
    profilePicture: { type: Boolean, default: false },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
