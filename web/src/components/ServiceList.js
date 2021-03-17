import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import ServiceCard from './ServiceCard';
import { mockServiceList } from '../mocks/getMockServiceList';
const dotenv = require('dotenv');

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 400,
        marginLeft: 10,
        marginTop: 10,
    },
}));

const ServiceList = () => {
    const [services, setServices] = useState(null);
    const classes = useStyles();
    const getServices = async () => {
        if (process.env.NODE_ENV === 'test') {
            setServices(mockServiceList);
        } else {
            const response = await axios.get(`/services/`);
            setServices(response.data.result);
        }
    };
    useEffect(() => {
        getServices();
    }, []);

    return (
        <div>
            <div className={classes.root}>
                {services
                    ? services.map((service, index) => {
                          return (
                              <ServiceCard
                                  key={index}
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

export default ServiceList;
