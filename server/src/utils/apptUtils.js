const Appointment = require('../db/models/appointment.js');
const moment = require('moment');

const convertToHHMM = datetime => {
    const minutes =
        datetime.getMinutes() >= 10
            ? `${datetime.getMinutes()}`
            : `0${datetime.getMinutes()}`;
    return `${datetime.getHours()}${minutes}`;
};

const inTimeSlot = (service, request) => {
    for (let index in service.availability) {
        let availability = service.availability[index];
        if (
            new Date(request.body.booked_time).getDay() == availability.weekday
        ) {
            //so the service is available on the DAY
            //now we must check time slot
            const desired_time = convertToHHMM(
                new Date(request.body.booked_time)
            );
            if (
                !(
                    parseInt(availability.start_time) <= desired_time &&
                    parseInt(availability.end_time) <
                        desired_time + parseInt(service.duration)
                )
            ) {
                return false;
            }
        }
    }
    return true;
};

const noConflicts = (service, request) => {
    const duration_hours = service.duration.slice(0, 2);
    const duration_minutes = service.duration.slice(2);
    const desired_start_time = moment(new Date(request.body.booked_time));
    const desired_end_time = moment(new Date(request.body.booked_time))
        .add(duration_hours, 'h')
        .add(duration_minutes, 'm');

    return new Promise((resolve, reject) => {
        Appointment.find({ service_id: service._id })
            .then(appointments => {
                for (let index in appointments) {
                    let appointment = appointments[index];
                    let apt_start_time = moment(
                        new Date(appointment.booked_time)
                    );
                    let apt_end_time = moment(new Date(appointment.booked_time))
                        .add(duration_hours, 'h')
                        .add(duration_minutes, 'm');
                    //check if the desired_time collides with the appointment timeslot
                    if (
                        apt_start_time <= desired_start_time &&
                        apt_end_time >= desired_start_time
                    ) {
                        return resolve(false);
                    }
                    if (
                        apt_start_time <= desired_end_time &&
                        apt_end_time >= desired_end_time
                    ) {
                        return resolve(false);
                    }
                }
                return resolve(true);
            })
            .catch(err => {
                return reject(err);
            });
    });
};

module.exports = { inTimeSlot, noConflicts, convertToHHMM };
