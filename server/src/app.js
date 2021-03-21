import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import servicesRouter from './routes/services.js';
import userRouter from './routes/user.js';
import appointmentRouter from './routes/appointment.js';

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
const handleError = error => {
    console.log('########## Error Occured #########\n\n');
    console.error(error);
    console.log('##################################\n');
};

mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .catch(error => handleError(error));

mongoose.connection.on('error', error => handleError(error));
mongoose.connection.once('open', () => console.log('Connected to database'));

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use(cors({ origin: true, credentials: true }));
app.use('/', indexRouter);
app.use('/services', servicesRouter);
app.use('/user', userRouter);
app.use('/appointment', appointmentRouter);
app.use('/images', imagesRouter);
app.use('/uploads', express.static('uploads'));
console.log('Server online');

module.exports = app;
