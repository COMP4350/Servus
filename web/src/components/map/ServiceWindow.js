import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography, TextField, Button } from '@material-ui/core';
import useForm from '../../hooks/useForm';

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
    const [form, onFormChange] = useForm({
        time: '',
    });
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
                        date_time: form.time,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(() => {
                    alert(
                        `Successfully booked Service with ${props.service.provider}`
                    );
                });
        }
    };
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
                <TextField
                    id="time"
                    label="Appointment Time"
                    type="datetime-local"
                    onChange={onFormChange}
                    name="time"
                    value={form.time}
                    error={errors.time}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </form>
            <Button onClick={validate}>BOOK</Button>
        </Card>
    );
};

export default ServiceWindow;
