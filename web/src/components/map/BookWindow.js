import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import {
    ThemeProvider,
    Button,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    Typography,
} from '@material-ui/core';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { useCookies } from 'react-cookie';

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
    window: {
        margin: '50',
        display: 'flex',
        alignItems: 'center',
        'flex-direction': 'column',
        width: '100%',
        height: '100%',
        background: theme.background.main,
    },
    innerwindow: {
        display: 'flex',
        height: '100%',
        'flex-direction': 'column',
        justifyContent: 'space-evenly',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        'flex-direction': 'column',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
    },
    formControl: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
        height: 40,
    },
    userIcon: {
        height: '96px',
        width: '96px',
    },
    title: {
        marginTop: '15px',
        fontSize: '2.5em',
        color: 'white',
    },
    divider: {
        height: '100%',
        width: '3',
        'border-color': theme.background.main,
    },
    close: {
        position: 'absolute',
        top: 0,
        right: 10,
        color: 'white',
        fontSize: '2em',
    },
    submit: {},
}));

const BookWindow = props => {
    // STATES
    const [date, setDate] = useState();
    const [timeState, setTime] = useState({ time: '' });
    const [timepicker, setTimepicker] = useState();
    const [valid, setValid] = useState(false);
    const [errors, setErrors] = useState({});

    const classes = useStyles();
    const [cookies] = useCookies();

    let durationInHours = props.service.duration.slice(0, 2);
    let durationInMinutes = props.service.duration.slice(2);

    const displayTimePicker = async () => {
        const removeItemOnce = (arr, value) => {
            let index = arr.indexOf(value);
            if (index > -1)
                arr.splice(index, 1);
            return arr;
        };

        let bookableTimeSlots = [];
        // Create an array filled with the possible starting times for intervals that can be booked.
        const addTimeSlices = () => {
            for (let avail in props.service.availability) {
                if (props.service.availability[avail].weekday == date.day()) {
                    let availabilityStartTime = moment(
                        props.service.availability[avail].start_time,
                        'HH:mm'
                    );
                    let availabilityEndTime = moment(
                        props.service.availability[avail].end_time,
                        'HH:mm'
                    );

                    // Loop and populate the bookable time slots with 30 minute intervals,
                    // starting with the availability start time.
                    let currentAppointmentTime = moment(availabilityStartTime)
                        .add(durationInHours, 'h')
                        .add(durationInMinutes, 'm');
                    let tempTimeSlot = availabilityStartTime;

                    while (currentAppointmentTime <= availabilityEndTime) {
                        bookableTimeSlots.push(moment(tempTimeSlot).format('HH:mm'));
                        tempTimeSlot.add(30, 'm');
                        currentAppointmentTime.add(30, 'm');
                    }
                }
            }
        };
        // Remove the time slices that won't work.
        const removeConflictingTimes = async () => {
            let res = await axios.get(`appointment/service/${props.service._id}`);

            let availableTimes = [];
            for (let appt in res.data.result) {
                let timeBookedFor = moment(res.data.result[appt].booked_time);
                // Duplicate the time and add the length of the appointment to find the end time.
                let timeAppointmentEnds = moment(timeBookedFor)
                    .add(durationInHours, 'h')
                    .add(durationInMinutes, 'm');
                if (timeBookedFor.isSame(date, 'day')) {
                    for (let i in bookableTimeSlots) {
                        let formattedDate = date.format('YYYY-MM-DD');
                        let formattedTime = moment(
                            bookableTimeSlots[i],
                            'HH:mm'
                        ).format('HH:mm');
                        let bookableTimeSlot = moment(
                            `${formattedDate} ${formattedTime}`,
                            'YYYY-MM-DD HH:mm'
                        );
                        let bookableTimeSlotEnd = moment(bookableTimeSlot)
                            .add(durationInHours, 'h')
                            .add(durationInMinutes, 'm');

                        // Remove bookable slots where booking would result in schedule overlaps.
                        if (
                            (bookableTimeSlot >= timeBookedFor &&
                                bookableTimeSlot <= timeAppointmentEnds) ||
                            (bookableTimeSlotEnd >= timeBookedFor &&
                                bookableTimeSlotEnd <= timeAppointmentEnds)
                        ) {
                            availableTimes.push(bookableTimeSlots[i]);
                        }
                    }
                }
            }
            for (let i in availableTimes) 
                removeItemOnce(bookableTimeSlots, availableTimes[i]);
        };

        // Set up the final selectable booking times.
        addTimeSlices();
        await removeConflictingTimes();

        setTimepicker(
            <FormControl className={classes.formControl} data-cy={`appt-time`}>
                <InputLabel id="label" className={classes.inputLabel}>
                    Appointment Time
                </InputLabel>
                <Select
                    labelId="label"
                    value={timeState.time}
                    onChange={x => handleChangeTime(x)}>
                    {bookableTimeSlots?.map((x, i) => {
                        return (
                            <MenuItem key={i} value={x}>
                                {x}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        );
    };

    // Make the API call to add a new appointment to the database.
    const bookAppointment = () => {
        if (valid) {
            let formattedDate = date.format('YYYY-MM-DD');
            let formattedTime = moment(timeState.time, 'HH:mm').format('HH:mm:ss');

            let bookedTimeSlot = moment(
                `${formattedDate} ${formattedTime}`,
                'YYYY-MM-DD HH:mm:ss'
            ).toDate();
            axios
                .post(
                    `/appointment/${cookies.username}`,
                    {
                        service_id: props.service._id,
                        provider: props.service.provider,
                        booked_time: bookedTimeSlot,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(res => {
                    if (!res.data.errors) 
                        alert(`Successfully booked Service with ${props.service.provider}`);
                })
                .catch(err => {
                    throw err;
                });
            props.toggle();
            setValid(false);
        }
    };

    useEffect(() => {
        if (cookies.username) bookAppointment();
        if (date) displayTimePicker();
    }, [valid, date, timeState]);

    const handleChangeTime = x => {setTime({ time: x.target.value }); };

    const shouldDisableDay = date => {
        for (let avail in props.service.availability) {
            if (props.service.availability[avail].weekday == date.day())
                return false;
        }
        return true;
    };
    const validate = () => {
        let errors = {};
        if (!date || !timeState.time) {
            errors.time = 'Date & Time are required';
        }
        setErrors(errors);
        setValid(Object.getOwnPropertyNames(errors).length == 0);
    };

    const handleClick = () => { props.toggle(); };

    let apptDuration = `Appointment Duration:`;
    if (durationInHours === '00')
        apptDuration = `${apptDuration} ${durationInMinutes} mins`;
    else
        apptDuration = `${apptDuration} ${durationInHours}:${durationInMinutes} hrs`;

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.window}>
                <Typography
                    variant="h1"
                    className={classes.title}
                    data-cy={`book-title`}>
                    {props.service.name}
                </Typography>
                <Typography color="textSecondary">{apptDuration}</Typography>
                <div className={classes.innerwindow}>
                    <form className={classes.container} noValidate>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                                label={'Appointment Date'}
                                value={date}
                                initialFocusedDate={Date.now()}
                                onAccept={setDate}
                                onChange={setDate}
                                name="date"
                                autoOk={true}
                                disablePast={true}
                                errors={errors.time}
                                shouldDisableDate={shouldDisableDay}
                                className={classes.textField}
                                data-cy={`dates`}
                            />
                            {timepicker}
                        </MuiPickersUtilsProvider>
                    </form>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={validate}
                        data-cy={`confirm`}>
                        CONFIRM
                    </Button>
                </div>
                <span className={classes.close} onClick={handleClick}>
                    &times;{' '}
                </span>
            </div>
        </ThemeProvider>
    );
};

export default BookWindow;
