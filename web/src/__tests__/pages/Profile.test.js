import React from 'react';
import { act, render } from '@testing-library/react';
import Profile from '../../pages/Profile';
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

jest.mock('react-router-dom', () => {
    return {
        __esModule: true,
        useHistory: () => {
            return { push: () => {} };
        },
        useParams: () => {
            return { targetUsername: 'testuser' };
        },
    };
});

const blankComponent = () => {
    return <div></div>;
};

jest.mock('../../components/UserInfo', () => {
    return {
        __esModule: true,
        default: () => {
            return blankComponent();
        },
    };
});
jest.mock('../../components/ImageBoard', () => {
    return {
        __esModule: true,
        default: () => {
            return blankComponent();
        },
    };
});

describe('Profile', () => {
    it('renders correctly', async () => {
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { result: mockUser },
            })
        );
        const promise = Promise.resolve();

        const { asFragment } = render(<Profile />);

        expect(asFragment()).toMatchSnapshot();
        expect(mockAxios.get).toHaveBeenCalledWith('/user/testuser');

        await act(() => promise);
    });
});
