import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableCell from '@material-ui/core/TableCell';
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

const getBorder = theme => (`1px solid ${theme.palette.type === 'light'
    ? lighten(fade(theme.palette.divider, 1), 0.88)
    : darken(fade(theme.palette.divider, 1), 0.68)
    }`);

const DayScaleCell = props => (
    <MonthView.DayScaleCell {...props} style={{ textAlign: 'center', fontWeight: 'bold' }} />
);

const styles = theme => ({
    cell: {
        color: '#78909C',
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
        color: '#78909C',
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
        color: '#78909C',
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
            <Typography variant="h5" style={{ marginLeft: '10px' }}>My Calendar</Typography>
        </div>
    </Toolbar.FlexibleSpace>
));

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
let setColor = false;

const Calendar = ({ appointments }) => {

    const [data, setData] = useState([]);
    const [owners, setOwners] = useState([]);
    const newDate = new Date();

    const commitDeletes = async ({ deleted }) => {
        const response = await axios.delete(`/appointment/${deleted}`);
        console.log(`im the response: ${response}`);
        setData(data.filter(apt => apt._id !== deleted));
    }

    const passInfo = () => {
        setOwners([]);
        setData([]);
        appointments?.forEach((apt, i) => {
            const newOwner = {
                text: apt.provider,
                id: i,
                color: getRandomColor(),
            }
            setOwners(owners => [...owners, newOwner]);
            axios.get(`/services/${apt.service_id}`)
                .then(response => {
                    const service = response.data.result;
                    const startDate = new Date(apt.booked_time);
                    const endDate = new Date(startDate);
                    endDate.setTime(endDate.getTime() + service.duration * 60 * 1000);
                    const tempObj = {
                        id: apt._id,
                        title: service.name,
                        startDate: startDate,
                        endDate: endDate,
                        ownerId: i,
                    }
                    setData(data => [...data, tempObj]);
                }
                );
        });
        setColor = false;
    }
    if (!setColor && appointments.length === owners.length) {
        owners?.forEach(name => {
            for (let i = 1; i < owners.length; i++) {
                if (name.text === owners[i].text && owners[i].color !== name.color) {
                    owners[i].color = name.color;
                }
            }
        });
        setColor = true;
    }
    const resources = [{
        fieldName: 'ownerId',
        title: 'Owners',
        instances: owners,
    }];

    useEffect(() => {
        passInfo();
    }, [])

    return (
        <Scheduler
            data={data}
        >
            <EditingState
                onCommitChanges={commitDeletes}
            />
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
    );
}

export default Calendar;