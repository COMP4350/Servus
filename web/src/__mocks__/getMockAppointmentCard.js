function getMockAppointmentCard() {
    return {
        buyer: 'Risto',
        provider: 'Arveend',
        service_id: '1001',
        created_at: new Date(100),
        booked_time: new Date(500),
    }
}

export const mockAppointmentCard = getMockAppointmentCard();