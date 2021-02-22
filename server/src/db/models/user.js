import mongoose from 'mongoose';
import Service from './service.js';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;
