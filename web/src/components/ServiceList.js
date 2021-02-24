import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 400,
        marginLeft: 10,
        marginTop: 10,
    },
    title: {
        fontSize: 14,
    },
    details: {
        margin: '0 2px',
    },
    cardView: {
        padding: theme.spacing(2),
    },
}));

const ServiceList = () => {
    const [services, setServices] = useState(null);
    const classes = useStyles();
    const fetchData = async () => {
        const response = await axios.get('http://localhost:5000/services/');
        setServices(response.data.result);
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className={classes.root}>
                {services &&
                    services.map((service, index) => {
                        return (
                            <Card
                                bg="black"
                                style={{ backgroundColor: '#647AA3' }}
                                variant="outlined"
                                className={classes.cardView}
                                key={index}>
                                <h2 className={classes.title}>
                                    {service.name}
                                </h2>
                                <div className={classes.details}>
                                    <p>Provider: {service.provider}</p>
                                    <p>Info: {service.description}</p>
                                    <p>$: {service.cost}</p>
                                    <p>Time: {service.duration}</p>
                                </div>
                            </Card>
                        );
                    })}
            </div>
        </div>
    );
};

export default ServiceList;
