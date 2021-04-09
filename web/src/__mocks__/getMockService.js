function getMockService() {
    return {
        _id: '1001',
        name: "Risto's Painting",
        provider: 'Risto',
        description: 'Risto paints you',
        cost: 100,
        duration: '0100',
        availability: [{ weekday: 1, start_time: '0800', end_time: '1800' }],
        ratings: [{ username: 'arvind', rating: 5 }],
    };
}

export const mockService = getMockService();
