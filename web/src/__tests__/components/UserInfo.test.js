import React from 'react';
import { render } from '@testing-library/react';
import UserInfo from '../../components/UserInfo';

describe('UserInfo', () => {
    it('renders correctly', async () => {
        const { asFragment } = render(<UserInfo />);
        expect(asFragment()).toMatchSnapshot();
    });
});
