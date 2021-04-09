import React from 'react';
import { act, render } from '@testing-library/react';
import Login from '../../pages/Login';

describe('Login', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();

        const { asFragment } = render(<Login />);

        expect(asFragment()).toMatchSnapshot();

        await act(() => promise);
    });
});
