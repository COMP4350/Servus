import React from 'react';
import { render } from '@testing-library/react';
import UserInfo from '../../components/UserInfo';
import { ThemeProvider } from '@material-ui/core/';
import theme from '../../__mocks__/theme';

describe('UserInfo', () => {
    it('renders correctly', async () => {
        const { asFragment } = render(
            <ThemeProvider theme={theme}>
                <UserInfo />
            </ThemeProvider>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
