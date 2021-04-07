import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from '../components/Calendar';
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
        console.log(appointments);
    };
    //fetch appointments
    useEffect(() => {
        if (cookies.username) fetchAppointments(cookies.username);
        else history.push('/login');
    }, []);
    return (
        <div>
            {appointments ? (
                <Calendar appointments={appointments}></Calendar>
            ) : null}
        </div>
    );
};

export default Appointment;
