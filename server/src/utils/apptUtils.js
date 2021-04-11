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
    let durationInHours = service.duration.slice(0, 2);
    let durationInMinutes = service.duration.slice(2);
    let desiredStartTime = moment(request.body.booked_time).format('HHmm');
    let desiredEndTime = moment(request.body.booked_time)
        .add(durationInHours, 'H')
        .add(durationInMinutes, 'm')
        .format('HHmm');

    for (let index in service.availability) {
        let availability = service.availability[index];
        if (new Date(request.body.booked_time).getDay() == availability.weekday) {
            //so the service is available on the DAY
            //now we must check time slot
            let availabilityStartTime = moment(availability.start_time, 'HHmm').format('HHmm');
            let availabilityEndTime = moment(availability.end_time, 'HHmm').format('HHmm');
            if (availabilityStartTime > desiredStartTime || desiredEndTime > availabilityEndTime)
                return { success: false };
            else
                return { success: true };
        }
    }
    return { success: true };
};

const noConflicts = (service, request) => {
    let durationInHours = service.duration.slice(0, 2);
    let durationInMinutes = service.duration.slice(2);
    let desiredStartTime = moment(new Date(request.body.booked_time));
    let desiredEndTime = moment(new Date(request.body.booked_time))
        .add(durationInHours, 'h')
        .add(durationInMinutes, 'm');

    return new Promise((resolve, reject) => {
        Appointment.find({ service_id: service._id })
            .then(appointments => {
                for (let index in appointments) {
                    let appointment = appointments[index];
                    let appointmentStartTime = moment(new Date(appointment.booked_time));
                    let appointmentEndTime = moment(new Date(appointment.booked_time))
                        .add(durationInHours, 'h')
                        .add(durationInMinutes, 'm');
                    //check if the desired_time collides with the appointment timeslot
                    if (appointmentStartTime <= desiredStartTime && appointmentEndTime >= desiredStartTime)
                        return resolve({ success: false });
                    if (appointmentStartTime <= desiredEndTime && appointmentEndTime >= desiredEndTime)
                        return resolve({ success: false });
                }
                return resolve({ success: true });
            })
            .catch(err => {
                return reject(err);
            });
    });
};

module.exports = { inTimeSlot, noConflicts, convertToHHMM };
