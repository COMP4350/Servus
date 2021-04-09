import React from 'react';
import { act, render } from '@testing-library/react';
import ProfilePicture from '../../components/ProfilePicture';
import mockAxios from 'axios';

describe('ProfilePicture', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { results: '' },
            })
        );

        const { asFragment } = render(<ProfilePicture username={'testuser'} />);
        expect(mockAxios.get).toHaveBeenCalledWith('/images/testuser/profile');
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(asFragment()).toMatchSnapshot();

        await act(() => promise);
    });
});
