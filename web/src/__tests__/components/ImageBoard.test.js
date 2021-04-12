import React from 'react';
import { act, render } from '@testing-library/react';
import ImageBoard from '../../components/ImageBoard';
import theme from '../../__mocks__/theme';
import { ThemeProvider } from '@material-ui/core/';
import { mockImage } from '../../__mocks__/getMockImage';

import mockAxios from 'axios';
jest.mock('react-router-dom', () => {
    return {
        __esModule: true,
        useParams: () => {
            return { targetUsername: 'yoyo' };
        },
    };
});

describe('ImageBoard', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();
        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { result: [mockImage] },
            })
        );

        const { asFragment } = render(
            <ThemeProvider theme={theme}>
                <ImageBoard />
            </ThemeProvider>
        );
        expect(asFragment()).toMatchSnapshot();
        expect(mockAxios.get).toHaveBeenCalledWith('/images/yoyo');
        expect(mockAxios.get).toHaveBeenCalledTimes(1);

        await act(() => promise);
    });
});
