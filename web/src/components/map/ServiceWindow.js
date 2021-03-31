import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography, Button } from '@material-ui/core';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';

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
    const [form, setForm] = useState();
    const [errors, setErrors] = useState({});
    const [cookies] = useCookies();
    const history = useHistory();

    const validate = () => {
        let errors = {};
        if (!form) {
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
                    `/appointment/${cookies.username}`,
                    {
                        service_id: props.service._id,
                        provider: props.service.provider,
                        booked_time: form,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(res => {
                    if (res.data.errors) {
                        if (res.data.timeslot) {
                            if (res.data.timeslot.availability_start) {
                                alert(
                                    `Please book within timeslot ${res.data.timeslot.availability_start} to ${res.data.timeslot.availability_end}`
                                );
                            } else {
                                alert('Service not available on this day');
                            }
                        } else if (res.data.nocons) {
                            alert(
                                `Conflict with another appointment from time ${moment(
                                    res.data.nocons.conflict_start
                                ).local()} to ${moment(
                                    res.data.nocons.conflict_end
                                ).local()}`
                            );
                        } else {
                            alert(`Error occured when trying to book`);
                        }
                    } else {
                        alert(
                            `Successfully booked Service with ${props.service.provider}`
                        );
                    }
                })
                .catch(err => {
                    throw err;
                });
        }
    };
    useEffect(() => {
        if (cookies.username) bookAppointment();
        else if(history) history.push('/login');
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
                            value={form}
                            initialFocusedDate={Date.now()}
                            ampm={false}
                            onAccept={setForm}
                            onChange={setForm}
                            name="time"
                            autoOk={true}
                            disablePast={true}
                            errors={errors.time}
                        />
                    </div>
                </MuiPickersUtilsProvider>
            </form>
            <Button onClick={validate}>BOOK</Button>
        </Card>
    );
};

export default ServiceWindow;
