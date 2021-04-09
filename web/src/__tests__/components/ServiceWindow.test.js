import React from 'react';
import { act, render } from '@testing-library/react';
import ServiceWindow from '../../components/map/ServiceWindow';
import { mockService } from '../../__mocks__/getMockService';

const blankComponent = () => {
    return <div></div>;
};

jest.mock('../../components/ProfilePicture', () => {
    return {
        __esModule: true,
        default: () => {
            return blankComponent();
        },
    };
});
jest.mock('../../components/map/BookWindow', () => {
    return {
        __esModule: true,
        default: () => {
            return blankComponent();
        },
    };
});

describe('ServiceWindow', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();

        const { asFragment } = render(<ServiceWindow service={mockService} />);

        expect(asFragment()).toMatchSnapshot();
        await act(() => promise);
    });
});
