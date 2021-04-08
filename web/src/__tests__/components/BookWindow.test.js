import React from 'react';
import { render } from '@testing-library/react';
import BookWindow from '../../components/map/BookWindow';
import { mockService } from '../../__mocks__/getMockService';

const blankComponent = () => {
    return <div></div>;
};
jest.mock('@material-ui/pickers', () => {
    return {
        __esModule: true,
        DatePicker: () => {
            return blankComponent();
        },
        MuiPickersUtilsProvider: () => {
            return blankComponent();
        },
    };
});

describe('BookWindow', () => {
    it('renders correctly', () => {
        const { asFragment } = render(<BookWindow service={mockService} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
