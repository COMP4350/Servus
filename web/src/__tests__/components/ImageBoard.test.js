import React from 'react';
import { act, render } from '@testing-library/react';
import ImageBoard from '../../components/ImageBoard';
import theme from '../../__mocks__/theme';
import { ThemeProvider } from '@material-ui/core/';

describe('ImageBoard', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();

        const { asFragment } = render(
            <ThemeProvider theme={theme}>
                <ImageBoard username={'yoyo'} />
            </ThemeProvider>
        );
        expect(asFragment()).toMatchSnapshot();

        await act(() => promise);
    });
});
