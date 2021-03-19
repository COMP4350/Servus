import React from 'react';
import { render } from '@testing-library/react';
import ServiceCard from '../../components/ServiceCard';
import { mockService } from '../../__mocks__/getMockService';

describe('ServiceCard', () => {
    it('renders correctly', () => {
        const { asFragment } = render(
            <ServiceCard
                key={1}
                service={mockService}
                index={1}
                bg={{ backgroundColor: '#647AA3' }}
            />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
