import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    Typography,
    Button,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
} from '@material-ui/core';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    formControl: {
        width: 150,
        height: 40,
    },
}));

const ServiceWindow = props => {
    const [date, setDate] = useState();
    const [timeState, setTime] = useState({
        time: '',
    });
    const [timepicker, setTimepicker] = useState();

    const [errors, setErrors] = useState({});
    const [cookies] = useCookies();
    const history = useHistory();

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

    const classes = useStyles();
    const [valid, setValid] = useState(false);
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
                    if (res.data.errors) {
                        if (res.data.timeslot) {
                            if (res.data.timeslot.availability_start) {
                                alert(
                                    `Please book within timeslot ${res.data.timeslot.availability_start} to ${res.data.timeslot.availability_end}`
                                );
                            } else {
                                alert('Service not available on this day');
                            }
                        } else if (res.data.nocons) {
                            alert(
                                `Conflict with another appointment from time ${moment(
                                    res.data.nocons.conflict_start
                                )
                                    .local()
                                    .format('HH:mm')} to ${moment(
                                    res.data.nocons.conflict_end
                                )
                                    .local()
                                    .format('HH:mm')}`
                            );
                        } else {
                            alert(`Error occured when trying to book`);
                        }
                    } else {
                        alert(
                            `Successfully booked Service with ${props.service.provider}`
                        );
                    }
                })
                .catch(err => {
                    throw err;
                });
            setValid(false);
        }
    };

    useEffect(() => {
        if (cookies.username) bookAppointment();
        else if (history) history.push('/login');
        if (date) displayTimePicker();
    }, [valid, date, timeState]);

    const handleChangeTime = x => {
        console.log(x);
        setTime({ time: x.target.value });
    };
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
                <InputLabel id="label">Appointment Time</InputLabel>
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

    return (
        <Card>
            <Typography color="textSecondary">
                {props.service.provider}
            </Typography>
            <Typography variant="h5">{props.service.name}</Typography>
            <Typography variant="body2" component="p">
                {props.service.description}
            </Typography>
            <Typography variant="caption" component="p">
                {`Duration: ${moment(props.service.duration, 'HHmm').format(
                    'HH:mm'
                )}`}
            </Typography>
            <form className={classes.container} noValidate>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <div className="timepicker">
                        <DatePicker
                            label={'Appointment Date'}
                            value={date}
                            initialFocusedDate={Date.now()}
                            onAccept={setDate}
                            onChange={setDate}
                            name="date"
                            autoOk={true}
                            disablePast={true}
                            errors={errors.date}
                            shouldDisableDate={shouldDisableDay}
                        />
                        {timepicker}
                    </div>
                </MuiPickersUtilsProvider>
            </form>
            <Button onClick={validate}>BOOK</Button>
        </Card>
    );
};

export default ServiceWindow;
