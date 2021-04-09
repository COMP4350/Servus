const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');

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
app.use(
    session({
        secret: '234234',
        proxy: true, // add this when behind a reverse proxy, if you need secure cookies
        cookie: {
            maxAge: 5184000000, // 2 months
        },
    })
);
app.use(cors({ origin: process.env.API_URL, credentials: true }));
app.set('trust proxy', 1);

app.use('/services', servicesRouter);
app.use('/user', userRouter);
app.use('/appointment', appointmentRouter);
app.use('/images', imagesRouter);
app.use('/uploads', express.static('uploads'));
console.log('Server online');

module.exports = app;
