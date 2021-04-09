import React from 'react';
import { act, render } from '@testing-library/react';
import Home from '../../pages/Home';
import { BrowserRouter } from 'react-router-dom';

const blankComponent = () => {
    return <div></div>;
};

jest.mock('../../components/map/Map', () => {
    return {
        __esModule: true,
        default: () => {
            return blankComponent();
        },
    };
});
jest.mock('../../components/ServiceList', () => {
    return {
        __esModule: true,
        default: () => {
            return blankComponent();
        },
    };
});

describe('Home', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();

        const { asFragment } = render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();

        await act(() => promise);
    });
});
