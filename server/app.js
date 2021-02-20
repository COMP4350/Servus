import mongoose from 'mongoose';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import servicesRouter from './routes/services';

const app = express();
const handleError = (error) => {
    console.error(error);
}

mongoose.connect('mongodb://localhost:27017/test',{useNewUrlParser: true})
.catch(error => handleError(error));

mongoose.connection.on("error", (error)=>handleError(error));
mongoose.connection.once("open", ()  => console.log("connected to database"));

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/services', servicesRouter);


export default app;
