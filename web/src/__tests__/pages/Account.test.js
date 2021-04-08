import React from 'react';
import { act, render } from '@testing-library/react';
import Account from '../../pages/Account';
import { mockUser } from '../../__mocks__/getMockUser';
import mockAxios from 'axios';

jest.mock('react-cookie', () => {
    return {
        __esModule: true,
        useCookies: () => {
            return [{ username: 'testuser' }];
        },
    };
});

describe('Account', () => {
    it('renders correctly', async () => {
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { result: mockUser },
            })
        );
        const promise = Promise.resolve();

        const { asFragment } = render(<Account />);

        expect(asFragment()).toMatchSnapshot();
        expect(mockAxios.get).toHaveBeenCalledWith('/user/testuser');

        await act(() => promise);
    });
});
