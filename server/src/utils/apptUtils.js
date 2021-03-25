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
    let duration_hours = service.duration.slice(0, 2);
    let duration_minutes = service.duration.slice(2);
    let desired_start_time = moment(request.body.booked_time).format('HHmm');
    let desired_end_time = moment(request.body.booked_time)
        .add(duration_hours, 'H')
        .add(duration_minutes, 'm')
        .format('HHmm');

    for (let index in service.availability) {
        let availability = service.availability[index];
        if (
            new Date(request.body.booked_time).getDay() == availability.weekday
        ) {
            //so the service is available on the DAY
            //now we must check time slot
            let start_t = moment(availability.start_time, 'HHmm').format(
                'HHmm'
            );
            let end_t = moment(availability.end_time, 'HHmm').format('HHmm');
            if (start_t > desired_start_time || desired_end_time >= end_t) {
                return {
                    success: false,
                    availability_start: start_t,
                    availability_end: end_t,
                    desired_start_time: desired_start_time,
                    desired_end_time: desired_end_time,
                };
            }
            return {
                success: true,
                availability_start: availability.start_time,
                availability_end: availability.end_time,
                desired_start_time: desired_start_time,
                desired_end_time: desired_end_time,
            };
        }
    }
    return { success: true };
};

const noConflicts = (service, request) => {
    let duration_hours = service.duration.slice(0, 2);
    let duration_minutes = service.duration.slice(2);
    let desired_start_time = moment(new Date(request.body.booked_time));
    let desired_end_time = moment(new Date(request.body.booked_time))
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
                        return resolve({
                            success: false,
                            conflict_start: apt_start_time,
                            conflict_end: apt_end_time,
                        });
                    }
                    if (
                        apt_start_time <= desired_end_time &&
                        apt_end_time >= desired_end_time
                    ) {
                        return resolve({
                            success: false,
                            conflict_start: apt_start_time,
                            conflict_end: apt_end_time,
                        });
                    }
                }
                return resolve({
                    success: true,
                    apt_start: desired_start_time,
                    apt_end: desired_end_time,
                });
            })
            .catch(err => {
                return reject(err);
            });
    });
};

module.exports = { inTimeSlot, noConflicts, convertToHHMM };
