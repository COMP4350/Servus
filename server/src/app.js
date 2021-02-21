import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import servicesRouter from './routes/services.js';
import userRouter from './routes/user.js';
import appointmentRouter from './routes/appointment.js';

const app = express();
const handleError = error => {
    console.log('########## Error Occured #########\n\n');
    console.error(error);
    console.log('##################################\n');
};

mongoose
    .connect('mongodb://localhost:27017/Test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .catch(error => handleError(error));

mongoose.connection.on('error', error => handleError(error));
mongoose.connection.once('open', () => console.log('connected to database'));

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/services', servicesRouter);
app.use('/user', userRouter);
app.use('/appointment', appointmentRouter);

export default app;
