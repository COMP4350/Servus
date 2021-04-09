import React from 'react';
import { act, render } from '@testing-library/react';
import Calendar from '../../components/Calendar';
import { mockAppointments } from '../../__mocks__/getMockAppointmentCard';
import { mockService } from '../../__mocks__/getMockService';

import mockAxios from 'axios';

describe('Calendar', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { result: mockService },
            })
        );

        const { asFragment } = render(
            <Calendar appointments={mockAppointments} />
        );
        expect(mockAxios.get).toHaveBeenCalledWith('/services/1001');
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(asFragment()).toMatchSnapshot();

        await act(() => promise);
    });
});
