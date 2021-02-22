import mongoose from 'mongoose';

const { Schema } = mongoose;

const serviceSchema = new Schema({
    provider: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    cost: { type: String, required: true },
    duration: { type: String, required: false },
    availability: { type: String, required: true },
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
