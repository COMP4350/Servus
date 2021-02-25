import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography, Button, TextField } from '@material-ui/core';

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
    const classes = useStyles();
    const bookAppointment = () => {
        axios
            .post(
                `${process.env.REACT_APP_API_HOST}/appointment/${props.username}`,
                {
                    service_id: props.service._id,
                    provider: props.service.provider,
                    date_time: Date.now(),
                }
            )
            .then(() => {
                console.log('Success!!! :D');
            });
    };
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
                    id="datetime-local"
                    label="Next appointment"
                    type="datetime-local"
                    defaultValue={Date().toLocaleString}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </form>
            <Button
                onClick={() => {
                    bookAppointment();
                }}>
                BOOK
            </Button>
        </Card>
    );
};

export default ServiceWindow;
