import React from 'react';
import { act, render } from '@testing-library/react';
import Appointments from '../../pages/Appointments';
import { BrowserRouter } from 'react-router-dom';
import { mockAppointments } from '../../__mocks__/getMockAppointmentCard';
import mockAxios from 'axios';

const blankComponent = () => {
    return <div></div>;
};

jest.mock('react-cookie', () => {
    return {
        __esModule: true,
        useCookies: () => {
            return [{ username: 'yoyo' }];
        },
    };
});

jest.mock('../../components/Calendar', () => {
    return {
        __esModule: true,
        default: () => {
            return blankComponent();
        },
    };
});

describe('Appointments', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { result: mockAppointments },
            })
        );

        const { asFragment } = render(
            <BrowserRouter>
                <Appointments />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
        expect(mockAxios.get).toHaveBeenCalledWith('/appointment/yoyo');
        expect(mockAxios.get).toHaveBeenCalledTimes(1);

        await act(() => promise);
    });
});
