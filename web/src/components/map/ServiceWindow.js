import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography, Button } from '@material-ui/core';
// import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

const ServiceWindow = props => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const validate = () => {
        let errors = {};
        if (!form.time) {
            errors.time = 'time is required';
        }
        setErrors(errors);
        setValid(Object.getOwnPropertyNames(errors).length == 0);
    };

    const classes = useStyles();
    const [valid, setValid] = useState(false);
    const bookAppointment = () => {
        if (valid) {
            axios
                .post(
                    `/appointment/${props.username}`,
                    {
                        service_id: props.service._id,
                        provider: props.service.provider,
                        booked_time: form.time,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(() => {
                    alert(
                        `Successfully booked Service with ${props.service.provider}`
                    );
                })
                .catch(err => {
                    alert(`Error in booking service ${err}`);
                });
        }
    };
    const setSelectedTime = () => {};
    useEffect(() => {
        bookAppointment();
    }, [valid, form]);
    return (
        <Card>
            <Typography color="textSecondary">
                {props.service.provider}
            </Typography>
            <Typography variant="h5">{props.service.name}</Typography>
            <Typography variant="body2" component="p">
                {props.service.description}
            </Typography>
            <form className={classes.container} noValidate>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <div className="timepicker">
                        <DateTimePicker
                            label={'Appointment Time'}
                            value={form.time}
                            initialFocusedDate={Date.now()}
                            ampm={false}
                            onAccept={date => {
                                setForm({ time: date });
                            }}
                            onChange={date => setSelectedTime(date)}
                            name="time"
                            autoOk={true}
                            disablePast={true}
                            error={errors.time}
                        />
                    </div>
                </MuiPickersUtilsProvider>
            </form>
            <Button onClick={validate}>BOOK</Button>
        </Card>
    );
};

export default ServiceWindow;
