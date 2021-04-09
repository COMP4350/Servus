import React from 'react';
import { act, render } from '@testing-library/react';
import SignUp from '../../pages/SignUp';

describe('SignUp', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();

        const { asFragment } = render(<SignUp />);

        expect(asFragment()).toMatchSnapshot();

        await act(() => promise);
    });
});
