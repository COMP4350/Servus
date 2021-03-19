function getMockServiceList() {
    return [
        {
            name: "Risto's Painting",
            provider: 'Risto',
            description: 'Risto paints you',
            cost: 100,
            duration: 60,
        },
        {
            name: "Reesto's Painting",
            provider: 'Reesto',
            description: 'Reesto paints yee',
            cost: 120,
            duration: 80,
        },
        {
            name: "Rasta's Painting",
            provider: 'Rasta',
            description: 'Rasta paints yaa',
            cost: 150,
            duration: 90,
        },
    ];
}

export const mockServiceList = getMockServiceList();
