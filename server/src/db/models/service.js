const mongoose = require('mongoose');

const { Schema } = mongoose;

const availabilitySchema = new Schema({
    weekday: { type: Number, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
});

const ratingSchema = new Schema(
    {
        rating: { type: Number, required: true },
        username: { type: String, required: true },
    },
    { _id: false }
);

const serviceSchema = new Schema({
    provider: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    cost: { type: String, required: true },
    duration: { type: String, required: false },
    availability: { type: [availabilitySchema], required: false },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true },
    },
    ratings: { type: [ratingSchema], required: false },
    tags: { type: [String], required: false },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
