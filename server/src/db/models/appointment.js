const mongoose = require('mongoose');

const { Schema } = mongoose;

const appointmentSchema = new Schema({
    buyer: { type: String, required: true },
    provider: { type: String, required: true },
    service_id: { type: String, required: true },
    created_at: { type: Date, required: true },
    booked_time: { type: Date, required: true },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
