import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppointmentCard from '../components/AppointmentCard';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';

const Appointment = () => {
    const [appointments, setAppointments] = useState();
    const [cookies] = useCookies();
    const history = useHistory();
    const fetchAppointments = async username => {
        //this gets appointments where the user is both the buyer and provider
        const res = await axios.get(`/appointment/${username}`);
        setAppointments(res.data.result);
    };
    //fetch appointments
    useEffect(() => {
        if (cookies.username) fetchAppointments(cookies.username);
        else history.push('/login');
    }, []);
    return (
        <div>
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
                              date_time={apt.booked_time}></AppointmentCard>
                      );
                  })
                : null}
        </div>
    );
};

export default Appointment;
