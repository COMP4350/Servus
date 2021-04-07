import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
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

import { theme } from '../../App';

const useStyles = makeStyles(() => ({
    window: {
        margin: '50',
        display: 'flex',
        alignItems: 'center',
        'flex-direction': 'column',
        width: '100%',
        height: '100%',
        background: 'white',
    },
    innerwindow: {
        padding: '10',
        margin: 2,
        display: 'flex',
        height: '100%',
        'flex-direction': 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        'flex-direction': 'column',
    },
    inputLabel: {
        color: theme.background.main,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
        color: 'white',
    },
    formControl: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
        height: 40,
        color: 'white',
    },
    userIcon: {
        height: '96px',
        width: '96px',
    },
    title: {
        fontSize: '3em',
    },
    divider: {
        height: '100%',
        width: '3',
        'border-color': theme.background.main,
    },
    close: {
        position: 'absolute',
        top: 0,
        right: 5,
        fontSize: '2em',
    },
    submit: {
        padding: 10,
        'margin-top': '10px',
    },
}));

const BookWindow = props => {
    // STATES
    const [date, setDate] = useState();
    const [timeState, setTime] = useState({
        time: '',
    });
    const [timepicker, setTimepicker] = useState();
    const classes = useStyles();
    const [valid, setValid] = useState(false);
    const [errors, setErrors] = useState({});

    const [cookies] = useCookies();

    const displayTimePicker = async () => {
        const removeItemOnce = (arr, value) => {
            let index = arr.indexOf(value);
            if (index > -1) {
                arr.splice(index, 1);
            }
            return arr;
        };
        let duration_hours = props.service.duration.slice(0, 2);
        let duration_minutes = props.service.duration.slice(2);
        let time_array = [];
        const addTimeSlices = () => {
            for (let avail in props.service.availability) {
                if (props.service.availability[avail].weekday == date.day()) {
                    let start_time = moment(
                        props.service.availability[avail].start_time,
                        'HH:mm'
                    );
                    let end_time = moment(
                        props.service.availability[avail].end_time,
                        'HH:mm'
                    );
                    let apt_time = moment(start_time)
                        .add(duration_hours, 'h')
                        .add(duration_minutes, 'm');
                    let curr_time = start_time;
                    while (apt_time <= end_time) {
                        time_array.push(moment(curr_time).format('HH:mm'));
                        curr_time.add(30, 'm');
                        apt_time.add(30, 'm');
                    }
                }
            }
        };
        const removeConflictingTimes = async () => {
            let res = await axios.get(
                `appointment/service/${props.service._id}`
            );

            let available_times = [];
            for (let appt in res.data.result) {
                let apt_date = moment(res.data.result[appt].booked_time);
                let apt_end_date = moment(apt_date)
                    .add(duration_hours, 'h')
                    .add(duration_minutes, 'm');
                if (apt_date.isSame(date, 'day')) {
                    for (let i in time_array) {
                        let extracted_date = date.format('YYYY-MM-DD');
                        let extracted_time = moment(
                            time_array[i],
                            'HH:mm'
                        ).format('HH:mm');
                        let booking_date = moment(
                            `${extracted_date} ${extracted_time}`,
                            'YYYY-MM-DD HH:mm'
                        );
                        let booking_date_end = moment(booking_date)
                            .add(duration_hours, 'h')
                            .add(duration_minutes, 'm');

                        if (
                            (booking_date >= apt_date &&
                                booking_date <= apt_end_date) ||
                            (booking_date_end >= apt_date &&
                                booking_date_end <= apt_end_date)
                        ) {
                            available_times.push(time_array[i]);
                        }
                    }
                }
            }
            for (let i in available_times) {
                removeItemOnce(time_array, available_times[i]);
            }
        };

        addTimeSlices();
        await removeConflictingTimes();

        setTimepicker(
            <FormControl className={classes.formControl}>
                <InputLabel id="label" className={classes.inputLabel}>
                    Appointment Time
                </InputLabel>
                <Select
                    labelId="label"
                    value={timeState.time}
                    onChange={x => handleChangeTime(x)}>
                    {time_array?.map((x, i) => {
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

    const bookAppointment = () => {
        if (valid) {
            let extracted_date = date.format('YYYY-MM-DD');
            let extracted_time = moment(timeState.time, 'HH:mm').format(
                'HH:mm:ss'
            );

            let booking_date = moment(
                `${extracted_date} ${extracted_time}`,
                'YYYY-MM-DD HH:mm:ss'
            ).toDate();
            axios
                .post(
                    `/appointment/${cookies.username}`,
                    {
                        service_id: props.service._id,
                        provider: props.service.provider,
                        booked_time: booking_date,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(res => {
                    if (!res.data.errors) {
                        alert(
                            `Successfully booked Service with ${props.service.provider}`
                        );
                    }
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

    const handleChangeTime = x => {
        setTime({ time: x.target.value });
    };

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

    const handleClick = () => {
        props.toggle();
    };

    return (
        <div className={classes.window}>
            <Typography variant="h4" className={classes.title}>
                Booking
            </Typography>
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
                        />
                        {timepicker}
                    </MuiPickersUtilsProvider>
                </form>
                <Button className={classes.submit} onClick={validate}>
                    CONFIRM
                </Button>
            </div>
            <span className={classes.close} onClick={handleClick}>
                &times;{' '}
            </span>
        </div>
    );
};

export default BookWindow;
