import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    date: {
        marginBottom: 12,
    },
    provider: {
        fontSize: 14,
    },
});

const AppointmentCard = props => {
    const classes = useStyles();
    const [service, setService] = useState();

    useEffect(() => {
        const fetchServiceInfo = async () => {
            const res = await axios.get(
                `${process.env.REACT_APP_API_HOST}/services/${props.service.id}`
            );
            setService(res.data.result);
        };
        fetchServiceInfo();
    }, [props]);

    return (
        <Card>
            <CardContent>
                <Typography color="textSecondary" className={classes.provider}>
                    {props.service.provider}
                </Typography>
                <Typography variant="h5">
                    {service ? service.name : null}
                </Typography>
                <Typography className={classes.date}>
                    {props.booked_time}
                </Typography>
                <Typography variant="body2" component="p">
                    {service ? service.description : null}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AppointmentCard;
