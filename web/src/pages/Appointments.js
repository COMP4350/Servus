import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from '../components/Calendar';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#647AA3',
        },
        secondary: {
            main: '#EC5732',
        },
        default: {
            main: '#FFF2EB',
        },
    },
    background: {
        dark: '#151515',
        main: '#272727',
    },
    typography: {
        fontFamily: ['Roboto'],
    },
});

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        height: '91%',
    },
}));


const Appointment = () => {
    const [appointments, setAppointments] = useState();
    const classes = useStyles();
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
        <ThemeProvider
            theme={theme}>
                <div
                className={classes.container}>
                {appointments ? (
                <Calendar appointments={appointments}></Calendar>
            ) : null}
                </div>
            
        </ThemeProvider>

    );
};

export default Appointment;
