import React from 'react';
import { act, render } from '@testing-library/react';
import Appointment from '../../pages/Appointments';
import { mockAppointments, mockAppointmentsCookie } from '../../__mocks__/getMockAppointments';
import mockAxios from 'axios';

describe('Appointments', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();
        let handleServiceUpdate = jest.fn(() => promise);
        let cookie = jest.fn(() => mockAppointmentsCookie)

        mockAxios.get.mockImplementationOnce(() => 
            Promise.resolve({
                data: { results: mockAppointments },
            })
        );

        const { asFragment } = render(
            <Appointment 
                setAppointments={handleServiceUpdate}
                setCookies={cookie}
            />
        )
        expect(asFragment()).toMatchSnapshot();
        expect(mockAxios.get).toHaveBeenCalledWith('/services/testusername');
        expect(mockAxios.get).toHaveBeenCalledTimes(1);

        await act(() => promise);
    });
});