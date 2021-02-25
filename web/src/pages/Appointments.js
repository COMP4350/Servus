import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import AppointmentCard from '../components/AppointmentCard';

const useStyles = makeStyles(theme => ({
    container: {},
}));

const Appointment = () => {
    const classes = useStyles();
    const [appointments, setAppointments] = useState();
    const fetchAppointments = async () => {
        //this gets appointments where the user is both the buyer and provider
        const res = await axios.get(
            `${process.env.REACT_APP_API_HOST}/appointment/zimbakor`
        );
        console.log(res.data);
        setAppointments(res.data.result);
    };
    //fetch appointments
    useEffect(() => {
        fetchAppointments();
    }, []);
    return (
        <div className={classes.container}>
            {appointments
                ? appointments.map((apt, i) => {
                      let service = {
                          id: apt.service_id,
                          provider: apt.provider,
                      };
                      return (
                          <AppointmentCard
                              service={service}
                              key={i}
                              date_time={apt.date_time}></AppointmentCard>
                      );
                  })
                : null}
        </div>
    );
};

export default Appointment;
