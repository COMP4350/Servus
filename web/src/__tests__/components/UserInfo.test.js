import React from 'react';
import { render } from '@testing-library/react';
import UserInfo from '../../components/UserInfo';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#647AA3',
        },
        secondary: {
            main: '#EC5732',
        },
        default: {
            main: '#FFF2EB',
        },
    },
    background: {
        dark: '#151515',
        main: '#272727',
    },
    typographs: {
        fontFamily: ['Roboto'],
    },
});

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
