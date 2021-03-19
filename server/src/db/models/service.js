const mongoose = require('mongoose');

const { Schema } = mongoose;

const serviceSchema = new Schema({
    provider: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    cost: { type: String, required: true },
    duration: { type: String, required: false },
    availability: {
        week: [{ type: String, required: false }],
        time: {
            //stored in 24 hour time
            start: { type: String, required: false },
            end: { type: String, required: false },
        },
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true },
    },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
