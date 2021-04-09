const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const servicesRouter = require('./routes/services');
const userRouter = require('./routes/user');
const appointmentRouter = require('./routes/appointment');
const imagesRouter = require('./routes/images');

dotenv.config();

const app = express();
const handleError = error => {
    console.log('########## Error Occured #########\n\n');
    console.error(error);
    console.log('##################################\n');
};

const DB_URI =
    process.env.NODE_ENV === 'dev'
        ? process.env.DB_URI
        : process.env.TEST_DB_URI;

mongoose
    .connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .catch(error => handleError(error));

mongoose.connection.on('error', error => handleError(error));
mongoose.connection.once('open', () => console.log('Connected to database'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: process.env.API_URL, credentials: true }));
app.set('trust proxy', 1);

app.use('/services', servicesRouter);
app.use('/user', userRouter);
app.use('/appointment', appointmentRouter);
app.use('/images', imagesRouter);
app.use('/uploads', express.static('uploads'));
console.log('Server online');

module.exports = app;
