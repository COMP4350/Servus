import React from 'react';
import { render } from '@testing-library/react';
import ServiceList from '../../components/ServiceList';

describe('ServiceList', () => {
    it('renders correctly', () => {
        const { asFragment } = render(<ServiceList />);
        expect(asFragment()).toMatchSnapshot();
    });
});
