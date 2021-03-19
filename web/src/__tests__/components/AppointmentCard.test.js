import React from 'react';
import { act, render } from '@testing-library/react';
import AppointmentCard from '../../components/AppointmentCard';
import { mockAppointmentCard } from '../../__mocks__/getMockAppointmentCard';
import mockAxios from 'axios';

describe('AppointmentCard', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();
        let handleServiceUpdate = jest.fn(() => promise);
        let mockResult = mockAppointmentCard;

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { result: mockResult },
            })
        );

        const { asFragment } = render(
            <AppointmentCard 
                service={mockResult}
                setService={handleServiceUpdate}
            />
        )
        expect(asFragment()).toMatchSnapshot();
        expect(mockAxios.get).toHaveBeenCalledWith('/services/undefined');
        expect(mockAxios.get).toHaveBeenCalledTimes(1);

        await act(() => promise);
    });
});