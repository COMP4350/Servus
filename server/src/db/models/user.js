import mongoose from 'mongoose';
import { Service } from './service';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    password: { type: String, required: true },
    services: { type: [Service], required: false },
});

const User = mongoose.model('User', userSchema);

export default User;