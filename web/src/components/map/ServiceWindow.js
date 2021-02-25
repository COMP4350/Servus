import React from 'react';
import axios from 'axios';
import { Card, Typography, Button } from '@material-ui/core';

const ServiceWindow = props => {
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
            <Button onClick={bookAppointment}>BOOK</Button>
        </Card>
    );
};

export default ServiceWindow;
