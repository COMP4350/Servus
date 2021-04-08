function getMockAppointmentCard() {
    return {
        _id: '123',
        buyer: 'Risto',
        provider: 'Arveend',
        service_id: '1001',
        created_at: new Date(100),
        booked_time: new Date(500),
    };
}

export const mockAppointmentCard = getMockAppointmentCard();
export const mockAppointments = [getMockAppointmentCard()];
