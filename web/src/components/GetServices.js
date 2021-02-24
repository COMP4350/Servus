import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import ServiceCard from './ServiceCard';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 400,
        marginLeft: 10,
        marginTop: 10,
    },
}));

const GetServices = () => {
    const [services, setServices] = useState(null);
    const classes = useStyles();
    const fetchData = async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API_HOST}/services/`
        );
        setServices(response.data.result);
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className={classes.root}>
                {services
                    ? services.map((service, index) => {
                          return (
                              <ServiceCard
                                  service={service}
                                  index={index}
                                  bg={{ backgroundColor: '#647AA3' }}
                              />
                          );
                      })
                    : null}
            </div>
        </div>
    );
};

export default GetServices;
