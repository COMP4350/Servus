import React from 'react';
import { act, render } from '@testing-library/react';
import Map from '../../components/map/Map';

const blankComponent = () => {
    return <div></div>;
};

jest.mock('@react-google-maps/api', () => {
    return {
        __esModule: true,
        useJsApiLoader: () => {
            return { isLoaded: true };
        },
        GoogleMap: () => {
            return blankComponent();
        },
        Autocomplete: () => {
            return blankComponent();
        },
    };
});
describe('Map', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();

        const { asFragment } = render(<Map />);

        expect(asFragment()).toMatchSnapshot();

        await act(() => promise);
    });
});
