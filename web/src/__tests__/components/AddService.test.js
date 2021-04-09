import React from 'react';
import { render } from '@testing-library/react';
import AddService from '../../components/AddService';

describe('AddService', () => {
    it('renders correctly', () => {
        const { asFragment } = render(<AddService />);
        expect(asFragment()).toMatchSnapshot();
    });
});
