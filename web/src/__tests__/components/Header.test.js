import React from 'react';
import { render } from '@testing-library/react';
import Header from '../../components/Header';
import { BrowserRouter } from 'react-router-dom';

describe('Header', () => {
    it('renders correctly', () => {
        const { asFragment } = render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
