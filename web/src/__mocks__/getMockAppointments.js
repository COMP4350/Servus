function getMockAppointments() {
    return [
        {
            buyer: 'Risto',
            provider: 'Arveend',
            service_id: '1001',
            created_at: new Date(100),
            booked_time: new Date(500),
        },
        {
            buyer: 'Arveend',
            provider: 'Risto',
            service_id: '1002',
            created_at: new Date(700),
            booked_time: new Date(1200),
        },
        {
            buyer: 'Caden',
            provider: 'Andy',
            service_id: '1003',
            created_at: new Date(1400),
            booked_time: new Date(1900),
        },
    ]
}

function getMockAppointmentsCookie() {
    return {
        username: 'testusername',
    }
}

export const mockAppointments = getMockAppointments();
export const mockAppointmentsCookie = getMockAppointmentsCookie();