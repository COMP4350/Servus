import React from 'react';
import { act, render } from '@testing-library/react';
import ServiceList from '../../components/ServiceList';
import { mockServiceList } from '../../__mocks__/getMockServiceList';
import mockAxios from 'axios';
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

describe('ServiceList', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();
        let handleServiceUpdate = jest.fn(() => promise);

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { results: mockServiceList },
            })
        );

        const { asFragment } = render(
            <ThemeProvider theme={theme}>
                <ServiceList setServices={handleServiceUpdate} />
            </ThemeProvider>
        );
        expect(asFragment()).toMatchSnapshot();
        expect(mockAxios.post).toHaveBeenCalledWith('/services/filter', {
            tags: [],
        });
        expect(mockAxios.post).toHaveBeenCalledTimes(1);

        await act(() => promise);
    });
});
