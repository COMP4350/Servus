import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import axios from 'axios';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import { EditingState, ViewState } from '@devexpress/dx-react-scheduler';
import classNames from 'clsx';
import {
    Scheduler,
    MonthView,
    Appointments,
    Toolbar,
    DateNavigator,
    AppointmentTooltip,
    AppointmentForm,
    EditRecurrenceMenu,
    Resources,
    DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';


const owners = [
    {
        text: 'zimbakor',
        id: 1,
        color: '#7E57C2',
    }, {
        text: 'arvind',
        id: 2,
        color: '#FF7043',
    }, {
        text: 'Andus odonus',
        id: 3,
        color: '#E91E63',
    }, {
        text: 'Taylor Riley',
        id: 4,
        color: '#E91E63',
    }, {
        text: 'Brad Farkus',
        id: 5,
        color: '#AB47BC',
    }, {
        text: 'Arthur Miller',
        id: 6,
        color: '#FFA726',
    },
];


const resources = [{
    fieldName: 'ownerId',
    title: 'Owners',
    instances: owners,
}];

const getBorder = theme => (`1px solid ${theme.palette.type === 'light'
    ? lighten(fade(theme.palette.divider, 1), 0.88)
    : darken(fade(theme.palette.divider, 1), 0.68)
    }`);

const DayScaleCell = props => (
    <MonthView.DayScaleCell {...props} style={{ textAlign: 'center', fontWeight: 'bold' }} />
);

const styles = theme => ({
    cell: {
        color: '#78909C!important',
        position: 'relative',
        userSelect: 'none',
        verticalAlign: 'top',
        padding: 0,
        height: 100,
        borderLeft: getBorder(theme),
        '&:first-child': {
            borderLeft: 'none',
        },
        '&:last-child': {
            paddingRight: 0,
        },
        'tr:last-child &': {
            borderBottom: 'none',
        },
        '&:hover': {
            backgroundColor: 'white',
        },
        '&:focus': {
            backgroundColor: fade(theme.palette.primary.main, 0.15),
            outline: 0,
        },
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
    },
    text: {
        padding: '0.5em',
        textAlign: 'center',
    },
    sun: {
        color: '#FFEE58',
    },
    cloud: {
        color: '#90A4AE',
    },
    rain: {
        color: '#4FC3F7',
    },
    sunBack: {
        backgroundColor: '#FFFDE7',
    },
    cloudBack: {
        backgroundColor: '#ECEFF1',
    },
    rainBack: {
        backgroundColor: '#E1F5FE',
    },
    opacity: {
        opacity: '0.5',
    },
    appointment: {
        borderRadius: '10px',
        '&:hover': {
            opacity: 0.6,
        },
    },
    apptContent: {
        '&>div>div': {
            whiteSpace: 'normal !important',
            lineHeight: 1.2,
        },
    },
    flexibleSpace: {
        flex: 'none',
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    tooltipContent: {
        padding: theme.spacing(3, 1),
        paddingTop: 0,
        backgroundColor: theme.palette.background.paper,
        boxSizing: 'border-box',
        width: '400px',
    },
    tooltipText: {
        ...theme.typography.body2,
        display: 'inline-block',
    },
    title: {
        ...theme.typography.h6,
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightBold,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    icon: {
        color: theme.palette.action.active,
        verticalAlign: 'middle',
    },
    circle: {
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
        verticalAlign: 'super',
    },
    textCenter: {
        textAlign: 'center',
    },
    dateAndTitle: {
        lineHeight: 1.1,
    },
    titleContainer: {
        paddingBottom: theme.spacing(2),
    },
    container: {
        paddingBottom: theme.spacing(1.5),
    },
});

// #FOLD_BLOCK
const CellBase = React.memo(({
    classes,
    startDate,
    formatDate,
    otherMonth,
    // #FOLD_BLOCK
}) => {
    const isFirstMonthDay = startDate.getDate() === 1;
    const formatOptions = isFirstMonthDay
        ? { day: 'numeric', month: 'long' }
        : { day: 'numeric' };
    return (
        <TableCell
            tabIndex={0}
            className={classNames({
                [classes.cell]: true,
                [classes.opacity]: otherMonth,
            })}
        >
            <div className={classes.content}>
            </div>
            <div className={classes.text}>
                {formatDate(startDate, formatOptions)}
            </div>
        </TableCell>
    );
});

const TimeTableCell = withStyles(styles, { name: 'Cell' })(CellBase);

const Appointment = withStyles(styles, { name: 'Appointment' })(({ classes, ...restProps }) => (
    <Appointments.Appointment
        {...restProps}
        className={classes.appointment}
    />
));

const AppointmentContent = withStyles(styles, { name: 'AppointmentContent' })(({ classes, ...restProps }) => (
    <Appointments.AppointmentContent {...restProps} className={classes.apptContent} />
));

const FlexibleSpace = withStyles(styles, { name: 'ToolbarRoot' })(({ classes, ...restProps }) => (
    <Toolbar.FlexibleSpace {...restProps} className={classes.flexibleSpace}>
        <div className={classes.flexContainer}>
            <Typography variant="h5" sytyle={{ marginLeft: '10px' }}>My Calendar</Typography>
        </div>
    </Toolbar.FlexibleSpace>
));

/*  MUBY ARVY
Provider: arvind
Info: Make up by the best maan!
$: 40CAD
Time: 0100*/

// const appointments = [
//     {
//       id: 0,
//       title: 'Big Cuts from Big Risto',
//       startDate: new Date(2021, 2, 25, 9, 30),
//       endDate: new Date(2021, 2, 25, 11, 30),
//       ownerId: 1,
//     },
//     {
//         id: 1,
//         title: 'Make up by the best maan!',
//         startDate: new Date(2021, 2, 28, 9, 30),
//         endDate: new Date(2021, 2, 28, 11, 30),
//         ownerId: 2,
//     },
//     {
//         id: 1,
//         title: 'MUBY ARVY',
//         startDate: new Date(2021, 2, 28, 9, 30),
//         endDate: new Date(2021, 2, 28, 11, 30),
//         ownerId: 2,
//     },
//     {
//         id: 2,
//         title: 'Make up by the best maan!',
//         startDate: new Date(2021, 2, 3, 9, 30),
//         endDate: new Date(2021, 2, 3, 11, 30),
//         ownerId: 2,
//     }
// ] 

const Calendar = ({ appointments }) => {
    console.log(appointments);
    const [data, setData] = useState();
    const newDate = new Date();

    const passData = () => {
        appointments?.map((apt, i) => {
            axios.get(`/service/${apt.service_id}`)
                .then(response => {
                    console.log(response.data.result);
                    const service = response.data.result;
                    const endtime = apt.booked_time;
                    endtime.setTime(endtime.getTime() + service.duration * 60 * 1000);
                    return {
                        id: i,
                        title: service.name,
                        startDate: apt.booked_time,
                        endDate: endtime,
                        ownerId: 2,
                    }
                }
                );
        })
    }


    useEffect(() => {
        if (!data) {
            setData(passData());
        }
    }, [])

    return (
        <Paper>
            <Scheduler
                data={data}
            >
                <EditingState></EditingState>
                <ViewState
                    defaultCurrentDate={newDate}
                />

                <MonthView
                    timeTableCellComponent={TimeTableCell}
                    dayScaleCellComponent={DayScaleCell}
                />

                <Appointments
                    appointmentComponent={Appointment}
                    appointmentContentComponent={AppointmentContent}
                />
                <Resources
                    data={resources}
                />

                <Toolbar
                    flexibleSpaceComponent={FlexibleSpace}
                />
                <DateNavigator />

                <EditRecurrenceMenu />
                <AppointmentTooltip
                    showCloseButton
                    showDeleteButton
                    showOpenButton
                />
                <AppointmentForm />
                <DragDropProvider />
            </Scheduler>
        </Paper>
    );
}

export default Calendar;