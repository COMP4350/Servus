import mongoose from 'mongoose';

const { Schema } = mongoose;

const appointmentSchema = new Schema({
    id: {
        buyer: { type: String, required: true },
        provider: { type: String, required: true },
        service_id: { type: String, required: true },
        date_time: { type: Date, required: true },
        booked_time: { type: Date, required: true },
    },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
